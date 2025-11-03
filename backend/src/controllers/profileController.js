// backend/src/controllers/profileController.js
import User from "../models/User.js";

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