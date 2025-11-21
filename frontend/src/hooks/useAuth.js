import { auth } from "@/lib/firebase";
import axios from "axios";
import {
    setPersistence,
    browserSessionPersistence,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
} from "firebase/auth";

// Detect mobile device
function isMobileDevice() {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || window.innerWidth < 768;
}

// Sync user with backend (used for popup login)
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
        await setPersistence(auth, browserSessionPersistence);
    };

    const createSession = async (idToken) => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/create-session`,
                { idToken },
                { withCredentials: true }
            );
        } catch (err) {
            console.error("Session creation failed:", err);
            throw new Error("Failed to create secure session. Please try again.");
        }
    };

    const login = async (email, password) => {
        await ensureSessionPersistence();

        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCred.user.getIdToken(true);

        await createSession(idToken);
    };

    const signup = async (email, password, name) => {
        await ensureSessionPersistence();

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
                email,
                password,
                name,
            });
        } catch (err) {
            if (err.response?.data?.message) {
                throw new Error(err.response.data.message);
            }
            throw new Error("Registration failed. Please try again.");
        }

        try {
            await login(email, password);
        } catch (error) {
            console.error("Login after signup failed:", error);
            throw new Error("Account created, but login failed. Please login manually.");
        }
    };

    const googleLogin = async () => {
        await ensureSessionPersistence();
        const provider = new GoogleAuthProvider();

        if (isMobileDevice()) {
            await signInWithRedirect(auth, provider);
        } else {
            const result = await signInWithPopup(auth, provider);
            if (result.user) {
                const idToken = await result.user.getIdToken(true);
                await createSession(idToken);
                await syncUser(idToken);
            }
        }
    };

    const logout = async () => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
                {},
                { withCredentials: true }
            );
        } catch (err) {
            console.error("Backend logout failed:", err);
        }
        await signOut(auth);
    };

    /**
     * Handles mobile Google redirect login flow
     */
    const handleRedirectResult = async () => {
        try {
            const result = await getRedirectResult(auth);

            if (result && result.user) {
                const idToken = await result.user.getIdToken(true);
                await createSession(idToken);
                await syncUser(idToken);
                return result.user;
            }

            return null;

        } catch (error) {
            console.error("Error handling redirect result:", error);
            throw error;
        }
    };

    return { login, signup, googleLogin, logout, handleRedirectResult };
}
