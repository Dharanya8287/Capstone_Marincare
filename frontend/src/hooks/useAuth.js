import { auth } from "@/lib/firebase";
import axios from "axios";
import {
    setPersistence,
    browserSessionPersistence,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword, // This is no longer used for signup, but kept for reference
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";

// Helper: Sync user with backend and retry if needed
// This is now only used for LOGIN and GOOGLE SIGN-IN
async function syncUser(idToken, retries = 2) {
    try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sync`, { idToken });
    } catch (err) {
        if (retries > 0) {
            await new Promise((res) => setTimeout(res, 500));
            return syncUser(idToken, retries - 1);
        }
        throw new Error("Failed to sync user. Please check your connection and try again.");
    }
}

export default function useAuth() {
    const ensureSessionPersistence = async () => {
        // Double-enforce session-only before any sign-in flow (defensive)
        await setPersistence(auth, browserSessionPersistence);
    };

    const login = async (email, password) => {
        await ensureSessionPersistence();
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCred.user.getIdToken(true);
        // Sync on login
        await syncUser(idToken);
    };

    /**
     * @desc NEW SIGNUP FLOW
     * 1. Call our backend to create the user in Firebase (Admin) and MongoDB atomically.
     * 2. If successful, log the user in on the client-side.
     */
    const signup = async (email, password, name) => {
        await ensureSessionPersistence();

        // 1. Call backend to register user
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
                email,
                password,
                name,
            });
        } catch (err) {
            // Forward backend error message if it exists
            if (err.response && err.response.data && err.response.data.message) {
                throw new Error(err.response.data.message);
            }
            throw new Error("Registration failed. Please try again.");
        }

        // 2. If backend registration is successful, log the user in on the client
        // This will trigger the AuthContext listener and redirect the user.
        try {
            await login(email, password);
        } catch (loginErr) {
            // This should rarely fail if registration succeeded, but good to handle
            console.error("Login after signup failed:", loginErr);
            throw new Error("Account created, but login failed. Please go to the login page.");
        }
    };

    const googleLogin = async () => {
        await ensureSessionPersistence();
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
            const idToken = await result.user.getIdToken(true);
            // Sync on Google login (this is fine, it acts as an "get or create")
            await syncUser(idToken);
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    return { login, signup, googleLogin, logout };
}
