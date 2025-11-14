import Achievement from "../models/Achievement.js";
import User from "../models/User.js";

// Define comprehensive achievement templates
const ACHIEVEMENT_TEMPLATES = [
    // Participation
    { type: "first_challenge", title: "Challenge Starter", description: "Join your first challenge", icon: "🎯", goal: 1, points: 100, category: "participation", tier: "bronze" },
    { type: "challenges_3", title: "Dedicated Volunteer", description: "Complete 3 challenges", icon: "⭐", goal: 3, points: 300, category: "participation", tier: "silver" },
    { type: "challenges_10", title: "Challenge Master", description: "Complete 10 challenges", icon: "🏆", goal: 10, points: 1000, category: "participation", tier: "gold" },
    { type: "challenges_25", title: "Eco Champion", description: "Complete 25 challenges", icon: "🎖️", goal: 25, points: 2500, category: "participation", tier: "platinum" },

    // Collection
    { type: "items_50", title: "Small Steps", description: "Collect 50 items total", icon: "🌱", goal: 50, points: 150, category: "collection", tier: "bronze" },
    { type: "items_200", title: "Cleanup Crusader", description: "Collect 200 items total", icon: "♻️", goal: 200, points: 500, category: "collection", tier: "silver" },
    { type: "items_500", title: "Elite Collector", description: "Collect 500 items total", icon: "💎", goal: 500, points: 1200, category: "collection", tier: "gold" },
    { type: "items_1000", title: "Waste Warrior", description: "Collect 1000 items total", icon: "🔱", goal: 1000, points: 2500, category: "collection", tier: "platinum" },

    // Impact (Points based)
    { type: "impact_1000", title: "Rising Star", description: "Achieve 1,000 Impact Points", icon: "🌟", goal: 1000, points: 500, category: "impact", tier: "silver" },
    { type: "impact_5000", title: "Community Leader", description: "Achieve 5,000 Impact Points", icon: "👑", goal: 5000, points: 1500, category: "impact", tier: "gold" },
    
    // Special
    { type: "first_cleanup", title: "First Cleanup Log", description: "Upload a picture for the first time", icon: "📸", goal: 1, points: 150, category: "special", tier: "bronze" },
    { type: "regional_hero", title: "Local Impact", description: "Participate in challenges in 3 provinces/regions", icon: "🗺️", goal: 3, points: 750, category: "special", tier: "silver" },
];

// Helper function to create or find achievement
async function getOrCreateAchievement(userId, template) {
    try {
        let achievement = await Achievement.findOne({
            user: userId,
            achievementType: template.type
        });

        if (!achievement) {
            achievement = await Achievement.create({
                user: userId,
                achievementType: template.type,
                title: template.title,
                description: template.description,
                icon: template.icon,
                goal: template.goal,
                pointsAwarded: template.points,
                category: template.category,
                tier: template.tier,
                progress: 0,
                isUnlocked: false
            });
        }

        return achievement;
    } catch (error) {
        if (error.code === 11000) {
            return Achievement.findOne({
                user: userId,
                achievementType: template.type
            });
        }
        throw error;
    }
}

