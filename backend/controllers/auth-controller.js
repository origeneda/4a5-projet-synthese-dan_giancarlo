import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import HttpError from "../util/http-error.js";

const register = async (req, res, next) => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new HttpError("Un utilisateur existe déjà avec ce courriel.", 422));
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });

        await user.save();

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: "1h" },
        );

        res.status(201).json({
            userId: user.id,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (error) {
        next(new HttpError("Impossible de créer le compte.", 500));
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return next(new HttpError("Identifiants invalides.", 401));
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) {
            return next(new HttpError("Identifiants invalides.", 401));
        }

        const token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email, role: existingUser.role },
            process.env.JWT_KEY,
            { expiresIn: "1h" },
        );

        res.json({
            userId: existingUser.id,
            email: existingUser.email,
            role: existingUser.role,
            token,
        });
    } catch (error) {
        next(new HttpError("Impossible de se connecter.", 500));
    }
};

export { register, login };