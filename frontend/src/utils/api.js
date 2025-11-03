import axios from "axios";
import { auth } from "@/lib/firebase";

// Helper to get a fresh ID token for the current user
export async function getIdToken(forceRefresh = false) {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user.");
    // Use forceRefresh=true for critical actions
    return await user.getIdToken(forceRefresh);
}

// Wrapper for API calls that always sends fresh token
export async function apiCall(method, url, data = {}, forceRefresh = false) {
    const idToken = await getIdToken(forceRefresh);
    const config = {
        headers: { Authorization: `Bearer ${idToken}` },
    };

    // GET and DELETE do not use 'data' argument in axios, must use 'params' instead for GET if needed
    if (method === 'get' || method === 'delete') {
        return axios[method](url, config);
    }
    // POST, PUT, PATCH use (url, data, config)
    return axios[method](url, data, config);
}