import Newsletter from "../models/Newsletter.js";

export const subscribeToNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.includes("@")) {
            return res.status(400).json({ message: "Valid email is required" });
        }

        // Check if email already exists
        const existing = await Newsletter.findOne({ email: email.toLowerCase() });
        
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
            email: email.toLowerCase(),
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
