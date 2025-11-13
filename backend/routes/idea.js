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

// GET /api/ideas/search?q=&category=&currentStage=&skill=&page=1&limit=12&sort=latest
router.get("/search", async (req, res) => {
  try {
    const {
      q, category, currentStage, skill,
      page = 1, limit = 12, sort = "latest"
    } = req.query;

    const filter = { status: "approved" };

    if (category) filter.category = category;
    if (currentStage) filter.currentStage = currentStage;
    if (skill) filter.skillsNeeded = { $in: [skill] };

    // Text search
    let query;
    if (q) {
      query = { $text: { $search: q }, ...filter };
    } else {
      query = filter;
    }

    // Sort
    let sortObj = { createdAt: -1 };
    if (sort === "oldest") sortObj = { createdAt: 1 };
    if (sort === "title") sortObj = { title: 1 };

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);

    const [items, total] = await Promise.all([
      Idea.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .select("title shortDescription logoUrl founders currentStage category skillsNeeded createdAt featured")
        .lean(),
      Idea.countDocuments(query)
    ]);

    res.json({ items, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
