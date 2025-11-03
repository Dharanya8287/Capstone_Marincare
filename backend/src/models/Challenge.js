import mongoose from "mongoose";

const wasteBreakdownSchema = new mongoose.Schema(
    {
        plastic_bottle: { type: Number, default: 0 },
        metal_can: { type: Number, default: 0 },
        plastic_bag: { type: Number, default: 0 },
        paper_cardboard: { type: Number, default: 0 },
        cigarette_butt: { type: Number, default: 0 },
        glass_bottle: { type: Number, default: 0 },
    },
    { _id: false }
);

const challengeSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: String,
        bannerImage: String,
        startDate: Date,
        endDate: Date,
        status: { type: String, enum: ["active", "completed", "upcoming"], default: "active" },

        // Location info
        locationName: { type: String, required: true },
        province: { type: String, required: true },
        location: {
            type: { type: String, enum: ["Point"], default: "Point" },
            coordinates: { type: [Number], required: true }, // [longitude, latitude]
        },

        goal: { type: Number, default: 0 },
        goalUnit: { type: String, default: "items" },

        // Live stats
        totalTrashCollected: { type: Number, default: 0 },
        totalVolunteers: { type: Number, default: 0 },
        wasteBreakdown: { type: wasteBreakdownSchema, default: () => ({}) },

        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

challengeSchema.index({ location: "2dsphere" });

export default mongoose.model("Challenge", challengeSchema);
