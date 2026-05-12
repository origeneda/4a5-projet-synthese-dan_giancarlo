import Match from "../models/match.js";
import Referee from "../models/referee.js";
import mongoose from "mongoose";
import HttpError from "../util/http-error.js";

const getMatches = async (req, res, next) => {
  try {
    const matches = await Match.find().populate("referees", "-password");
    res.json({ matches });
  } catch {
    next(new HttpError("Impossible de récupérer les matchs", 500));
  }
};

const getMatchById = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.mid).populate("referees", "-password");
    if (!match) {
      return next(new HttpError("Match introuvable", 404));
    }

    res.json({ match });
  } catch {
    next(new HttpError("Impossible de récupérer le match", 500));
  }
};

const createMatch = async (req, res, next) => {
  const { teamA, teamB, date, location } = req.body;
  try {
    const match = new Match({ teamA, teamB, date, location });
    await match.save();
    res.status(201).json({ match });
  } catch {
    next(new HttpError("Impossible de créer le match", 500));
  }
};

const updateMatch = async (req, res, next) => {
  const { teamA, teamB, date, location, status, scoreA, scoreB } = req.body;
  try {
    const match = await Match.findById(req.params.mid);
    if (!match) {
      return next(new HttpError("Match introuvable", 404));
    }

    match.teamA = teamA ?? match.teamA;
    match.teamB = teamB ?? match.teamB;
    match.date = date ?? match.date;
    match.location = location ?? match.location;
    match.status = status ?? match.status;
    match.scoreA = scoreA ?? match.scoreA;
    match.scoreB = scoreB ?? match.scoreB;

    await match.save();

    res.json({ match });
  } catch {
    next(new HttpError("Impossible de mettre à jour le match", 500));
  }
};

const deleteMatch = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const match = await Match.findById(req.params.mid).session(session);
    if (!match) {
      await session.abortTransaction();
      return next(new HttpError("Match introuvable", 404));
    }

    await Referee.updateMany(
      { _id: { $in: match.referees } },
      { $pull: { matches: match._id } },
      { session },
    );
    await Match.findByIdAndDelete(req.params.mid, { session });
    await session.commitTransaction();

    res.json({ message: "Match supprimé" });
  } catch {
    await session.abortTransaction();
    next(new HttpError("Impossible de supprimer le match", 500));
  } finally {
    session.endSession();
  }
};

const assignReferee = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const match = await Match.findById(req.params.mid).session(session);
    const referee = await Referee.findById(req.body.refereeId).session(session);
    if (!match || !referee) {
      throw new HttpError("Match ou arbitre introuvable", 404);
    }

    const refereeAlreadyAssigned = match.referees.some(
      (assignedRefereeId) => assignedRefereeId.toString() === referee.id,
    );
    if (refereeAlreadyAssigned) {
      throw new HttpError("Cet arbitre est déjà assigné à ce match", 409);
    }

    match.referees.push(referee);
    referee.matches.push(match);
    await match.save({ session });
    await referee.save({ session });
    await session.commitTransaction();
    res.json({ message: "Arbitre assigné" });
  } catch (err) {
    await session.abortTransaction();
    const error = err.code ? err : new HttpError("Erreur d'assignation", 500);
    next(error);
  } finally {
    session.endSession();
  }
};

export { getMatches, getMatchById, createMatch, updateMatch, deleteMatch, assignReferee };
