// backend/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";

// routes
import authRoutes from "./routes/auth.js";
import ideaRoutes from "./routes/idea.js";
import applicationRoutes from "./routes/application.js";
import uploadRoutes from "./routes/uploads.js";
import eventsRoutes from "./routes/events.js";
import statsRoutes from "./routes/stats.js";
import adminUsersRoutes from "./routes/adminUsers.js";

// models
import User from "./models/User.js";

// app init
const app = express();

// middleware
app.use(express.json({ limit: "10mb" }));

// ✅ FIXED CORS (allow all origins)
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/admin", adminUsersRoutes);

// health check
app.get("/", (req, res) => {
  res.json({ ok: true, time: new Date() });
});

// database + server start
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000
  })
  .then(async () => {
    console.log("✅ MongoDB connected");

    // seed admin
    try {
      const existing = await User.findOne({ email: "admin" });
      if (!existing) {
        const hashed = await bcrypt.hash("admin", 10);
        await User.create({
          name: "Admin",
          email: "admin",
          password: hashed,
          role: "admin"
        });
        console.log("✅ Admin created (admin / admin)");
      } else {
        console.log("ℹ️ Admin already exists");
      }
    } catch (err) {
      console.error("Admin seed error:", err.message);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
