"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Box, CircularProgress } from "@mui/material";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // This is the primary listener for Firebase authentication state changes.
        // It will fire automatically after signInWithPopup is successful.
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            // If the user is signed in, log the JWT token to the backend terminal
            if (currentUser) {
                try {
                    const idToken = await currentUser.getIdToken(true);
                    // Send token to backend for logging in terminal
                    await fetch("http://localhost:5000/api/log-token", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ token: idToken }),
                    });
                } catch (err) {
                    // Ignore errors to avoid affecting auth flow
                }
            }
        });

        // Cleanup the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    const value = {
        user,
        isAuthenticated: !!user,
        loading,
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