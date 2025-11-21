import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
    {
        email: { 
            type: String, 
            required: true, 
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
        },
        subscribed: { 
            type: Boolean, 
            default: true 
        },
        subscribedAt: { 
            type: Date, 
            default: Date.now 
        },
    },
    { timestamps: true }
);

export default mongoose.model("Newsletter", newsletterSchema);
