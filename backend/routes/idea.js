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

// Public: get approved ideas (optionally category)
router.get("/", async (req, res) => {
  try {
    const filter = { status: "approved" };
    if (req.query.category) filter.category = req.query.category;
    const ideas = await Idea.find(filter).populate("createdBy", "name email");
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: featured startups
router.get("/featured", async (req, res) => {
  try {
    const featured = await Idea.find({ status: "approved", featured: true }).limit(10).populate("createdBy", "name");
    res.json(featured);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: get single startup profile
router.get("/:id", async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id).populate("createdBy", "name email");
    if (!idea) return res.status(404).json({ message: "Not found" });
    // only return if approved or requester is admin/owner (simple logic)
    if (idea.status !== "approved") {
      return res.status(403).json({ message: "Not visible" });
    }
    res.json(idea);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin-only: list all (already had this)
router.get("/all", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  const ideas = await Idea.find().populate("createdBy", "name email");
  res.json(ideas);
});

// Admin approve (already had this)
router.put("/approve/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  try {
    const idea = await Idea.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
    res.json(idea);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin toggle featured
router.put("/feature/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: "Not found" });
    idea.featured = !idea.featured;
    await idea.save();
    res.json(idea);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
