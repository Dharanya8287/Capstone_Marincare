import express from "express";
import authRoutes from "../routes/authRoutes.js";
import aiRoutes from "../routes/aiRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/ai", aiRoutes);
export default router;
