import express from "express";

import {
    getReferees,
    getRefereeById,
    createReferee,
    updateReferee,
    deleteReferee,
} from "../controllers/referees-controller.js";
import checkAuth from "../middleware/check-auth.js";

const router = express.Router();

router.get("/", getReferees);
router.get("/:rid", getRefereeById);
router.post("/", checkAuth, createReferee);
router.patch("/:rid", checkAuth, updateReferee);
router.delete("/:rid", checkAuth, deleteReferee);

export default router;