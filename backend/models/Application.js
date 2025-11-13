// backend/models/Application.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  ideaId: { type: mongoose.Schema.Types.ObjectId, ref: "Idea", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String },
  contact: {
    email: String,
    phone: String
  },
  status: { type: String, enum: ["pending","accepted","rejected"], default: "pending" },
  assignedToStartupRole: { type: String }, // e.g., "Frontend dev"
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Application", applicationSchema);
