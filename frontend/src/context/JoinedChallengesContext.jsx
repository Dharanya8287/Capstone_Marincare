"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiCall, requestCache } from "@/utils/api";
import { useAuthContext } from "./AuthContext";

// Create context
const JoinedChallengesContext = createContext();

// Provider component
export const JoinedChallengesProvider = ({ children }) => {
    const [joinedChallenges, setJoinedChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useAuthContext();
    const userUid = user?.uid;

    // Fetch joined challenges from backend on mount
    const fetchJoinedChallenges = useCallback(async () => {
        if (!isAuthenticated || !userUid) {
            setJoinedChallenges([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await apiCall('get', `${process.env.NEXT_PUBLIC_API_URL}/api/challenges/joined`);
            setJoinedChallenges(response.data || []);
        } catch (error) {
            if (error.isRateLimitError) {
                console.warn('Rate limit reached when fetching joined challenges:', error.message);
            } else {
                console.error('Error fetching joined challenges:', error);
            }
            setJoinedChallenges([]);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, userUid]);

    // Fetch on mount and when auth status changes
    useEffect(() => {
        fetchJoinedChallenges();
    }, [fetchJoinedChallenges]);

    const joinChallenge = async (challengeId, location = null) => {
        try {
            const requestBody = location ? { location } : {};
            const response = await apiCall(
                'post', 
                `${process.env.NEXT_PUBLIC_API_URL}/api/challenges/${challengeId}/join`,
                requestBody
            );
            
            // Invalidate joined challenges cache before refetching
            requestCache.invalidatePattern('/api/challenges/joined');
            
            // Refresh the list after joining
            await fetchJoinedChallenges();
            
            return response.data;
        } catch (error) {
            console.error('Error joining challenge:', error);
            throw error;
        }
    };

    const leaveChallenge = async (challengeId) => {
        try {
            const response = await apiCall('post', `${process.env.NEXT_PUBLIC_API_URL}/api/challenges/${challengeId}/leave`);
            
            // Invalidate joined challenges cache before refetching
            requestCache.invalidatePattern('/api/challenges/joined');
            
            // Refresh the list after leaving
            await fetchJoinedChallenges();
            
            return response.data;
        } catch (error) {
            console.error('Error leaving challenge:', error);
            throw error;
        }
    };

    const isJoined = (id) => joinedChallenges.some((c) => c._id === id);
    
    const getActiveChallenges = () => joinedChallenges.filter((c) => c.status === "active");

    return (
        <JoinedChallengesContext.Provider
            value={{ 
                joinedChallenges, 
                joinChallenge, 
                leaveChallenge,
                isJoined, 
                getActiveChallenges,
                loading,
                refreshJoinedChallenges: fetchJoinedChallenges
            }}
        >
            {children}
        </JoinedChallengesContext.Provider>
    );
};

// Custom hook for easy access
export const useJoinedChallenges = () => useContext(JoinedChallengesContext);
