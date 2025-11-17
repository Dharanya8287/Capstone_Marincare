import express from "express";
import { subscribeToNewsletter, getNewsletterSubscribers } from "../controllers/newsletterController.js";
import { verifyAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route - subscribe to newsletter
// Note: Rate limiting is implemented inside subscribeToNewsletter controller (3 attempts per minute per IP)
router.post("/subscribe", subscribeToNewsletter);

// Admin route - get all subscribers (requires authentication)
// Note: Authentication provides sufficient protection; rate limiting not required for authenticated endpoints
router.get("/subscribers", verifyAuth, getNewsletterSubscribers);

export default router;
