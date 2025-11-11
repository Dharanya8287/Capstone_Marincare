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
        const user = await User.findOneAndUpdate(
            { firebaseUid: req.user.uid },
            updates,
            { new: true }
        );
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
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