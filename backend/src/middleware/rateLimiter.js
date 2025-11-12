/**
 * Rate limiting middleware to prevent brute force attacks
 * Uses in-memory storage for simplicity (consider Redis for production)
 */

const requestCounts = new Map();
const blockedIPs = new Map();

// Configuration
const CONFIG = {
    // Maximum requests per window
    MAX_REQUESTS: 5,
    // Time window in milliseconds (1 minute)
    WINDOW_MS: 60 * 1000,
    // Block duration in milliseconds (15 minutes)
    BLOCK_DURATION_MS: 15 * 60 * 1000,
    // Cleanup interval (5 minutes)
    CLEANUP_INTERVAL_MS: 5 * 60 * 1000,
};

/**
 * Get client identifier (IP address)
 */
const getClientIdentifier = (req) => {
    // Try to get real IP from proxy headers
    return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
           req.headers['x-real-ip'] ||
           req.connection.remoteAddress ||
           req.socket.remoteAddress ||
           'unknown';
};

/**
 * Clean up old entries periodically
 */
setInterval(() => {
    const now = Date.now();
    
    // Clean up request counts
    for (const [key, data] of requestCounts.entries()) {
        if (now - data.startTime > CONFIG.WINDOW_MS) {
            requestCounts.delete(key);
        }
    }
    
    // Clean up blocked IPs
    for (const [key, blockTime] of blockedIPs.entries()) {
        if (now - blockTime > CONFIG.BLOCK_DURATION_MS) {
            blockedIPs.delete(key);
        }
    }
}, CONFIG.CLEANUP_INTERVAL_MS);

/**
 * Rate limiting middleware
 */
export const rateLimiter = (req, res, next) => {
    const clientId = getClientIdentifier(req);
    const now = Date.now();

    // Check if IP is blocked
    const blockTime = blockedIPs.get(clientId);
    if (blockTime) {
        const timeRemaining = Math.ceil((CONFIG.BLOCK_DURATION_MS - (now - blockTime)) / 1000 / 60);
        if (now - blockTime < CONFIG.BLOCK_DURATION_MS) {
            return res.status(429).json({
                success: false,
                message: `Too many failed attempts. Please try again in ${timeRemaining} minutes.`,
            });
        } else {
            // Block expired, remove it
            blockedIPs.delete(clientId);
        }
    }

    // Get or create request count for this client
    let requestData = requestCounts.get(clientId);
    
    if (!requestData) {
        // First request in this window
        requestData = {
            count: 1,
            startTime: now,
        };
        requestCounts.set(clientId, requestData);
        return next();
    }

    // Check if we're still in the same window
    if (now - requestData.startTime > CONFIG.WINDOW_MS) {
        // Window expired, reset
        requestData.count = 1;
        requestData.startTime = now;
        requestCounts.set(clientId, requestData);
        return next();
    }

    // Increment count
    requestData.count++;

    // Check if limit exceeded
    if (requestData.count > CONFIG.MAX_REQUESTS) {
        // Block the IP
        blockedIPs.set(clientId, now);
        requestCounts.delete(clientId);
        
        return res.status(429).json({
            success: false,
            message: `Too many requests. Your IP has been temporarily blocked. Please try again in ${Math.ceil(CONFIG.BLOCK_DURATION_MS / 1000 / 60)} minutes.`,
        });
    }

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', CONFIG.MAX_REQUESTS);
    res.setHeader('X-RateLimit-Remaining', CONFIG.MAX_REQUESTS - requestData.count);
    res.setHeader('X-RateLimit-Reset', new Date(requestData.startTime + CONFIG.WINDOW_MS).toISOString());

    next();
};

/**
 * Stricter rate limiting for login/register endpoints
 */
export const authRateLimiter = (req, res, next) => {
    // Use the same rate limiter but with stricter limits
    const originalMaxRequests = CONFIG.MAX_REQUESTS;
    CONFIG.MAX_REQUESTS = 5; // 5 attempts per minute for auth
    
    rateLimiter(req, res, (err) => {
        CONFIG.MAX_REQUESTS = originalMaxRequests; // Restore original
        if (err) return next(err);
        next();
    });
};
