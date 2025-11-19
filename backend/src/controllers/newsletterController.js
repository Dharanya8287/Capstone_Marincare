import Newsletter from "../models/Newsletter.js";

// Simple in-memory rate limiter for newsletter subscriptions
const subscriptionAttempts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_ATTEMPTS = 3; // 3 attempts per minute per IP

const checkRateLimit = (ip) => {
    const now = Date.now();
    const attempts = subscriptionAttempts.get(ip) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < RATE_LIMIT_WINDOW);
    
    if (recentAttempts.length >= MAX_ATTEMPTS) {
        return false; // Rate limit exceeded
    }
    
    // Add current attempt
    recentAttempts.push(now);
    subscriptionAttempts.set(ip, recentAttempts);
    
    return true; // Within rate limit
};

export const subscribeToNewsletter = async (req, res) => {
    try {
        // Rate limiting check
        const ip = req.ip || req.connection.remoteAddress;
        if (!checkRateLimit(ip)) {
            return res.status(429).json({ 
                message: "Too many subscription attempts. Please try again in a minute." 
            });
        }

        const { email } = req.body;

        // Better email validation
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ message: "Valid email is required" });
        }

        const trimmedEmail = email.trim().toLowerCase();
        
        // Email regex validation
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        
        if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 254) {
            return res.status(400).json({ message: "Please provide a valid email address" });
        }

        // Check if email already exists
        const existing = await Newsletter.findOne({ email: trimmedEmail });
        
        if (existing) {
            if (existing.subscribed) {
                return res.status(200).json({ 
                    message: "You're already subscribed to our newsletter!" 
                });
            } else {
                // Re-subscribe if previously unsubscribed
                existing.subscribed = true;
                existing.subscribedAt = new Date();
                await existing.save();
                return res.status(200).json({ 
                    message: "Welcome back! You've been re-subscribed to our newsletter." 
                });
            }
        }

        // Create new subscription
        const subscription = new Newsletter({ 
            email: trimmedEmail,
            subscribed: true,
            subscribedAt: new Date()
        });
        
        await subscription.save();

        res.status(201).json({ 
            message: "Successfully subscribed to our newsletter!",
            email: subscription.email
        });
    } catch (error) {
        console.error("Newsletter subscription error:", error);
        res.status(500).json({ 
            message: "Failed to subscribe. Please try again later." 
        });
    }
};

export const getNewsletterSubscribers = async (req, res) => {
    try {
        const subscribers = await Newsletter.find({ subscribed: true })
            .select('email subscribedAt')
            .sort({ subscribedAt: -1 });

        res.status(200).json({
            count: subscribers.length,
            subscribers
        });
    } catch (error) {
        console.error("Error fetching newsletter subscribers:", error);
        res.status(500).json({ message: "Failed to fetch subscribers" });
    }
};
