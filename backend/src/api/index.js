import express from "express";
import authRoutes from "../routes/authRoutes.js";
import newsletterRoutes from "../routes/newsletterRoutes.js";

const router = express.Router();
router.use("/auth", authRoutes);
router.use("/newsletter", newsletterRoutes);

export default router;
