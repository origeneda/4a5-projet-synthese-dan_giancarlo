import Match from "../models/match.js";
import Referee from "../models/referee.js";
import mongoose from "mongoose";

const getMatches = async (req, res, next) => {
  try {
    const matches = await Match.find().populate("referees", "-password");
    res.json({ matches });
  } catch {
    next(new Error("Impossible de récupérer les matchs"));
  }
};

const createMatch = async (req, res, next) => {
  const { teamA, teamB, date, location } = req.body;
  try {
    const match = new Match({ teamA, teamB, date, location });
    await match.save();
    res.status(201).json({ match });
  } catch {
    next(new Error("Impossible de créer le match"));
  }
};

const updateMatch = async (req, res, next) => {
  const { teamA, teamB, date, location, status, scoreA, scoreB } = req.body;
  try {
    const match = await Match.findByIdAndUpdate(
      req.params.mid,
      { teamA, teamB, date, location, status, scoreA, scoreB },
      { new: true },
    );
    res.json({ match });
  } catch {
    next(new Error("Impossible de mettre à jour le match"));
  }
};

const deleteMatch = async (req, res, next) => {
  try {
    await Match.findByIdAndDelete(req.params.mid);
    res.json({ message: "Match supprimé" });
  } catch {
    next(new Error("Impossible de supprimer le match"));
  }
};

const assignReferee = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const match = await Match.findById(req.params.mid).session(session);
    const referee = await Referee.findById(req.body.refereeId).session(session);
    if (!match || !referee) throw new Error("Match ou arbitre introuvable");
    match.referees.push(referee);
    referee.matches.push(match);
    await match.save({ session });
    await referee.save({ session });
    await session.commitTransaction();
    res.json({ message: "Arbitre assigné" });
  } catch (err) {
    await session.abortTransaction();
    const error = new Error("Erreur d'assignation");
    error.code = 500;
    next(error);
  } finally {
    session.endSession();
  }
};

export { getMatches, createMatch, updateMatch, deleteMatch, assignReferee };
