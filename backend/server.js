// backend/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";

// NOTE: middleware lives in ./middleware relative to this file
import { requireAuth, requireAdmin } from "./middleware/auth.js";

import authRoutes from "./routes/auth.js";
import ideaRoutes from "./routes/idea.js";
import applicationRoutes from "./routes/application.js";
import uploadRoutes from "./routes/uploads.js";
import eventsRoutes from "./routes/events.js";
import statsRoutes from "./routes/stats.js";
import adminUsersRoutes from "./routes/adminUsers.js";

import User from "./models/User.js";

const app = express();

// middlewares
app.use(express.json({ limit: "10mb" }));

const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN ? process.env.FRONTEND_ORIGIN.split(",") : ["http://localhost:3000", "https://student-startup-showcase.vercel.app"],
  credentials: true
};
app.use(cors(corsOptions));

// mount routes
app.use("/api/auth", authRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/admin", adminUsersRoutes); // admin routes

// simple healthcheck
app.get("/", (req, res) => res.json({ ok: true, time: new Date() }));

// DB connect + seed admin
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/startupshowcase";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000
})
.then(async () => {
  console.log("✅ MongoDB connected");

  // seed admin if missing
  try {
    const existing = await User.findOne({ email: "admin" });
    if (!existing) {
      const hashed = await bcrypt.hash("admin", 10);
      await User.create({ name: "Admin", email: "admin", password: hashed, role: "admin" });
      console.log("🔐 Admin user created: email='admin' password='admin'");
    } else {
      console.log("🔑 Admin user already exists.");
    }
  } catch (err) {
    console.error("Seed admin error:", err.message || err);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message || err);
  process.exit(1);
});
