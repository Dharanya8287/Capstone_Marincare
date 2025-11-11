import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        achievementType: {
            type: String,
            required: true,
            enum: [
                "first_cleanup",
                "first_challenge",
                "items_50",
                "items_200",
                "items_500",
                "items_1000",
                "challenges_3",
                "challenges_10",
                "challenges_25",
                "impact_1000",
                "impact_5000",
                "regional_hero",
            ],
        },
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, default: "🏆" },
        progress: { type: Number, default: 0 },
        goal: { type: Number, required: true },
        isUnlocked: { type: Boolean, default: false },
        unlockedAt: { type: Date },
        pointsAwarded: { type: Number, default: 0 },
        category: {
            type: String,
            enum: ["collection", "participation", "impact", "special"],
            default: "collection",
        },
        tier: {
            type: String,
            enum: ["bronze", "silver", "gold", "platinum"],
            default: "bronze",
        },
    },
    { timestamps: true }
);

achievementSchema.index({ user: 1, achievementType: 1 }, { unique: true });

export default mongoose.model("Achievement", achievementSchema);
