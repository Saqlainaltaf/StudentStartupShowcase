// backend/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "yourSecret";

export async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload?.id) return res.status(401).json({ message: "Invalid token payload" });
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
}

/* optionalAuth: set req.user if token present and valid; do NOT return 401 if no token.
   This is for public endpoints that want to know who is requesting (e.g., to allow admins to see more). */
export async function optionalAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload?.id) { req.user = null; return next(); }
    const user = await User.findById(payload.id).select("-password");
    req.user = user || null;
    return next();
  } catch (err) {
    // If token invalid -> treat as no user (do not fail public endpoints)
    req.user = null;
    return next();
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden — admin only" });
  return next();
}

const auth = { requireAuth, requireAdmin, optionalAuth };
export default auth;
