// backend/routes/adminUsers.js
import express from "express";
import User from "../models/User.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/admin/users
 * Query params:
 *  - q (search across name/email)
 *  - page (1-based)
 *  - limit (page size)
 *  - role (optional filter)
 */
router.get("/users", requireAuth, requireAdmin, async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(100, parseInt(req.query.limit || "20", 10));
    const role = req.query.role || "";

    const filter = {};
    if (role) filter.role = role;

    if (q) {
      // text-lite search across name and email
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } }
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("name email role createdAt program year phone") // select only needed fields
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.json({
      data: users,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("admin/users error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
