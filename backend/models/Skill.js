
import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema({
  userId: { type: String, required: false },
  skill: { type: String, required: true },
  source: { type: String, default: "nlp" },
  createdAt: { type: Date, default: Date.now }
});

const Skill = mongoose.model("Skill", SkillSchema);
export default Skill;
