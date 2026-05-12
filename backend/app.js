import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./util/bd.js";
import matchesRoutes from "./routes/matches-routes.js";
import errorHandler from "./handler/error-handler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/matches", matchesRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: "Route introuvable" });
});

app.use(errorHandler);

const port = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Serveur backend actif sur le port ${port}`);
    });
});