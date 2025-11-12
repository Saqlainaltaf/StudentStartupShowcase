// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import ideaRoutes from "./routes/idea.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/startupshowcase";
const PORT = process.env.PORT || 5000;

// Connect with explicit options and helpful logs
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000 // 10s
})
.then(() => {
  console.log("✅ MongoDB connected");
  seedAdminIfMissing();
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
  console.error("Check your MONGO_URI in backend/.env and that your IP is whitelisted on Mongo Atlas.");
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

// Basic health route
app.get("/", (req, res) => res.json({ ok: true, time: new Date() }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ideas", ideaRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
