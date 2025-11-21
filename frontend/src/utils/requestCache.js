/**
 * Simple in-memory cache for API requests to reduce redundant calls
 * and help avoid rate limiting issues
 */

class RequestCache {
    constructor() {
        this.cache = new Map();
        this.defaultTTL = 60000; // 1 minute default TTL
    }

    /**
     * Generate a cache key from request parameters
     */
    generateKey(method, url) {
        return `${method.toUpperCase()}:${url}`;
    }

    /**
     * Get cached response if available and not expired
     */
    get(method, url) {
        const key = this.generateKey(method, url);
        const cached = this.cache.get(key);

        if (!cached) {
            return null;
        }

        const now = Date.now();
        if (now > cached.expiresAt) {
            // Cache expired, remove it
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    /**
     * Store response in cache with TTL
     */
    set(method, url, data, ttl = this.defaultTTL) {
        const key = this.generateKey(method, url);
        this.cache.set(key, {
            data,
            expiresAt: Date.now() + ttl,
        });
    }

    /**
     * Invalidate cache for a specific request
     */
    invalidate(method, url) {
        const key = this.generateKey(method, url);
        this.cache.delete(key);
    }

    /**
     * Invalidate all cache entries matching a pattern
     */
    invalidatePattern(pattern) {
        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Clear all cache
     */
    clear() {
        this.cache.clear();
    }

    /**
     * Clean up expired entries
     */
    cleanup() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now > value.expiresAt) {
                this.cache.delete(key);
            }
        }
    }
}

// Export singleton instance
export const requestCache = new RequestCache();

// Cleanup expired entries every 5 minutes
if (typeof window !== 'undefined') {
    setInterval(() => requestCache.cleanup(), 5 * 60 * 1000);
}
