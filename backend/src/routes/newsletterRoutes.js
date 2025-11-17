import express from "express";
import { subscribeToNewsletter, getNewsletterSubscribers } from "../controllers/newsletterController.js";
import { verifyAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route - subscribe to newsletter
router.post("/subscribe", subscribeToNewsletter);

// Admin route - get all subscribers (requires authentication)
router.get("/subscribers", verifyAuth, getNewsletterSubscribers);

export default router;
