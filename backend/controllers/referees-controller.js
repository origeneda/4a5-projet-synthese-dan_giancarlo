import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import Referee from "../models/referee.js";
import Match from "../models/match.js";
import HttpError from "../util/http-error.js";

const getReferees = async (req, res, next) => {
    try {
        const referees = await Referee.find({}, "-password").populate("matches");
        res.json({ referees });
    } catch (error) {
        next(new HttpError("Impossible de récupérer les arbitres.", 500));
    }
};

const getRefereeById = async (req, res, next) => {
    try {
        const referee = await Referee.findById(req.params.rid, "-password").populate("matches");
        if (!referee) {
            return next(new HttpError("Arbitre introuvable.", 404));
        }

        res.json({ referee });
    } catch (error) {
        next(new HttpError("Impossible de récupérer l'arbitre.", 500));
    }
};

const createReferee = async (req, res, next) => {
    const { name, email, password, age, level, region, photo } = req.body;

    try {
        const existingReferee = await Referee.findOne({ email });
        if (existingReferee) {
            return next(new HttpError("Un arbitre existe déjà avec ce courriel.", 422));
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const referee = new Referee({
            name,
            email,
            password: hashedPassword,
            age,
            level,
            region,
            photo,
        });

        await referee.save();

        res.status(201).json({
            referee: {
                id: referee.id,
                name: referee.name,
                email: referee.email,
                age: referee.age,
                level: referee.level,
                region: referee.region,
                photo: referee.photo,
                matches: referee.matches,
            },
        });
    } catch (error) {
        next(new HttpError("Impossible de créer l'arbitre.", 500));
    }
};

const updateReferee = async (req, res, next) => {
    const { name, email, password, age, level, region, photo } = req.body;

    try {
        const referee = await Referee.findById(req.params.rid);
        if (!referee) {
            return next(new HttpError("Arbitre introuvable.", 404));
        }

        referee.name = name ?? referee.name;
        referee.email = email ?? referee.email;
        referee.age = age ?? referee.age;
        referee.level = level ?? referee.level;
        referee.region = region ?? referee.region;
        referee.photo = photo ?? referee.photo;

        if (password) {
            referee.password = await bcrypt.hash(password, 12);
        }

        await referee.save();

        res.json({
            referee: {
                id: referee.id,
                name: referee.name,
                email: referee.email,
                age: referee.age,
                level: referee.level,
                region: referee.region,
                photo: referee.photo,
                matches: referee.matches,
            },
        });
    } catch (error) {
        next(new HttpError("Impossible de mettre à jour l'arbitre.", 500));
    }
};

const deleteReferee = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const referee = await Referee.findById(req.params.rid).session(session);
        if (!referee) {
            await session.abortTransaction();
            return next(new HttpError("Arbitre introuvable.", 404));
        }

        await Match.updateMany(
            { _id: { $in: referee.matches } },
            { $pull: { referees: referee._id } },
            { session },
        );
        await Referee.findByIdAndDelete(req.params.rid, { session });
        await session.commitTransaction();

        res.json({ message: "Arbitre supprimé." });
    } catch (error) {
        await session.abortTransaction();
        next(new HttpError("Impossible de supprimer l'arbitre.", 500));
    } finally {
        session.endSession();
    }
};

export {
    getReferees,
    getRefereeById,
    createReferee,
    updateReferee,
    deleteReferee,
};