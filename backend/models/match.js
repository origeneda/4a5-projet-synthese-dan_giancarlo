import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  teamA: { type: String, required: true },
  teamB: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String },
  status: { type: String, enum: ["à venir", "terminé"], default: "à venir" },
  scoreA: { type: Number, default: 0 },
  scoreB: { type: Number, default: 0 },
  referees: [{ type: mongoose.Types.ObjectId, ref: "Referee" }],
});

export default mongoose.model("Match", matchSchema);
