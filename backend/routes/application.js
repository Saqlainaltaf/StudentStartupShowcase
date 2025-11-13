// backend/routes/application.js
import express from "express";
import auth from "../middleware/auth.js";
import Application from "../models/Application.js";
import Idea from "../models/Idea.js";
import User from "../models/User.js";

const router = express.Router();

// Create application (student must be logged in)
router.post("/", auth, async (req, res) => {
  try {
    const { ideaId, message, contact } = req.body;
    // basic validation
    if (!ideaId) return res.status(400).json({ message: "Missing ideaId" });

    // check idea exists and is approved
    const idea = await Idea.findById(ideaId);
    if (!idea || idea.status !== "approved") return res.status(404).json({ message: "Idea not found or not visible" });

    const application = await Application.create({
      ideaId,
      userId: req.user.id,
      message,
      contact
    });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user's applications
router.get("/me", auth, async (req, res) => {
  try {
    const items = await Application.find({ userId: req.user.id }).populate("ideaId", "title").sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: list all applications
router.get("/all", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  const items = await Application.find().populate("ideaId", "title").populate("userId", "name email").sort({ createdAt: -1 });
  res.json(items);
});

// Admin: change status (accept/reject) and optionally assign role
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  try {
    const { status, assignedToStartupRole } = req.body;
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Not found" });
    if (status) app.status = status;
    if (assignedToStartupRole) app.assignedToStartupRole = assignedToStartupRole;
    await app.save();
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
