import express from "express";
import multer from "multer";
import { uploadAndClassify } from "../controllers/aiController.js";

const router = express.Router();

// In-memory upload for classification
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/ai/classify
router.post("/classify", upload.single("image"), uploadAndClassify);

export default router;
