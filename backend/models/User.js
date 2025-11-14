// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student","faculty","admin","guest"], default: "student" },
  type: { type: String, enum: ["student","faculty","other"], default: "student" }, // user type
  phone: { type: String, trim: true, default: "" },
  program: { type: String, trim: true, default: "" },  // e.g., B.Tech CS
  year: { type: String, trim: true, default: "" },     // e.g., 2nd Year
  linkedin: { type: String, trim: true, default: "" },
  bio: { type: String, trim: true, default: "" },
  avatar: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
