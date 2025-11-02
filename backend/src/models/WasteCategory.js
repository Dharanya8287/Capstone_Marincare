import mongoose from "mongoose";

const wasteCategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: String,
        icon: String,
        environmentalImpactScore: { type: Number, default: 1 },
    },
    { timestamps: true }
);

export default mongoose.model("WasteCategory", wasteCategorySchema);
