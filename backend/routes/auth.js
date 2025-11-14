// backend/routes/auth.js (snippet for register route)
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "yourSecret";

/* POST /api/auth/register */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, type, phone, program, year, linkedin, bio } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hashed,
      type: type || "student",
      phone: phone || "",
      program: program || "",
      year: year || "",
      linkedin: linkedin || "",
      bio: bio || ""
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" });
    const out = { ...user.toObject() };
    delete out.password;
    return res.status(201).json({ token, user: out });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
