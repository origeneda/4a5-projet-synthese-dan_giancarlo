import express from "express";
import {
  getMatches,
  createMatch,
  updateMatch,
  deleteMatch,
  assignReferee,
} from "../controllers/matches-controller.js";
import checkAuth from "../middleware/check-auth.js";

const router = express.Router();

router.get("/", getMatches); // public
router.post("/", checkAuth, createMatch); // privé
router.patch("/:mid", checkAuth, updateMatch); // privé
router.delete("/:mid", checkAuth, deleteMatch); // privé
router.post("/:mid/assign-referee", checkAuth, assignReferee); // privé

export default router;
