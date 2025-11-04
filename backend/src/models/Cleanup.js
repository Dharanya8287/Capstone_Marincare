import mongoose from "mongoose";

// --- FIX ---
// Simplified the classification to match what the AI model actually does.
// This is much cleaner for your MVP.
const classificationResultSchema = new mongoose.Schema({
    label: {
        type: String,
        enum: [
            "plastic_bottle",
            "metal_can",
            "plastic_bag",
            "paper_cardboard",
            "cigarette_butt",
            "glass_bottle",
            "unknown", // Added a fallback
        ],
        required: true,
    },
    confidence: { type: Number, default: 0 },
}, { _id: false });
// --- END FIX ---

const cleanupSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true, index: true },
        imageFileId: { type: mongoose.Schema.Types.ObjectId }, // GridFS file id (optional, for AI logs)

        // --- NEW FIELDS ---
        logType: { type: String, enum: ["ai", "manual"], default: "ai" },
        status: { type: String, enum: ["processing", "completed", "failed"], default: "processing" },
        // --- END NEW FIELDS ---

        // --- RENAMED & SIMPLIFIED ---
        classificationResult: { type: classificationResultSchema },
        // --- END RENAMED ---

        itemCount: { type: Number, default: 1 },
    },
    { timestamps: true }
);

export default mongoose.model("Cleanup", cleanupSchema);

