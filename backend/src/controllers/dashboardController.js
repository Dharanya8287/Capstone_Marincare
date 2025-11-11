import User from "../models/User.js";
import Cleanup from "../models/Cleanup.js";
import Challenge from "../models/Challenge.js";
import mongoose from "mongoose";

// Category display mapping - matches frontend and challenge details
const CATEGORY_COLORS = {
    plastic_bottle: "#3b82f6",
    metal_can: "#f59e0b",
    plastic_bag: "#06b6d4",
    paper_cardboard: "#10b981",
    cigarette_butt: "#ef4444",
    glass_bottle: "#8b5cf6",
};

const CATEGORY_DISPLAY_NAMES = {
    plastic_bottle: "Plastic Bottles",
    metal_can: "Metal Cans",
    plastic_bag: "Plastic Bags",
    paper_cardboard: "Paper/Cardboard",
    cigarette_butt: "Cigarette Butts",
    glass_bottle: "Glass Bottles",
};

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get comprehensive dashboard statistics for authenticated user
 * @access  Private
 */
export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.mongoUser._id;

        // Fetch user data
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 1. Monthly Progress (last 6 months)
        const monthlyProgress = await getMonthlyProgress(userId);

        // 2. Waste Distribution by category
        const wasteDistribution = await getWasteDistribution(userId);

        // 3. Items by Type (detailed breakdown)
        const itemsByType = await getItemsByType(userId);

        // 4. Recent Cleanup Activity (last 5-10 cleanups)
        const recentActivity = await getRecentActivity(userId);

        // 5. User rank/position
        const userRank = await getUserRank(userId);

        // 6. Community statistics
        const communityStats = await getCommunityStats();

        // 7. Challenge participation summary
        const challengeParticipation = await getChallengeParticipation(userId);

        // 8. Top Contributors
        const topContributors = await getTopContributors(10);

        // Return comprehensive dashboard data
        res.json({
            user: {
                name: user.name,
                email: user.email,
                totalItemsCollected: user.totalItemsCollected,
                totalCleanups: user.totalCleanups,
                totalChallenges: user.totalChallenges,
                rank: userRank.rank,
                totalUsers: userRank.totalUsers,
            },
            monthlyProgress,
            wasteDistribution,
            itemsByType,
            recentActivity,
            communityStats,
            challengeParticipation,
            topContributors,
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

/**
 * Get monthly progress for the last 6 months
 */
async function getMonthlyProgress(userId) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await Cleanup.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                createdAt: { $gte: sixMonthsAgo },
                status: "completed",
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                },
                items: { $sum: "$itemCount" },
            },
        },
        {
            $sort: { "_id.year": 1, "_id.month": 1 },
        },
    ]);

    // Convert to frontend format with month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formatted = monthlyData.map((item) => ({
        month: monthNames[item._id.month - 1],
        items: item.items,
        year: item._id.year,
    }));

    // Ensure we always return 6 months, fill with zeros if needed
    const result = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        
        const existing = formatted.find(
            (d) => d.month === month && d.year === year
        );
        
        result.push({
            month: month,
            items: existing ? existing.items : 0,
        });
    }

    return result;
}

/**
 * Get waste distribution by category (for pie chart)
 */
async function getWasteDistribution(userId) {
    const distribution = await Cleanup.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                status: "completed",
            },
        },
        {
            $group: {
                _id: "$classificationResult.label",
                value: { $sum: "$itemCount" },
            },
        },
    ]);

    // Map to frontend format with display names and colors
    const formatted = distribution
        .filter((item) => item._id && item._id !== "unknown")
        .map((item) => ({
            name: CATEGORY_DISPLAY_NAMES[item._id] || item._id,
            value: item.value,
            color: CATEGORY_COLORS[item._id] || "#94a3b8",
            key: item._id,
        }));

    // If no data, return empty array (frontend should handle this)
    return formatted;
}

/**
 * Get items by type (for bar chart) - same as waste distribution but different format
 */
async function getItemsByType(userId) {
    const itemTypes = await Cleanup.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                status: "completed",
            },
        },
        {
            $group: {
                _id: "$classificationResult.label",
                count: { $sum: "$itemCount" },
            },
        },
        {
            $sort: { count: -1 },
        },
    ]);

    // Map to frontend format
    const formatted = itemTypes
        .filter((item) => item._id && item._id !== "unknown")
        .map((item) => ({
            type: CATEGORY_DISPLAY_NAMES[item._id] || item._id,
            count: item.count,
            color: CATEGORY_COLORS[item._id] || "#94a3b8",
            key: item._id,
        }));

    return formatted;
}

/**
 * Get recent cleanup activity (last 5-10 cleanups)
 */
async function getRecentActivity(userId, limit = 5) {
    const recentCleanups = await Cleanup.find({
        userId: new mongoose.Types.ObjectId(userId),
        status: "completed",
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("challengeId", "title locationName")
        .lean();

    // Format for frontend
    const formatted = recentCleanups.map((cleanup) => ({
        location: cleanup.challengeId?.locationName || cleanup.challengeId?.title || "Unknown Location",
        date: new Date(cleanup.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }),
        items: cleanup.itemCount,
        challengeTitle: cleanup.challengeId?.title,
        category: cleanup.classificationResult?.label,
    }));

    return formatted;
}

/**
 * Get user's rank among all users
 */
async function getUserRank(userId) {
    // Get total number of users
    const totalUsers = await User.countDocuments();

    // Find users with more items collected than current user
    const user = await User.findById(userId);
    const usersAhead = await User.countDocuments({
        totalItemsCollected: { $gt: user.totalItemsCollected },
    });

    return {
        rank: usersAhead + 1,
        totalUsers: totalUsers,
    };
}

/**
 * Get community-wide statistics
 */
async function getCommunityStats() {
    // Total items collected across all challenges
    const challengeStats = await Challenge.aggregate([
        {
            $group: {
                _id: null,
                totalItems: { $sum: "$totalTrashCollected" },
                totalVolunteers: { $sum: "$totalVolunteers" },
                totalChallenges: { $sum: 1 },
            },
        },
    ]);

    const stats = challengeStats[0] || {
        totalItems: 0,
        totalVolunteers: 0,
        totalChallenges: 0,
    };

    return {
        totalItemsCollected: stats.totalItems,
        totalVolunteers: stats.totalVolunteers,
        activeChallenges: stats.totalChallenges,
    };
}

/**
 * Get top contributors (leaderboard)
 */
async function getTopContributors(limit = 10) {
    const topUsers = await User.find()
        .sort({ totalItemsCollected: -1 })
        .limit(limit)
        .select('name email totalItemsCollected totalCleanups')
        .lean();

    // Format for frontend with rank
    const formatted = topUsers.map((user, index) => ({
        rank: index + 1,
        name: user.name,
        email: user.email,
        totalItems: user.totalItemsCollected,
        totalCleanups: user.totalCleanups,
    }));

    return formatted;
}
async function getChallengeParticipation(userId) {
    const user = await User.findById(userId).populate("joinedChallenges", "title status");

    const active = user.joinedChallenges.filter((c) => c.status === "active").length;
    const completed = user.joinedChallenges.filter((c) => c.status === "completed").length;
    const upcoming = user.joinedChallenges.filter((c) => c.status === "upcoming").length;

    return {
        total: user.joinedChallenges.length,
        active,
        completed,
        upcoming,
    };
}
