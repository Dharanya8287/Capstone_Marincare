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

/**
 * @desc    Register a new user in Firebase and MongoDB
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
    const { email, password, name } = req.body;

    // Basic validation
    if (!email || !password || !name) {
        return res.status(400).json({ success: false, message: "Please provide email, password, and name" });
    }

    // 1. Check if user already exists in MongoDB
    const mongoUserExists = await User.findOne({ email });
    if (mongoUserExists) {
        return res.status(400).json({ success: false, message: "Email is already registered" });
    }

    let firebaseUser;
    try {
        // 2. Create user in Firebase Auth
        firebaseUser = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: name,
        });

        // 3. Create user in MongoDB
        const newUser = await User.create({
            firebaseUid: firebaseUser.uid,
            email: email,
            name: name,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                firebaseUid: newUser.firebaseUid,
                name: newUser.name,
                email: newUser.email,
            },
        });

    } catch (error) {
        // 4. Rollback: If MongoDB creation fails, delete the Firebase user
        // This prevents de-synced "ghost" users
        if (firebaseUser) {
            await admin.auth().deleteUser(firebaseUser.uid);
            console.error(`Rollback: Deleted Firebase user ${firebaseUser.uid} due to MongoDB error.`);
        }

        console.error("Registration Error:", error);
        // Handle Firebase-specific errors
        if (error.code === 'auth/email-already-exists') {
            return res.status(400).json({ success: false, message: "Email is already registered" });
        }
        if (error.code === 'auth/invalid-password') {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        res.status(500).json({ success: false, message: "Server error during registration" });
    }
};


/**
 * @desc    Sync Firebase user to MongoDB (on login)
 * @route   POST /api/auth/sync
 * @access  Public (Relies on ID token)
 */
export const syncUser = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken || typeof idToken !== "string") {
            return res.status(400).json({ success: false, message: "Missing Firebase ID token" });
        }

        const decoded = await admin.auth().verifyIdToken(idToken);
        const { uid, name, email, picture } = decoded;

        // Find existing user or create a new one (upsert logic)
        // This is safe for login/Google Sign-In as it won't create duplicates
        let user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            console.log(`Sync: User ${uid} not found in MongoDB. Creating...`);
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
        console.error("Firebase auth/sync error:", error.message);
        res.status(401).json({ success: false, message: "Invalid or expired Firebase token" });
    }
};
