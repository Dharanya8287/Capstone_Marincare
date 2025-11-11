import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import { ensureUserExists } from "../middleware/userMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get comprehensive dashboard statistics
 * @access  Private
 */
router.get("/stats", verifyFirebaseToken, ensureUserExists, getDashboardStats);

export default router;
