import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firebaseUid: { type: String, required: true, unique: true },
        name: { type: String },
        email: { type: String, required: true, unique: true },
        profileImage: String,

        // Basic info
        location: { type: String, default: "" },
        bio: { type: String, default: "" },

        // Live stats
        totalItemsCollected: { type: Number, default: 0 },
        totalCleanups: { type: Number, default: 0 },
        totalChallenges: { type: Number, default: 0 },
        impactScore: { type: Number, default: 0 },

        // Relations
        joinedChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }],
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
