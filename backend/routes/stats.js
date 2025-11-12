// backend/routes/stats.js
import express from "express";
import Idea from "../models/Idea.js";
import User from "../models/User.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const startupsRegistered = await Idea.countDocuments();
    const studentsInvolved = await User.countDocuments();
    const eventsHeld = 0; // placeholder — you can add an Events collection later
    res.json({ startupsRegistered, studentsInvolved, eventsHeld });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
