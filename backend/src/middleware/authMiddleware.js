import admin from "../config/firebase.js";

export const verifyFirebaseToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Unauthorized - Missing or invalid authorization header" });
        }

        const token = authHeader.split(" ")[1];
        if (!token || token.trim() === "") {
            return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
        }

        // Verify token with Firebase
        const decoded = await admin.auth().verifyIdToken(token, true); // checkRevoked = true
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Token verification failed:", err.code || err.message);
        
        // Don't expose detailed error messages to client for security
        if (err.code === 'auth/id-token-expired') {
            return res.status(401).json({ success: false, message: "Session expired. Please login again." });
        } else if (err.code === 'auth/id-token-revoked') {
            return res.status(401).json({ success: false, message: "Token has been revoked. Please login again." });
        } else if (err.code === 'auth/argument-error') {
            return res.status(401).json({ success: false, message: "Invalid token format." });
        }
        
        return res.status(401).json({ success: false, message: "Invalid or expired token. Please login again." });
    }
};