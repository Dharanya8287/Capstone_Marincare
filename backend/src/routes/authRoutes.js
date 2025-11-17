import express from "express";
// Import authentication controllers
import { 
    syncUser, 
    checkEmail, 
    registerUser, 
    createSessionCookie, 
    clearSessionCookie 
} from "../controllers/authController.js";
import { authRateLimiter, rateLimiter } from "../middleware/rateLimiter.js";
const router = express.Router();

// NEW: Route for handling new user registration
// This is called by the frontend signup hook instead of the client-side Firebase SDK
router.post("/register", authRateLimiter, registerUser);

// Existing route for syncing user data on login (Google or email)
router.post("/sync", authRateLimiter, syncUser);

// NEW: Create HttpOnly session cookie (XSS Protection)
// Called after Firebase login to create secure session
router.post("/create-session", authRateLimiter, createSessionCookie);

// NEW: Clear session cookie on logout
router.post("/logout", clearSessionCookie);

// Existing route for checking if an email is already in use
// Use regular rate limiter (not auth) since this is called on every keystroke
router.get("/check-email", rateLimiter, checkEmail);

export default router;
