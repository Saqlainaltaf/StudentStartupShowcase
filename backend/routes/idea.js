// backend/routes/idea.js
import express from "express";
import Idea from "../models/Idea.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/*
  NOTE: order matters. Put static routes (search, featured, all, approve, feature)
  BEFORE the dynamic route (/:id). Otherwise requests like /all will be treated as an id.
*/

// Create idea (student)
router.post("/", requireAuth, async (req, res) => {
  try {
    const body = req.body || {};
    // Ensure createdBy and status are set server-side
    body.createdBy = req.user && req.user._id ? req.user._id : (req.user && req.user.id) || null;
    body.status = "pending";
    const idea = await Idea.create(body);
    return res.status(201).json(idea);
  } catch (err) {
    console.error("Create idea error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Search (text search + filters + pagination)
router.get("/search", async (req, res) => {
  try {
    const { q, category, currentStage, skill, page = 1, limit = 12, sort = "latest" } = req.query;
    const filter = { status: "approved" };
    if (category) filter.category = category;
    if (currentStage) filter.currentStage = currentStage;
    if (skill) filter.skillsNeeded = { $in: [skill] };

    let query;
    if (q) query = { $text: { $search: q }, ...filter };
    else query = filter;

    let sortObj = { createdAt: -1 };
    if (sort === "oldest") sortObj = { createdAt: 1 };
    if (sort === "title") sortObj = { title: 1 };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const lim = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * lim;

    const [items, total] = await Promise.all([
      Idea.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(lim)
        .select("title shortDescription logoUrl founders currentStage category skillsNeeded createdAt featured")
        .lean(),
      Idea.countDocuments(query)
    ]);

    return res.json({ items, total, page: pageNum, limit: lim });
  } catch (err) {
    console.error("Idea search error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Featured startups
router.get("/featured", async (req, res) => {
  try {
    const featured = await Idea.find({ status: "approved", featured: true })
      .limit(10)
      .populate("createdBy", "name");
    return res.json(featured);
  } catch (err) {
    console.error("Featured ideas error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Admin: get all startups (requires admin)
router.get("/all", requireAuth, requireAdmin, async (req, res) => {
  try {
    const ideas = await Idea.find().populate("createdBy", "name email");
    return res.json(ideas);
  } catch (err) {
    console.error("Get all ideas error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Admin approve
router.put("/approve/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const idea = await Idea.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
    if (!idea) return res.status(404).json({ message: "Idea not found" });
    return res.json(idea);
  } catch (err) {
    console.error("Approve idea error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Admin toggle featured
router.put("/feature/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: "Idea not found" });
    idea.featured = !idea.featured;
    await idea.save();
    return res.json(idea);
  } catch (err) {
    console.error("Toggle feature error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Public: get approved ideas (optionally by category)
router.get("/", async (req, res) => {
  try {
    const filter = { status: "approved" };
    if (req.query.category) filter.category = req.query.category;
    const ideas = await Idea.find(filter).populate("createdBy", "name email");
    return res.json(ideas);
  } catch (err) {
    console.error("Get ideas error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Public: get single startup profile by id
// This must be the LAST route so '/all' and '/search' routes don't get caught here.
router.get("/:id", async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id).populate("createdBy", "name email");
    if (!idea) return res.status(404).json({ message: "Not found" });
    if (idea.status !== "approved") return res.status(403).json({ message: "Not visible" });
    return res.json(idea);
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "Invalid id format" });
    console.error("Get idea by id error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
