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
        let retries = 3;
        
        while (retries > 0 && !classifier) {
            try {
                // We set a progress bar to see it loading
                classifier = await pipeline("zero-shot-image-classification", "Xenova/clip-vit-base-patch32", {
                    cache_dir: process.env.AI_MODEL_CACHE_DIR,
                    progress_callback: (progress) => {
                        if (progress.progress) {
                            console.log(`AI Model Loading: ${progress.file} (${(progress.progress).toFixed(1)}%)`);
                        } else {
                            console.log(`AI Model Status: ${progress.status} - ${progress.file}`);
                        }
                    }
                });
                console.log("✅ AI Model loaded successfully.");
                return; // Success, exit function
            } catch (err) {
                retries--;
                console.error(`❌ Failed to load AI model. Retries left: ${retries}`);
                console.error(`Error: ${err.message}`);
                
                if (retries > 0) {
                    console.log("Retrying in 5 seconds...");
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
        }
        
        // Don't exit - allow server to start without AI
        // Manual upload will still work
        console.warn("⚠️ Server starting without AI model. Only manual cleanup logging will be available.");
        console.warn("⚠️ AI classification features will be disabled.");
    }
}

// classifyImage assumes the model is already loaded.
export async function classifyImage(buffer) {
    // Check if model is available before attempting classification
    if (!classifier) {
        throw new Error("AI model is not available. Please use manual entry or try again later.");
    }
    
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
        throw new Error("Invalid image buffer");
    }

    // Create a temporary file path with better error handling
    const tempFilePath = join(tmpdir(), `waveguard-temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`);

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
        throw new Error("Failed to classify image. Please try manual entry.");
    } finally {
        // Clean up: delete the temporary file
        try {
            unlinkSync(tempFilePath);
        } catch (err) {
            // Only warn, don't throw - the classification might have succeeded
            console.warn(`Failed to delete temp file ${tempFilePath}:`, err.message);
        }
    }
}

