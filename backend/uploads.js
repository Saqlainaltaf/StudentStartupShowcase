// backend/routes/uploads.js
import express from "express";
import multer from "multer";
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";
import { requireAuth, requireAdmin } from "./middleware/auth.js";


const router = express.Router();

// Configure Cloudinary using environment variables
// Make sure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET are set
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// multer memory storage to get file buffer
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// POST /api/uploads - authenticated (students must be logged in to attach docs)
router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    // Optionally validate mime types
    const allowed = ["application/pdf", "image/png", "image/jpeg", "application/msword",
                     "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(req.file.mimetype)) {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    // Upload via stream to Cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: `startup_supporting_docs`, resource_type: "auto" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    // Return useful metadata
    res.json({
      url: result.secure_url,
      filename: result.public_id,
      originalName: req.file.originalname,
      size: req.file.size,
      resource_type: result.resource_type,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed", detail: err.message || err });
  }
});

export default router;
