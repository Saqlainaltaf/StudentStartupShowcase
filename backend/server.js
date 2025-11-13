// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import eventsRoutes from "./routes/events.js";
import uploadRoutes from "./routes/uploads.js";
app.use("/api/uploads", uploadRoutes);


app.use("/api/events", eventsRoutes);


// load env as early as possible
dotenv.config();

// create app BEFORE using it
const app = express();
app.use(express.json());

// configure CORS - allow frontend origin(s)
const corsOptions = {
  origin: [process.env.FRONTEND_ORIGIN || "https://student-startup-showcase.vercel.app", "http://localhost:3000"],
  credentials: true
};
app.use(cors(corsOptions));

// Import models and routes AFTER app is created (imports are hoisted, but we keep use() after app init)
import authRoutes from "./routes/auth.js";
import ideaRoutes from "./routes/idea.js";
import applicationRoutes from "./routes/application.js";
import statsRoutes from "./routes/stats.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/stats", statsRoutes);

// Healthcheck
app.get("/", (req, res) => res.json({ ok: true, time: new Date() }));

// DB + seed + start
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/startupshowcase";
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000
})
.then(() => {
  console.log("✅ MongoDB connected");
  return seedAdminIfMissing();
})
.then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message || err);
  process.exit(1); // exit so Render shows failure clearly
});

// Seed admin user (email: admin, password: admin) if none exists
async function seedAdminIfMissing(){
  try {
    const existing = await User.findOne({ email: "admin" });
    if (!existing) {
      const hashed = await bcrypt.hash("admin", 10);
      const admin = await User.create({ name: "Admin", email: "admin", password: hashed, role: "admin" });
      console.log("🔐 Admin user created: email='admin' password='admin'");
    } else {
      console.log("🔑 Admin user already exists.");
    }
  } catch (err) {
    console.error("Seed admin error:", err.message);
  }
}
