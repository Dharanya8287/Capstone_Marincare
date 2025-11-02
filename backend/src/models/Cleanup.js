import mongoose from "mongoose";

const cleanupSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
        wasteCategory: { type: mongoose.Schema.Types.ObjectId, ref: "WasteCategory" },

        imageUrl: String, // stored in MongoDB
        quantity: { type: Number, default: 1 },

        location: {
            type: { type: String, enum: ["Point"], default: "Point" },
            coordinates: { type: [Number] },
        },
    },
    { timestamps: true }
);

cleanupSchema.index({ location: "2dsphere" });

export default mongoose.model("Cleanup", cleanupSchema);
