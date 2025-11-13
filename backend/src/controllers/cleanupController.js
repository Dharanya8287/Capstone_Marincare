import { Readable } from "stream";
import mongoose from "mongoose";
import { gridfsBucket } from "../config/db.js";
import { classifyImage } from "../services/aiService.js";
import Cleanup from "../models/Cleanup.js";
import User from "../models/User.js";
import Challenge from "../models/Challenge.js";
import { 
    validateLocation, 
    shouldBypassLocationCheck, 
    isLocationVerificationEnabled,
    getMaxAllowedDistance 
} from "../utils/locationUtils.js";

/**
 * @route   POST /api/cleanups/upload
 * @desc    Upload cleanup photo with AI classification
 * @access  Private
 */
export const uploadCleanupPhoto = async (req, res) => {
    if (!req.file || !req.file.buffer) {
        return res.status(400).json({ message: "No image file provided." });
    }
    if (!req.body.challengeId) {
        return res.status(400).json({ message: "No challenge ID provided." });
    }
    if (!mongoose.Types.ObjectId.isValid(req.body.challengeId)) {
        return res.status(400).json({ message: "Invalid challenge ID." });
    }

    const { buffer, originalname } = req.file;
    const { challengeId, latitude, longitude } = req.body;
    const userId = req.mongoUser._id;
    const userEmail = req.mongoUser.email;

    try {
        // Get challenge for location validation
        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found." });
        }

        // Location verification
        if (isLocationVerificationEnabled() && !shouldBypassLocationCheck(userEmail)) {
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);

            if (isNaN(lat) || isNaN(lng)) {
                return res.status(400).json({ 
                    message: "Location is required to upload trash to this challenge",
                    error: "LOCATION_REQUIRED"
                });
            }

            const userLocation = { latitude: lat, longitude: lng };
            const maxDistance = getMaxAllowedDistance();
            const validation = validateLocation(userLocation, challenge.location, maxDistance);
            
            if (!validation.isValid) {
                return res.status(403).json({ 
                    message: validation.message,
                    distance: validation.distance,
                    maxDistance: maxDistance,
                    error: "LOCATION_TOO_FAR"
                });
            }

            console.log(`[Location] User ${userEmail} verified for upload to challenge ${challengeId}: ${validation.message}`);
        }

        // 1. Save image to GridFS
        const fileId = await uploadImageToGridFS(buffer, originalname || "cleanup-upload.jpg");

        // 2. Classify the image (this is fast now)
        let classificationResult;
        try {
            classificationResult = await classifyImage(buffer);
        } catch (aiError) {
            // AI model not available - provide helpful error message
            console.error("AI classification failed:", aiError.message);
            return res.status(503).json({ 
                message: "AI classification is currently unavailable. Please use manual entry or try again later.",
                error: "AI_UNAVAILABLE"
            });
        }

        const itemCount = 1; // AI upload only counts as 1 item

        // 3. Create the Cleanup record
        const cleanup = new Cleanup({
            userId,
            challengeId,
            imageFileId: fileId,
            itemCount,
            classificationResult, // Save the AI result
            status: 'completed', // It's completed instantly
            logType: 'ai',
        });
        await cleanup.save();

        // 4. Update User and Challenge stats
        await updateUserStats(userId, itemCount);
        await updateChallengeStats(challengeId, itemCount, classificationResult.label);

        // 5. Return a 200 OK with the result
        res.status(200).json({
            message: `Success! AI classified as: ${classificationResult.label}`,
            result: classificationResult,
        });

    } catch (error) {
        console.error("Upload error:", error);
        // This provides a specific error if validation fails (like a bad ID)
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "An error occurred during cleanup upload." });
    }
};

/**
 * @route   POST /api/cleanups/manual
 * @desc    Log manual cleanup entry
 * @access  Private
 */
