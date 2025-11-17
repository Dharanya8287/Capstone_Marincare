import admin from "../config/firebase.js";

/**
 * Verify session cookie (HttpOnly) - XSS Protection
 */
export const verifySessionCookie = async (req, res, next) => {
    try {
        const sessionCookie = req.cookies?.session;
        
        if (!sessionCookie) {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized - No session found" 
            });
        }

        // Verify the session cookie
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true); // checkRevoked = true
        req.user = decodedClaims;
        next();
    } catch (err) {
        console.error("Session verification failed:", err.code || err.message);
        
        // Clear invalid cookie
        res.clearCookie('session', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });

        if (err.code === 'auth/session-cookie-expired') {
            return res.status(401).json({ success: false, message: "Session expired. Please login again." });
        } else if (err.code === 'auth/session-cookie-revoked') {
            return res.status(401).json({ success: false, message: "Session has been revoked. Please login again." });
        }
        
        return res.status(401).json({ success: false, message: "Invalid session. Please login again." });
    }
};

/**
 * Verify Firebase ID token from Authorization header (Legacy support)
 */
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

/**
 * Verify authentication - try session cookie first, fallback to Bearer token
 * This provides backward compatibility while transitioning to session cookies
 */
export const verifyAuth = async (req, res, next) => {
    // Try session cookie first (preferred, XSS-safe)
    const sessionCookie = req.cookies?.session;
    
    if (sessionCookie) {
        try {
            const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
            req.user = decodedClaims;
            return next();
        } catch (err) {
            console.error("Session verification failed, trying Bearer token:", err.message);
            // Clear invalid cookie
            res.clearCookie('session', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
            });
            // Fall through to try Bearer token
        }
    }

    // Fallback to Bearer token (backward compatibility)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
            const token = authHeader.split(" ")[1];
            if (token && token.trim() !== "") {
                const decoded = await admin.auth().verifyIdToken(token, true);
                req.user = decoded;
                return next();
            }
        } catch (err) {
            console.error("Bearer token verification failed:", err.message);
        }
    }

    // Neither method succeeded
    return res.status(401).json({ 
        success: false, 
        message: "Unauthorized - Please login again." 
    });
};