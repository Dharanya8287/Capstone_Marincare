import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initializeAI } from "./services/aiService.js";
import challengeRoutes from "./routes/challengeRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import cleanupRoutes from "./routes/cleanupRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import achievementsRoutes from "./routes/achievementsRoutes.js";

const PORT = process.env.PORT || 5000;

// Register extra routes
app.use("/api/challenges", challengeRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/cleanups", cleanupRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/achievements", achievementsRoutes);
app.get("/", (req, res) => {
    res.status(200).send("Server is running 🚀");
});


// Wrap the server start in an async function to load the AI model first
async function startServer() {
    try {
        // Connect to MongoDB
        await connectDB();

        // Load AI Model into memory
        await initializeAI();

        // Start the server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT} and AI is ready!`);
        });

    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}

startServer();


