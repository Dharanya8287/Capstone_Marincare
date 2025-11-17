import axios from "axios";
import { auth } from "@/lib/firebase";

// Helper to get a fresh ID token for the current user (backward compatibility)
export async function getIdToken(forceRefresh = false) {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user.");
    // Use forceRefresh=true for critical actions
    return await user.getIdToken(forceRefresh);
}

// NEW: Wrapper for API calls using HttpOnly cookies (XSS-safe)
// No longer sends tokens in headers - relies on secure HttpOnly cookies
export async function apiCall(method, url, data = {}, forceRefresh = false) {
    // Check if data is FormData. If so, don't set Content-Type,
    // let the browser set it (it's special for multipart/form-data)
    const isFormData = data instanceof FormData;

    const config = {
        withCredentials: true, // Send HttpOnly cookies with requests
        headers: {},
    };

    if (!isFormData) {
        config.headers['Content-Type'] = 'application/json';
    }

    // GET and DELETE do not use 'data' argument in axios, must use 'params' instead for GET if needed
    if (method === 'get' || method === 'delete') {
        return axios[method](url, config);
    }
    // POST, PUT, PATCH use (url, data, config)
    return axios[method](url, data, config);
}

// LEGACY: Wrapper for API calls using Bearer tokens (backward compatibility)
// This is kept for transition period but should be phased out
export async function apiCallWithToken(method, url, data = {}, forceRefresh = false) {
    const idToken = await getIdToken(forceRefresh);

    const isFormData = data instanceof FormData;

    const config = {
        withCredentials: true, // Also send cookies
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
    };

    if (!isFormData) {
        config.headers['Content-Type'] = 'application/json';
    }

    if (method === 'get' || method === 'delete') {
        return axios[method](url, config);
    }
    return axios[method](url, data, config);
}
