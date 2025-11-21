import axios from "axios";
import { auth } from "@/lib/firebase";
import { requestCache } from "./requestCache";

// Re-export requestCache for use in components that need to invalidate cache
export { requestCache };

// Helper to get a fresh ID token for the current user (backward compatibility)
export async function getIdToken(forceRefresh = false) {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user.");
    // Use forceRefresh=true for critical actions
    return await user.getIdToken(forceRefresh);
}

// Helper to wait for a specified duration
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// NEW: Wrapper for API calls using HttpOnly cookies (XSS-safe)
// No longer sends tokens in headers - relies on secure HttpOnly cookies
// Includes retry logic for rate limiting (429) errors
export async function apiCall(method, url, data = {}, forceRefresh = false, retryConfig = {}) {
    const {
        maxRetries = 2,
        initialDelay = 1000,
        maxDelay = 5000,
        useCache = true, // Enable caching by default for GET requests
        cacheTTL = 60000, // 1 minute cache TTL
    } = retryConfig;

    // Check cache for GET requests
    if (method === 'get' && useCache) {
        const cached = requestCache.get(method, url);
        if (cached) {
            return cached;
        }
    }

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

    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            let response;
            // GET and DELETE do not use 'data' argument in axios, must use 'params' instead for GET if needed
            if (method === 'get' || method === 'delete') {
                response = await axios[method](url, config);
            } else {
                // POST, PUT, PATCH use (url, data, config)
                response = await axios[method](url, data, config);
            }

            // Cache GET responses
            if (method === 'get' && useCache) {
                requestCache.set(method, url, response, cacheTTL);
            }

            return response;
        } catch (error) {
            lastError = error;

            // Check if it's a rate limit error (429)
            if (error.response?.status === 429) {
                // If we've exhausted retries, throw a user-friendly error
                if (attempt === maxRetries) {
                    const userMessage = error.response?.data?.message || 
                        'Too many requests. Please wait a moment and try again.';
                    const enhancedError = new Error(userMessage);
                    enhancedError.isRateLimitError = true;
                    enhancedError.originalError = error;
                    enhancedError.statusCode = 429;
                    throw enhancedError;
                }

                // Calculate exponential backoff delay
                const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
                console.warn(`Rate limit hit (429). Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
                await wait(delay);
                continue;
            }

            // For other errors, throw immediately without retrying
            throw error;
        }
    }

    // This should never be reached, but just in case
    throw lastError;
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
