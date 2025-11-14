// backend/routes/uploads.js
import express from "express";
import multer from "multer";
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";
import { requireAuth, requireAdmin } from "../middleware/auth.js";


const router = express.Router();

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// multer memory storage (files stay in memory buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

// helper to upload a buffer to cloudinary using streams
const streamUpload = (buffer, folder = "startup_supporting_docs") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// POST /api/uploads (authenticated)
router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Basic accept list for security
    const allowed = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    if (!allowed.includes(req.file.mimetype)) {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    const result = await streamUpload(req.file.buffer);

    res.json({
      url: result.secure_url,
      filename: result.public_id,
      originalName: req.file.originalname,
      size: req.file.size,
      resource_type: result.resource_type
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed", detail: err.message || err });
  }
});

export default router;
