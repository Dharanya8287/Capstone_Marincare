import { pipeline } from "@xenova/transformers";
import { writeFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

// Classifier is loaded once and held in memory.
let classifier = null;

const CANDIDATE_LABELS = [
    "plastic bottle",
    "metal can",
    "plastic bag",
    "paper or cardboard",
    "cigarette butt",
    "glass bottle",
    "unknown trash", // Added a fallback
];

const LABEL_MAP = {
    "plastic bottle": "plastic_bottle",
    "metal can": "metal_can",
    "plastic bag": "plastic_bag",
    "paper or cardboard": "paper_cardboard",
    "cigarette butt": "cigarette_butt",
    "glass bottle": "glass_bottle",
    "unknown trash": "unknown", // Map the fallback
};

// This function will be called by server.js at startup.
export async function initializeAI() {
    if (!classifier) {
        console.log("Loading AI model into memory. This may take a minute...");
        try {
            // We set a progress bar to see it loading
            classifier = await pipeline("zero-shot-image-classification", "Xenova/clip-vit-base-patch32", {
                progress_callback: (progress) => {
                    if (progress.progress) {
                        console.log(`AI Model Loading: ${progress.file} (${(progress.progress).toFixed(1)}%)`);
                    } else {
                        console.log(`AI Model Status: ${progress.status} - ${progress.file}`);
                    }

                }
            });
            console.log("✅ AI Model loaded successfully.");
        } catch (err) {
            console.error("❌ Failed to load AI model:", err);
            // We exit because the app can't run without the AI model in this flow
            process.exit(1);
        }
    }
}

// classifyImage assumes the model is already loaded.
export async function classifyImage(buffer) {
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
        throw new Error("Invalid image buffer");
    }

    // Check if it's ready.
    if (!classifier) {
        console.error("AI Model not initialized. Please restart the server.");
        throw new Error("AI classifier is not ready.");
    }

    // Create a temporary file path
    const tempFilePath = join(tmpdir(), `temp-image-${Date.now()}.jpg`);

    try {
        // Write buffer to temporary file
        writeFileSync(tempFilePath, buffer);

        // Pass the file path to the classifier.
        const results = await classifier(tempFilePath, CANDIDATE_LABELS);

        // Sort by confidence
        results.sort((a, b) => b.score - a.score);
        const top = results[0];

        // Ensure the label is one of our mapped labels, otherwise default to "unknown"
        const finalLabel = LABEL_MAP[top.label] || "unknown";

        return {
            label: finalLabel,
            confidence: parseFloat(top.score.toFixed(4)),
        };
    } catch (error) {
        console.error("Error during AI classification:", error);
        throw new Error("Failed to classify image.");
    } finally {
        // Clean up: delete the temporary file
        try {
            unlinkSync(tempFilePath);
        } catch (err) {
            console.warn("Failed to delete temp file:", err.message);
        }
    }
}

