import express from "express";
import { subscribeToNewsletter, getNewsletterSubscribers } from "../controllers/newsletterController.js";
import { verifyAuth } from "../middleware/authMiddleware.js";
import { rateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Public route - subscribe to newsletter
// Note: Has both middleware rate limiting AND internal rate limiting (3 attempts per minute per IP)
router.post("/subscribe", rateLimiter, subscribeToNewsletter);

// Admin route - get all subscribers (requires authentication)
// Note: Authentication provides sufficient protection; rate limiting not required for authenticated endpoints
router.get("/subscribers", verifyAuth, getNewsletterSubscribers);

export default router;
