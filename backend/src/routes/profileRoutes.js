import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyFirebaseToken, getProfile);
router.patch("/", verifyFirebaseToken, updateProfile);

export default router;