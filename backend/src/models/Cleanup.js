import mongoose from "mongoose";

const cleanupSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
        imageFileId: { type: mongoose.Schema.Types.ObjectId }, // GridFS file id

        classifiedItems: [
            {
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
                },
                confidence: Number,
            },
        ],

        totalItems: { type: Number, default: 1 },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model("Cleanup", cleanupSchema);
