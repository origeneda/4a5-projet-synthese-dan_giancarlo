import "dotenv/config";

import app from "./app.js";
import connectDB from "./util/bd.js";

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