export const logManualCleanup = async (req, res) => {
    const { challengeId, label, itemCount, latitude, longitude } = req.body;
    const userId = req.mongoUser._id;
    const userEmail = req.mongoUser.email;

    // Validation
    if (!challengeId || !label || !itemCount) {
        return res.status(400).json({ message: "Missing challenge, label, or item count." });
    }
    if (parseInt(itemCount, 10) <= 0) {
        return res.status(400).json({ message: "Item count must be at least 1." });
    }
    if (!mongoose.Types.ObjectId.isValid(challengeId)) {
        return res.status(400).json({ message: "Invalid challenge ID." });
    }

    try {
        // Get challenge for location validation
        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found." });
        }

        // Location verification
        if (isLocationVerificationEnabled() && !shouldBypassLocationCheck(userEmail)) {
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);

            if (isNaN(lat) || isNaN(lng)) {
                return res.status(400).json({ 
                    message: "Location is required to upload trash to this challenge",
                    error: "LOCATION_REQUIRED"
                });
            }

            const userLocation = { latitude: lat, longitude: lng };
            const maxDistance = getMaxAllowedDistance();
            const validation = validateLocation(userLocation, challenge.location, maxDistance);
            
            if (!validation.isValid) {
                return res.status(403).json({ 
                    message: validation.message,
                    distance: validation.distance,
                    maxDistance: maxDistance,
                    error: "LOCATION_TOO_FAR"
                });
            }

            console.log(`[Location] User ${userEmail} verified for manual log to challenge ${challengeId}: ${validation.message}`);
        }

        const count = parseInt(itemCount, 10);

        // 1. Create the Cleanup record
        const cleanup = new Cleanup({
            userId,
            challengeId,
            itemCount: count,
            classificationResult: {
                label: label,
                confidence: 1.0, // Manual is 100% confident
            },
            status: 'completed',
            logType: 'manual',
        });
        await cleanup.save();

        // 2. Update User and Challenge stats
        await updateUserStats(userId, count);
        await updateChallengeStats(challengeId, count, label);

        // 3. Return a 200 OK
        res.status(200).json({
            message: `Successfully logged ${count} item(s) as ${label}.`,
        });

    } catch (error) {
        console.error("Manual log error:", error);
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Server error during manual log." });
    }
};

// Helper function to upload image to GridFS
function uploadImageToGridFS(buffer, filename) {
    if (!gridfsBucket) {
        throw new Error("GridFS bucket not initialized");
    }
    return new Promise((resolve, reject) => {
        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);

        const uploadStream = gridfsBucket.openUploadStream(filename, {
            contentType: 'image/jpeg' // Assuming jpeg, adjust if needed
        });
        readable.pipe(uploadStream);

        uploadStream.on("finish", () => resolve(uploadStream.id));
        uploadStream.on("error", (err) => reject(err));
    });
}

// Helper to update User stats
async function updateUserStats(userId, itemCount) {
    try {
        await User.findByIdAndUpdate(userId, {
            $inc: {
                totalItemsCollected: itemCount,
                totalCleanups: 1, // Increment cleanup count
            }
        });
    } catch (error) {
        console.error(`Failed to update user stats for ${userId}:`, error);
        // Don't throw, just log the error. The core action (cleanup) succeeded.
    }
}

// Helper to update Challenge stats
async function updateChallengeStats(challengeId, itemCount, label) {
    try {
        // This is a dynamic update key. If label is "plastic_bottle",
        // it becomes: { $inc: { ... 'wasteBreakdown.plastic_bottle': 1 } }
        const updateOperation = {
            $inc: {
                totalTrashCollected: itemCount,
            }
        };

        // Only update breakdown if the label is valid
        if (label && label !== 'unknown') {
            updateOperation.$inc[`wasteBreakdown.${label}`] = itemCount;
        }

        await Challenge.findByIdAndUpdate(challengeId, updateOperation);
    } catch (error) {
        console.error(`Failed to update challenge stats for ${challengeId}:`, error);
        // Don't throw, just log the error.
    }
}

