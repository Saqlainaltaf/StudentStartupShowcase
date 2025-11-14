// backend/routes/events.js
import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import Event from "../models/Event.js";

const router = express.Router();

// Public: list events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ start: 1 });
    res.json(events);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: create event
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  try {
    const e = await Event.create({ ...req.body, createdBy: req.user.id });
    res.json(e);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: update
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  try {
    const e = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(e);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: delete
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
