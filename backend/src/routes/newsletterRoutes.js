import express from "express";
import { subscribeToNewsletter, getNewsletterSubscribers } from "../controllers/newsletterController.js";

const router = express.Router();

// Public route - subscribe to newsletter
router.post("/subscribe", subscribeToNewsletter);

// Admin route - get all subscribers (you can add auth middleware later)
router.get("/subscribers", getNewsletterSubscribers);

export default router;
