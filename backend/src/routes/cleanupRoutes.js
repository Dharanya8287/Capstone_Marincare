import express from "express";
import multer from "multer";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import { ensureUserExists } from "../middleware/userMiddleware.js";
import { uploadCleanupPhoto, logManualCleanup } from "../controllers/cleanupController.js";

const router = express.Router();

// In-memory upload for classification
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { 
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only images
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (JPEG, PNG, WebP) are allowed'), false);
        }
    }
});

/**
 * @route   POST /api/cleanups/upload
 * @desc    Upload a photo for AI classification (Async)
 * @access  Private
 */
router.post(
    "/upload",
    [verifyFirebaseToken, ensureUserExists, upload.single("image")],
    uploadCleanupPhoto
);

/**
 * @route   POST /api/cleanups/manual
 * @desc    Log a cleanup manually (Sync)
 * @access  Private
 */
router.post(
    "/manual",
    [verifyFirebaseToken, ensureUserExists],
    logManualCleanup
);


export default router;
