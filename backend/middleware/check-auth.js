import jwt from "jsonwebtoken";
import HttpError from "../util/http-error.js";

const checkAuth = (req, res, next) => {
  try {
    if (req.method === "OPTIONS") {
      return next();
    }
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Authentication failed!");
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decoded.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 401);
    return next(error);
  }
};

export default checkAuth;
