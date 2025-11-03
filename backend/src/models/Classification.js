import mongoose from "mongoose";

const classificationSchema = new mongoose.Schema(
    {
        fileId: { type: mongoose.Schema.Types.ObjectId },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },

        // mapped static categories
        label: {
            type: String,
            enum: [
                "plastic_bottle",
                "metal_can",
                "plastic_bag",
                "paper_cardboard",
                "cigarette_butt",
                "glass_bottle",
            ],
            default: "plastic_bottle",
        },
        confidence: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Classification = mongoose.model("Classification", classificationSchema);

export default Classification;
