"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Box, CircularProgress } from "@mui/material";
import axios from "axios";

const AuthContext = createContext();

// Helper: Sync user with backend
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

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authVersion, setAuthVersion] = useState(0); // Track auth state changes

    useEffect(() => {
        // Check for redirect result first (for mobile Google sign-in)
        const checkRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result && result.user) {
                    // User signed in via redirect, sync with backend
                    const idToken = await result.user.getIdToken(true);
                    await syncUser(idToken);
                    setAuthVersion(prev => prev + 1); // Increment version on auth change
                }
            } catch (error) {
                console.error("Error handling redirect result:", error);
            }
        };

        checkRedirectResult();

        // This is the primary listener for Firebase authentication state changes.
        // It will fire automatically after signInWithPopup/signInWithRedirect is successful.
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            setAuthVersion(prev => prev + 1); // Increment version on every auth state change
        });

        // Cleanup the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        authVersion, // Expose version for components that need to react to auth changes
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
    return useContext(AuthContext);
};