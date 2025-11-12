// backend/routes/idea.js
import express from "express";
import Idea from "../models/Idea.js";
import auth from "../middleware/auth.js";
const router = express.Router();

// Create idea (student)
router.post("/", auth, async (req, res) => {
  try {
    const body = req.body;
    body.createdBy = req.user.id;
    body.status = "pending";
    const idea = await Idea.create(body);
    res.json(idea);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: get approved ideas
router.get("/", async (req, res) => {
  try {
    const ideas = await Idea.find({ status: "approved" }).populate("createdBy", "name email");
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get all ideas
router.get("/all", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  const ideas = await Idea.find().populate("createdBy", "name email");
  res.json(ideas);
});

// Admin approve
router.put("/approve/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  try {
    const idea = await Idea.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
    res.json(idea);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
