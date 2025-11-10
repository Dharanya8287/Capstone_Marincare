import Challenge from "../models/Challenge.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// @desc    Fetch all challenges
export const getChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find({}).sort({ startDate: 1 });
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get aggregated stats for the challenges page
export const getChallengeStats = async (req, res) => {
    try {
        const totalChallenges = await Challenge.countDocuments();

        const activeVolunteersResult = await Challenge.aggregate([
            { $group: { _id: null, total: { $sum: "$totalVolunteers" } } }
        ]);

        const itemsCollectedResult = await Challenge.aggregate([
            { $group: { _id: null, total: { $sum: "$totalTrashCollected" } } }
        ]);

        const provincesResult = await Challenge.distinct("province");

        res.json({
            totalChallenges,
            activeVolunteers: activeVolunteersResult[0]?.total || 0,
            itemsCollected: itemsCollectedResult[0]?.total || 0,
            provinces: provincesResult.length || 0,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get single challenge by ID
// @route   GET /api/challenges/:id
// @access  Public
export const getChallengeById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid challenge ID" });
        }

        const challenge = await Challenge.findById(id);
        
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found" });
        }

        res.json(challenge);
    } catch (error) {
        console.error("Error fetching challenge:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Join a challenge
// @route   POST /api/challenges/:id/join
// @access  Private
export const joinChallenge = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.mongoUser._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid challenge ID" });
        }

        // Check if challenge exists
        const challenge = await Challenge.findById(id);
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found" });
        }

        // Check if user already joined
        const user = await User.findById(userId);
        if (user.joinedChallenges.includes(id)) {
            return res.status(400).json({ message: "Already joined this challenge" });
        }

        // Add challenge to user's joined challenges and increment totalChallenges
        await User.findByIdAndUpdate(userId, {
            $addToSet: { joinedChallenges: id },
            $inc: { totalChallenges: 1 }
        });

        // Increment challenge volunteer count
        const updatedChallenge = await Challenge.findByIdAndUpdate(
            id,
            { $inc: { totalVolunteers: 1 } },
            { new: true }
        );

        res.json({
            message: "Joined successfully",
            challenge: updatedChallenge
        });
    } catch (error) {
        console.error("Error joining challenge:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Leave a challenge
// @route   POST /api/challenges/:id/leave
// @access  Private
export const leaveChallenge = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.mongoUser._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid challenge ID" });
        }

        // Check if challenge exists
        const challenge = await Challenge.findById(id);
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found" });
        }

        // Check if user has joined
        const user = await User.findById(userId);
        if (!user.joinedChallenges.includes(id)) {
            return res.status(400).json({ message: "You haven't joined this challenge" });
        }

        // Remove challenge from user's joined challenges and decrement totalChallenges
        await User.findByIdAndUpdate(userId, {
            $pull: { joinedChallenges: id },
            $inc: { totalChallenges: -1 }
        });

        // Decrement challenge volunteer count (ensure it doesn't go below 0)
        const currentChallenge = await Challenge.findById(id);
        const newVolunteerCount = Math.max(0, currentChallenge.totalVolunteers - 1);
        
        const updatedChallenge = await Challenge.findByIdAndUpdate(
            id,
            { totalVolunteers: newVolunteerCount },
            { new: true }
        );

        res.json({
            message: "Left successfully",
            challenge: updatedChallenge
        });
    } catch (error) {
        console.error("Error leaving challenge:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get user's joined challenges
// @route   GET /api/challenges/joined
// @access  Private
export const getJoinedChallenges = async (req, res) => {
    try {
        const userId = req.mongoUser._id;
        const { status } = req.query;

        const user = await User.findById(userId).populate('joinedChallenges');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let joinedChallenges = user.joinedChallenges;

        // Filter by status if provided
        if (status && ['active', 'upcoming', 'completed'].includes(status.toLowerCase())) {
            joinedChallenges = joinedChallenges.filter(
                challenge => challenge.status.toLowerCase() === status.toLowerCase()
            );
        }

        res.json(joinedChallenges);
    } catch (error) {
        console.error("Error fetching joined challenges:", error);
        res.status(500).json({ message: "Server Error" });
    }
};