import express from "express";
import multer from "multer";
import { getProfile, updateProfile, uploadProfileImage } from "../controllers/profileController.js";
import { verifyAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Configure multer for profile image uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Use verifyAuth - supports both HttpOnly cookies (XSS-safe) and Bearer tokens (backward compatibility)
router.get("/", verifyAuth, getProfile);
router.patch("/", verifyAuth, updateProfile);
router.post("/upload-image", verifyAuth, upload.single("image"), uploadProfileImage);

export default router;