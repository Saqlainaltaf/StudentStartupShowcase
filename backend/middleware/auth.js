// backend/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "yourSecret";

/**
 * verify JWT, attach req.user (safe)
 */
export async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);

    // payload should contain user id
    if (!payload?.id) return res.status(401).json({ message: "Invalid token payload" });

    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;
    return next();
  } catch (err) {
    // for debugging, keep message minimal in production
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
}

/**
 * only allow admin users
 */
export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden — admin only" });
  return next();
}

/**
 * Provide default export too (so old imports keep working)
 */
const auth = { requireAuth, requireAdmin };
export default auth;
