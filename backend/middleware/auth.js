// backend/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // adjust path if needed
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "yourSecret";

/**
 * requireAuth - verifies JWT, attaches req.user (without password)
 */
export async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
}

/**
 * requireAdmin - require authenticated user with role === "admin"
 */
export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden — admin only" });
  return next();
}

/**
 * Also provide a default export so older imports like:
 *   import auth from "../middleware/auth.js";
 * continue to work.
 */
export default { requireAuth, requireAdmin };
