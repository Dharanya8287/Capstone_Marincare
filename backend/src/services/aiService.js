import { pipeline } from "@xenova/transformers";
import { writeFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

let classifier = null;

const CANDIDATE_LABELS = [
    "plastic bottle",
    "metal can",
    "plastic bag",
    "paper or cardboard",
    "cigarette butt",
    "glass bottle"
];

const LABEL_MAP = {
    "plastic bottle": "plastic_bottle",
    "metal can": "metal_can",
    "plastic bag": "plastic_bag",
    "paper or cardboard": "paper_cardboard",
    "cigarette butt": "cigarette_butt",
    "glass bottle": "glass_bottle",
};

async function loadModel() {
    if (!classifier) {
        console.log("Loading CLIP zero-shot model...");
        classifier = await pipeline("zero-shot-image-classification", "Xenova/clip-vit-base-patch32");
        console.log("CLIP model loaded successfully.");
    }
}

export async function classifyImage(buffer) {
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
        throw new Error("Invalid image buffer");
    }

    await loadModel();

    // Create a temporary file path
    const tempFilePath = join(tmpdir(), `temp-image-${Date.now()}.jpg`);

    try {
        // Write buffer to temporary file
        writeFileSync(tempFilePath, buffer);

        // Pass the file path to the classifier
        const results = await classifier(tempFilePath, CANDIDATE_LABELS);

        // Sort by confidence
        results.sort((a, b) => b.score - a.score);
        const top = results[0];

        return {
            label: LABEL_MAP[top.label] || "plastic_bottle",
            confidence: parseFloat(top.score.toFixed(4)),
            raw: results.map(r => ({
                label: r.label,
                score: parseFloat(r.score.toFixed(4))
            })),
        };
    } finally {
        // Clean up: delete the temporary file
        try {
            unlinkSync(tempFilePath);
        } catch (err) {
            console.warn("Failed to delete temp file:", err.message);
        }
    }
}