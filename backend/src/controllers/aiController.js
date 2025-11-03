import { classifyImage } from "../services/aiService.js";
import { uploadImage } from "../services/imageService.js";
import Classification from "../models/Classification.js";

export async function uploadAndClassify(req, res) {
    try {
        const file = req.file;
        if (!file || !file.buffer) {
            return res.status(400).json({ message: "No image provided" });
        }

        const { buffer, originalname } = file;
        const { challengeId, userId } = req.body;

        // 1) Save image to GridFS
        const fileId = await uploadImage(buffer, originalname || "upload");

        // 2) Classify
        const result = await classifyImage(buffer);

        // 3) Store classification metadata
        const record = await Classification.create({
            fileId,
            challengeId: challengeId || null,
            userId: userId || null,
            label: result.label,
            confidence: result.confidence,
        });

        // 4) Respond
        res.status(200).json({
            message: "Image classified successfully",
            label: result.label,
            confidence: result.confidence,
            recordId: record._id,
        });
    } catch (err) {
        console.error("Classification error:", err);
        res.status(500).json({ message: "Classification failed", error: err.message });
    }
}
