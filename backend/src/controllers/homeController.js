import User from "../models/User.js";
import Challenge from "../models/Challenge.js";
import Cleanup from "../models/Cleanup.js";

/**
 * @route   GET /api/home/stats
 * @desc    Get real-time statistics for home page
 * @access  Public
 */
export const getHomeStats = async (req, res) => {
    try {
        // Get total items collected from all cleanups
        const totalItemsResult = await Cleanup.aggregate([
            { $match: { status: "completed" } },
            { $group: { _id: null, total: { $sum: "$itemCount" } } }
        ]);
        const totalItemsCollected = totalItemsResult[0]?.total || 0;

        // Get active contributors (users who have completed at least one cleanup)
        const activeContributors = await User.countDocuments({
            totalItemsCollected: { $gt: 0 }
        });

        // Get live challenges count (active challenges)
        const liveChallenges = await Challenge.countDocuments({
            status: "active"
        });

        // Get total waste removed (sum from challenges)
        const totalWasteResult = await Challenge.aggregate([
            { $group: { _id: null, total: { $sum: "$totalTrashCollected" } } }
        ]);
        const totalWasteKg = totalWasteResult[0]?.total || 0;

        // Get beaches/shorelines cleaned (count unique provinces from challenges)
        const beachesCleanedResult = await Challenge.distinct("locationName");
        const beachesCleaned = beachesCleanedResult.length;

        res.json({
            totalItemsCollected,
            activeContributors,
            liveChallenges,
            totalWasteKg,
            beachesCleaned
        });
    } catch (error) {
        console.error("Error fetching home stats:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

/**
 * @route   GET /api/home/login-stats
 * @desc    Get real-time statistics for login page analytics section
 * @access  Public
 */
export const getLoginStats = async (req, res) => {
    try {
        // Get active volunteers (users with at least one cleanup or joined challenge)
        const activeVolunteers = await User.countDocuments({
            $or: [
                { totalItemsCollected: { $gt: 0 } },
                { totalChallenges: { $gt: 0 } }
            ]
        });

        // Get total items collected
        const totalItemsResult = await Cleanup.aggregate([
            { $match: { status: "completed" } },
            { $group: { _id: null, total: { $sum: "$itemCount" } } }
        ]);
        const itemsCollected = totalItemsResult[0]?.total || 0;

        // Get active challenges count
        const activeChallenges = await Challenge.countDocuments({
            status: "active"
        });

        // Calculate impact rate (percentage of users who are active)
        const totalUsers = await User.countDocuments();
        const impactRate = totalUsers > 0 
            ? Math.round((activeVolunteers / totalUsers) * 100) 
            : 0;

        // Calculate weekly changes (compare with data from 7 days ago)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const activeVolunteersLastWeek = await User.countDocuments({
            $or: [
                { totalItemsCollected: { $gt: 0 } },
                { totalChallenges: { $gt: 0 } }
            ],
            createdAt: { $lt: oneWeekAgo }
        });

        const itemsCollectedLastWeek = await Cleanup.aggregate([
            { 
                $match: { 
                    status: "completed",
                    createdAt: { $lt: oneWeekAgo }
                } 
            },
            { $group: { _id: null, total: { $sum: "$itemCount" } } }
        ]);

        const activeChallengesLastWeek = await Challenge.countDocuments({
            status: "active",
            createdAt: { $lt: oneWeekAgo }
        });

        // Calculate percentage changes
        const volunteersChange = activeVolunteersLastWeek > 0
            ? Math.round(((activeVolunteers - activeVolunteersLastWeek) / activeVolunteersLastWeek) * 100)
            : 0;

        const itemsChange = (itemsCollectedLastWeek[0]?.total || 0) > 0
            ? Math.round(((itemsCollected - (itemsCollectedLastWeek[0]?.total || 0)) / (itemsCollectedLastWeek[0]?.total || 0)) * 100)
            : 0;

        const challengesChange = activeChallenges - activeChallengesLastWeek;

        const totalUsersLastWeek = await User.countDocuments({
            createdAt: { $lt: oneWeekAgo }
        });
        const impactRateLastWeek = totalUsersLastWeek > 0
            ? Math.round((activeVolunteersLastWeek / totalUsersLastWeek) * 100)
            : 0;
        const impactRateChange = impactRate - impactRateLastWeek;

        res.json({
            activeVolunteers,
            itemsCollected,
            activeChallenges,
            impactRate,
            changes: {
                volunteersChange: `${volunteersChange >= 0 ? '+' : ''}${volunteersChange}%`,
                itemsChange: `${itemsChange >= 0 ? '+' : ''}${itemsChange}%`,
                challengesChange: `${challengesChange >= 0 ? '+' : ''}${challengesChange}`,
                impactRateChange: `${impactRateChange >= 0 ? '+' : ''}${impactRateChange}%`
            }
        });
    } catch (error) {
        console.error("Error fetching login stats:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
