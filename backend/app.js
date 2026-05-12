import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./util/bd.js";
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

const port = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Serveur backend actif sur le port ${port}`);
        });
    })
    .catch((error) => {
        console.error("Impossible de démarrer le backend:", error.message);
        process.exit(1);
    });