// @desc    Get user achievements with progress
// @route   GET /api/achievements
// @access  Private
export const getUserAchievements = async (req, res) => {
    try {
        const userId = req.user.uid;
        const user = await User.findOne({ firebaseUid: userId }).populate('joinedChallenges', 'province');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Calculate unique provinces from joined challenges
        const uniqueProvinces = user.joinedChallenges 
            ? [...new Set(user.joinedChallenges.map(challenge => challenge.province).filter(p => p))]
            : [];

        const userStats = {
            totalChallenges: user.totalChallenges || 0,
            totalItemsCollected: user.totalItemsCollected || 0,
            impactScore: user.impactScore || 0,
            totalCleanups: user.totalCleanups || 0,
            uniqueProvincesCount: uniqueProvinces.length,
        };

        const achievements = await Promise.all(
            ACHIEVEMENT_TEMPLATES.map(template => 
                getOrCreateAchievement(user._id, template)
            )
        );

        const updatedAchievements = await Promise.all(
            achievements.filter(a => a != null).map(async achievement => {
                let currentProgress = 0;
                
                // Achievement progress logic
                switch (achievement.achievementType) {
                    case "first_challenge":
                        currentProgress = userStats.totalChallenges >= 1 ? 1 : 0;
                        break;
                    case "challenges_3":
                    case "challenges_10":
                    case "challenges_25":
                        currentProgress = userStats.totalChallenges;
                        break;
                    case "items_50":
                    case "items_200":
                    case "items_500":
                    case "items_1000":
                        currentProgress = userStats.totalItemsCollected;
                        break;
                    case "impact_1000":
                    case "impact_5000":
                        currentProgress = userStats.impactScore;
                        break;
                    case "first_cleanup":
                        currentProgress = userStats.totalCleanups >= 1 ? 1 : 0;
                        break;
                    case "regional_hero":
                        currentProgress = userStats.uniqueProvincesCount;
                        break;
                    default:
                        console.warn(`Achievement type '${achievement.achievementType}' not implemented in progress logic`);
                        currentProgress = achievement.progress;
                }

                const shouldUnlock = currentProgress >= achievement.goal && !achievement.isUnlocked;
                
                if (shouldUnlock) {
                    achievement.isUnlocked = true;
                    achievement.unlockedAt = new Date();
                    achievement.progress = achievement.goal;
                    
                    await User.findByIdAndUpdate(user._id, {
                        $inc: { impactScore: achievement.pointsAwarded }
                    });
                } else {
                    achievement.progress = Math.min(currentProgress, achievement.goal);
                }

                await achievement.save();
                return achievement;
            })
        );

        res.json({ success: true, achievements: updatedAchievements });

    } catch (error) {
        console.error("Error fetching achievements:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Get leaderboard
// @route   GET /api/achievements/leaderboard
// @access  Private
export const getLeaderboard = async (req, res) => {
    try {
        const topUsers = await User.find()
            .select("name profileImage totalItemsCollected impactScore")
            .sort({ 
                impactScore: -1, 
                totalItemsCollected: -1 
            }) 
            .limit(10);

        const leaderboard = topUsers.map((user, index) => ({
            rank: index + 1,
            name: user.name || "Anonymous",
            avatar: user.profileImage || "",
            items: user.totalItemsCollected || 0,
            points: user.impactScore || 0,
            badge: index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : ""
        }));

        res.json({ success: true, leaderboard });

    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Get milestones progress
// @route   GET /api/achievements/milestones
// @access  Private
export const getMilestones = async (req, res) => {
    try {
        const userId = req.user.uid;
        const user = await User.findOne({ firebaseUid: userId });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const challengeMilestones = [
            { label: "Complete 5 challenges", reward: "+250 points", current: user.totalChallenges || 0, goal: 5 },
            { label: "Complete 10 challenges", reward: "+500 points", current: user.totalChallenges || 0, goal: 10 },
            { label: "Complete 25 challenges", reward: "+1200 points", current: user.totalChallenges || 0, goal: 25 },
        ];
        
        const itemMilestones = [
            { label: "Collect 100 items", reward: "+50 points", current: user.totalItemsCollected || 0, goal: 100 },
            { label: "Collect 500 items", reward: "+200 points", current: user.totalItemsCollected || 0, goal: 500 },
            { label: "Collect 1000 items", reward: "+500 points", current: user.totalItemsCollected || 0, goal: 1000 },
        ];

        const allMilestones = [...challengeMilestones, ...itemMilestones];

        const processedMilestones = allMilestones.map(m => ({
            ...m,
            completed: m.current >= m.goal,
            progress: Math.min(Math.round((m.current / m.goal) * 100), 100)
        }));

        const nextMilestone = processedMilestones.find(m => !m.completed);

        res.json({
            success: true,
            milestones: processedMilestones,
            nextMilestone: nextMilestone ? {
                label: nextMilestone.label,
                reward: nextMilestone.reward,
                remaining: nextMilestone.goal - nextMilestone.current,
                progress: nextMilestone.progress
            } : null
        });

    } catch (error) {
        console.error("Error fetching milestones:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Get achievement summary stats
// @route   GET /api/achievements/stats
// @access  Private
export const getAchievementStats = async (req, res) => {
    try {
        const userId = req.user.uid;
        const user = await User.findOne({ firebaseUid: userId });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const achievements = await Achievement.find({ user: user._id });
        const unlockedCount = achievements.filter(a => a.isUnlocked).length;
        const totalPossibleAchievements = ACHIEVEMENT_TEMPLATES.length;

        const usersAbove = await User.countDocuments({ impactScore: { $gt: user.impactScore || 0 } });
        const rank = usersAbove + 1;
        
        const formatPoints = (num) => {
            if (num >= 1000) {
                return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
            }
            return num.toString();
        }

        res.json({
            success: true,
            stats: {
                achievements: `${unlockedCount} / ${totalPossibleAchievements}`,
                totalPoints: formatPoints(user.impactScore || 0),
                rank: `#${rank}`,
                completion: totalPossibleAchievements > 0 ? `${Math.round((unlockedCount / totalPossibleAchievements) * 100)}%` : "0%"
            }
        });

    } catch (error) {
        console.error("Error fetching achievement stats:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
