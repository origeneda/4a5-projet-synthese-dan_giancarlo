import mongoose from "mongoose";

const refereeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  level: { type: String, enum: ["Provincial", "Régional", "National"] },
  region: { type: String },
  photo: { type: String },
  matches: [{ type: mongoose.Types.ObjectId, ref: "Match" }],
});

export default mongoose.model("Referee", refereeSchema);
