"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Box, CircularProgress } from "@mui/material";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
    useEffect(() => {
        // Primary listener for Firebase authentication state changes.
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
=======
  useEffect(() => {
    // This is the primary listener for Firebase authentication state changes.
    // It will fire automatically after signInWithPopup is successful.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // The redirect handling logic has been removed as it's no longer needed.

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
  };
>>>>>>> origin/main

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
