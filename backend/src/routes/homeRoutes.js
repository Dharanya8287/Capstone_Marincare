import express from "express";
import { getHomeStats, getLoginStats } from "../controllers/homeController.js";

const router = express.Router();

// @route   GET /api/home/stats
// @desc    Get home page statistics
// @access  Public
router.get("/stats", getHomeStats);

// @route   GET /api/home/login-stats
// @desc    Get login page statistics
// @access  Public
router.get("/login-stats", getLoginStats);

export default router;
