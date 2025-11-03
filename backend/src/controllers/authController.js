import admin from "../config/firebase.js";
import User from "../models/User.js";

// Helper: check Firebase Auth for user by email
const firebaseEmailExists = async (email) => {
    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        return !!userRecord;
    } catch (err) {
        // Firebase throws error if not found
        return false;
    }
};

export const checkEmail = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email || typeof email !== "string") {
            return res.status(400).json({ exists: false, message: "Email required" });
        }

        // Check MongoDB first
        const user = await User.findOne({ email });
        if (user) return res.json({ exists: true, message: "Email already registered (database)" });

        // Check Firebase if not in MongoDB
        const existsInFirebase = await firebaseEmailExists(email);
        if (existsInFirebase) {
            return res.json({ exists: true, message: "Email already registered (Firebase)" });
        }

        res.json({ exists: false, message: "Email available" });
    } catch (error) {
        console.error("Email check failed", error);
        res.status(500).json({ exists: false, message: "Server error" });
    }
};

// ---- YOU WERE MISSING THIS EXPORT ----
export const syncUser = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken || typeof idToken !== "string") {
            return res.status(400).json({ success: false, message: "Missing Firebase ID token" });
        }

        const decoded = await admin.auth().verifyIdToken(idToken);
        const { uid, name, email, picture } = decoded;

        let user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            user = await User.create({
                firebaseUid: uid,
                name: name || (email ? email.split("@")[0] : "Anonymous"),
                email,
                profileImage: picture || "",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User synced successfully",
            user: {
                id: user._id,
                firebaseUid: user.firebaseUid,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
            },
        });
    } catch (error) {
        console.error("Firebase auth error");
        res.status(401).json({ success: false, message: "Invalid or expired Firebase token" });
    }
};