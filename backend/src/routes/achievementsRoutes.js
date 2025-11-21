import express from "express";
import { 
    getUserAchievements, 
    getLeaderboard, 
    getMilestones,
    getAchievementStats,
    getRecentAchievements
} from "../controllers/achievementsController.js";
import { verifyAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware to all achievement routes
router.use(verifyAuth); 

// Achievement Endpoints
router.get("/", getUserAchievements);          // GET /api/achievements
router.get("/leaderboard", getLeaderboard);    // GET /api/achievements/leaderboard
router.get("/milestones", getMilestones);      // GET /api/achievements/milestones
router.get("/stats", getAchievementStats);      // GET /api/achievements/stats
router.get("/recent", getRecentAchievements);  // GET /api/achievements/recent

export default router;
