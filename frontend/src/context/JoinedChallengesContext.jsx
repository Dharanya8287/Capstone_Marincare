"use client";
import React, { createContext, useContext, useState } from "react";

// Create context
const JoinedChallengesContext = createContext();

// Provider component
export const JoinedChallengesProvider = ({ children }) => {
    const [joinedChallenges, setJoinedChallenges] = useState([]);

    const joinChallenge = (challenge) => {
        if (!joinedChallenges.some((c) => c._id === challenge._id)) {
            setJoinedChallenges((prev) => [...prev, challenge]);
        }
    };

    const isJoined = (id) => joinedChallenges.some((c) => c._id === id);
    const getActiveChallenges = () => joinedChallenges.filter((c) => c.status === "active");

    return (
        <JoinedChallengesContext.Provider
            value={{ joinedChallenges, joinChallenge, isJoined, getActiveChallenges }}
        >
            {children}
        </JoinedChallengesContext.Provider>
    );
};

// Custom hook for easy access
export const useJoinedChallenges = () => useContext(JoinedChallengesContext);
