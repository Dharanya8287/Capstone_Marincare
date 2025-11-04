import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initializeAI } from "./services/aiService.js"; // <-- IMPORT
import challengeRoutes from "./routes/challengeRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import cleanupRoutes from "./routes/cleanupRoutes.js"; // <-- IMPORT

const PORT = process.env.PORT || 5000;

// Register extra routes
app.use("/api/challenges", challengeRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/cleanups", cleanupRoutes); // <-- ADDED

// --- FIX ---
// We wrap the server start in an async function to load the AI model first
async function startServer() {
    try {
        // 1. Connect to MongoDB
        await connectDB();

        // 2. Load AI Model into memory
        await initializeAI();

        // 3. Start the server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT} and AI is ready!`);
        });

    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
// --- END FIX ---

