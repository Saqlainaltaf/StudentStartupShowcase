// backend/routes/auth.js
import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "yourSecret";

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, type, phone, program, year, linkedin, bio } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      type: type || "student",
      phone: phone || "",
      program: program || "",
      year: year || "",
      linkedin: linkedin || "",
      bio: bio || "",
      role: "student"
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" });

    const out = user.toObject();
    delete out.password;

    return res.json({ token, user: out });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" });

    const out = user.toObject();
    delete out.password;

    return res.json({ token, user: out });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
