import express from "express";
// Import the new registerUser function
import { syncUser, checkEmail, registerUser } from "../controllers/authController.js";
const router = express.Router();

// NEW: Route for handling new user registration
// This is called by the frontend signup hook instead of the client-side Firebase SDK
router.post("/register", registerUser);

// Existing route for syncing user data on login (Google or email)
router.post("/sync", syncUser);

// Existing route for checking if an email is already in use
router.get("/check-email", checkEmail);

export default router;
