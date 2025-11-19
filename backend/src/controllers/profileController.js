// backend/src/controllers/profileController.js
import User from "../models/User.js";
import { uploadImage } from "../services/imageService.js";

export const getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.user.uid });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        
        // Whitelist allowed fields to prevent unauthorized updates
        const allowedUpdates = ['name', 'location', 'bio'];
        const filteredUpdates = {};
        
        // Only allow updating specific fields
        for (const key of allowedUpdates) {
            if (updates[key] !== undefined) {
                // Sanitize string inputs to prevent XSS
                if (typeof updates[key] === 'string') {
                    // Remove potentially dangerous characters
                    const sanitized = updates[key]
                        .replace(/[<>{}[\]\\/"';`]/g, '')
                        .trim();
                    
                    // Validate length
                    if (key === 'name' && (sanitized.length < 2 || sanitized.length > 50)) {
                        return res.status(400).json({ error: "Name must be between 2 and 50 characters" });
                    }
                    if (key === 'location' && sanitized.length > 100) {
                        return res.status(400).json({ error: "Location must be less than 100 characters" });
                    }
                    if (key === 'bio' && sanitized.length > 500) {
                        return res.status(400).json({ error: "Bio must be less than 500 characters" });
                    }
                    
                    filteredUpdates[key] = sanitized;
                } else {
                    filteredUpdates[key] = updates[key];
                }
            }
        }
        
        // Ensure there's something to update
        if (Object.keys(filteredUpdates).length === 0) {
            return res.status(400).json({ error: "No valid fields to update" });
        }
        
        const user = await User.findOneAndUpdate(
            { firebaseUid: req.user.uid },
            filteredUpdates,
            { new: true, runValidators: true }
        );
        
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        console.error("Profile update error:", err);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

export const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }

        // Upload image to GridFS
        const imageId = await uploadImage(req.file.buffer, `profile-${req.user.uid}-${Date.now()}.jpg`);
        const imageUrl = `/api/images/${imageId}`;

        // Update user profile with new image URL
        const user = await User.findOneAndUpdate(
            { firebaseUid: req.user.uid },
            { profileImage: imageUrl },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ profileImage: imageUrl, message: "Profile image uploaded successfully" });
    } catch (err) {
        console.error("Profile image upload error:", err);
        res.status(500).json({ error: "Failed to upload profile image" });
    }
};