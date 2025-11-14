// backend/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";

import authRoutes from "./routes/auth.js";
import ideaRoutes from "./routes/idea.js";
import applicationRoutes from "./routes/application.js";
import uploadRoutes from "./routes/uploads.js";
import eventsRoutes from "./routes/events.js";
import statsRoutes from "./routes/stats.js";
import adminUsersRoutes from "./routes/adminUsers.js";

import { requireAuth, requireAdmin } from "./middleware/auth.js";
import User from "./models/User.js";

const app = express();

app.use(express.json({ limit: "10mb" }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://student-startup-showcase.vercel.app"
    ],
    credentials: true
  })
);

// MOUNT ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/admin", adminUsersRoutes);

app.get("/", (req, res) => res.json({ ok: true, time: new Date() }));

// START DB + SERVER
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("MongoDB connected");

    // SEED ADMIN
    const existing = await User.findOne({ email: "admin" });
    if (!existing) {
      const hashed = await bcrypt.hash("admin", 10);
      await User.create({
        name: "Admin",
        email: "admin",
        password: hashed,
        role: "admin"
      });
      console.log("Admin created (admin/admin)");
    }

    app.listen(PORT, () => console.log("Server listening on", PORT));
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
