import { useState, useEffect } from "react";
import { apiCall } from "@/utils/api";

export default function useProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await apiCall('get', `${process.env.NEXT_PUBLIC_API_URL}/api/profile`);
            setProfile(res.data);
            setError("");
        } catch (err) {
            setError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const updateProfile = async (updates) => {
        setLoading(true);
        try {
            const res = await apiCall("patch", "/api/profile", updates);
            setProfile(res.data);
            setError("");
        } catch (err) {
            setError("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return { profile, loading, error, fetchProfile, updateProfile };
}