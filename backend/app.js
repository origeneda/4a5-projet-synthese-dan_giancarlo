import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth-routes.js";
import matchesRoutes from "./routes/matches-routes.js";
import refereesRoutes from "./routes/referees-routes.js";
import errorHandler from "./handler/error-handler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/matches", matchesRoutes);
app.use("/api/referees", refereesRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: "Route introuvable" });
});

app.use(errorHandler);

export default app;