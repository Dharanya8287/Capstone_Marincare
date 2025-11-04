import express from "express";
import authRoutes from "../routes/authRoutes.js";
// --- FIX ---
// We no longer need aiRoutes here, as the logic is moving to `cleanupRoutes`
// import aiRoutes from "../routes/aiRoutes.js";
// --- END FIX ---

const router = express.Router();

router.use("/auth", authRoutes);

// --- FIX ---
// router.use("/ai", aiRoutes); // This is now handled by cleanupRoutes in server.js
// --- END FIX ---

export default router;
