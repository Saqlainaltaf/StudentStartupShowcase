// backend/models/Idea.js
import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  problemStatement: String,
  solution: String,
  targetMarket: String,
  teamMembers: String,
  category: String,
  documentUrl: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["pending", "approved"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Idea", ideaSchema);
