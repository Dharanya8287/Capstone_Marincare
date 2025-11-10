# WaveGuard Backend Architecture - Analysis & Implementation Plan

## 📊 Current State Analysis

### What's Already Built

#### Frontend (Complete UI)
- ✅ **Dashboard Page**: Charts showing monthly progress, waste distribution, items by type, recent activity, top contributors, community impact
- ✅ **Challenges Page**: Browse challenges with filters (region, status), view active/upcoming/completed challenges
- ✅ **Challenge Details Page**: View challenge info, progress bars, trash categories breakdown, join challenge button
- ✅ **Upload Page**: Two tabs - AI upload (single photo) and Manual logging (category + count)
- ✅ **Profile Page**: User stats, achievements, settings, edit profile
- ✅ **Authentication**: Firebase Auth (Google Sign-in)

#### Backend (Partially Implemented)
- ✅ **Database Models**:
  - `User`: firebaseUid, name, email, location, bio, stats (totalItemsCollected, totalCleanups, totalChallenges, impactScore), joinedChallenges[]
  - `Challenge`: title, description, location, dates, status, goal, totalTrashCollected, totalVolunteers, wasteBreakdown
  - `Cleanup`: userId, challengeId, imageFileId, classificationResult, itemCount, logType (ai/manual), status
  - `Notification`, `Badges`, `Analytics`, `Leaderboard` (models exist but unused)

- ✅ **Existing Endpoints**:
  - `GET /api/challenges` - List all challenges
  - `GET /api/challenges/stats` - Challenge aggregated stats
  - `POST /api/cleanups/upload` - AI photo upload (synchronous)
  - `POST /api/cleanups/manual` - Manual cleanup logging
  - `GET /api/profile` - Get user profile
  - `PATCH /api/profile` - Update user profile

- ✅ **Services**:
  - AI Service (using @xenova/transformers for trash classification)
  - GridFS for image storage
  - Firebase Admin for token verification

### What's Missing (Gaps to Fill)

#### 1. **Challenge Participation**
- ❌ No backend endpoint to join/leave a challenge
- ❌ No tracking of which users joined which challenges
- ❌ Frontend uses local state only (JoinedChallengesContext)

#### 2. **Real-time Data Updates**
- ❌ Challenge stats update after cleanup, but frontend doesn't refresh automatically
- ❌ No mechanism for live updates (WebSocket, SSE, or polling)
- ❌ Dashboard shows mock data instead of real user data

#### 3. **Dashboard Analytics**
- ❌ No endpoint for user's personal dashboard data
- ❌ No monthly progress tracking
- ❌ No waste distribution by category for a user
- ❌ No recent activity feed
- ❌ No top contributors/leaderboard data

#### 4. **Challenge Details Real-time Stats**
- ❌ Challenge page shows static data from initial load
- ❌ User's contribution to a specific challenge not tracked separately
- ❌ Trash categories breakdown in challenge details uses hardcoded data

#### 5. **Achievements/Badges System**
- ❌ Badge model exists but no logic to award badges
- ❌ No achievement tracking based on milestones

---

## 🏗️ Recommended Architecture (Simple & Clean)

### Design Principles for Capstone/Development Level

1. **Keep it Simple**: Use REST APIs with polling for "real-time" instead of WebSockets
2. **Use What Exists**: Leverage MongoDB aggregation for analytics
3. **Incremental Updates**: Update stats immediately after actions
4. **No Overhead**: Avoid complex pub/sub systems, message queues, or microservices
5. **Client-Side Refresh**: Use simple polling or manual refresh buttons

### Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (React/Next.js)             │
│  - Pages: Dashboard, Challenges, Upload, Profile        │
│  - Context: Auth, JoinedChallenges                      │
│  - API Client: axios with Firebase token                │
└─────────────────────────────────────────────────────────┘
                           ↓ HTTP REST API
┌─────────────────────────────────────────────────────────┐
│                    MIDDLEWARE LAYER                      │
│  - verifyFirebaseToken (auth)                           │
│  - ensureUserExists (auto-create MongoDB user)          │
│  - errorMiddleware (consistent error responses)         │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                   ROUTES / CONTROLLERS                   │
│  - challengeRoutes → challengeController                │
│  - cleanupRoutes → cleanupController                    │
│  - dashboardRoutes → dashboardController (NEW)          │
│  - profileRoutes → profileController                    │
│  - achievementsRoutes → achievementsController (NEW)    │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC                        │
│  - updateUserStats() - Increment user totals            │
│  - updateChallengeStats() - Increment challenge totals  │
│  - checkAndAwardBadges() - Award achievements           │
│  - computeLeaderboard() - Rank users                    │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                   DATABASE (MongoDB)                     │
│  Collections: users, challenges, cleanups, badges       │
│  GridFS: Image storage (cleanup photos)                 │
│  Indexes: userId, challengeId, timestamps               │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Proposed Implementation Plan

### Phase 1: Challenge Participation (Backend)

#### New Endpoints
```javascript
POST /api/challenges/:id/join
- Adds challengeId to user.joinedChallenges[]
- Increments challenge.totalVolunteers
- Returns updated challenge

POST /api/challenges/:id/leave
- Removes challengeId from user.joinedChallenges[]
- Decrements challenge.totalVolunteers
- Returns updated challenge

GET /api/challenges/joined
- Returns list of challenges the user has joined
- Filters by status (active, upcoming, completed)
```

#### Implementation (challengeController.js)
```javascript
export const joinChallenge = async (req, res) => {
  const { id } = req.params;
  const userId = req.mongoUser._id;
  
  // Add to user's joined challenges
  await User.findByIdAndUpdate(userId, {
    $addToSet: { joinedChallenges: id },
    $inc: { totalChallenges: 1 }
  });
  
  // Increment challenge volunteer count
  const challenge = await Challenge.findByIdAndUpdate(id, {
    $inc: { totalVolunteers: 1 }
  }, { new: true });
  
  res.json({ message: 'Joined successfully', challenge });
};

export const leaveChallenge = async (req, res) => {
  const { id } = req.params;
  const userId = req.mongoUser._id;
  
  await User.findByIdAndUpdate(userId, {
    $pull: { joinedChallenges: id },
    $inc: { totalChallenges: -1 }
  });
  
  const challenge = await Challenge.findByIdAndUpdate(id, {
    $inc: { totalVolunteers: -1 }
  }, { new: true });
  
  res.json({ message: 'Left successfully', challenge });
};

export const getJoinedChallenges = async (req, res) => {
  const userId = req.mongoUser._id;
  const user = await User.findById(userId).populate('joinedChallenges');
  res.json(user.joinedChallenges);
};
```

### Phase 2: Dashboard Analytics (Backend)

#### New Endpoint
```javascript
GET /api/dashboard/stats
- Returns user's personal dashboard data:
  - Monthly progress (last 6 months)
  - Waste distribution (aggregated by category)
  - Items collected by type
  - Recent cleanup activity
  - User's rank
  - Community stats
```

#### Implementation (dashboardController.js)
```javascript
export const getDashboardStats = async (req, res) => {
  const userId = req.mongoUser._id;
  
  // 1. Get user's basic stats
  const user = await User.findById(userId);
  
  // 2. Monthly progress - group cleanups by month
  const monthlyData = await Cleanup.aggregate([
    { $match: { userId: new ObjectId(userId) } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        items: { $sum: '$itemCount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 6 }
  ]);
  
  // 3. Waste distribution - group by label
  const wasteDistribution = await Cleanup.aggregate([
    { $match: { userId: new ObjectId(userId) } },
    {
      $group: {
        _id: '$classificationResult.label',
        count: { $sum: '$itemCount' }
      }
    }
  ]);
  
  // 4. Recent activity
  const recentActivity = await Cleanup.find({ userId })
    .populate('challengeId', 'title locationName')
    .sort({ createdAt: -1 })
    .limit(5);
  
  // 5. User rank (count users with more items)
  const rank = await User.countDocuments({
    totalItemsCollected: { $gt: user.totalItemsCollected }
  }) + 1;
  
  // 6. Community stats
  const communityStats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalItems: { $sum: '$totalItemsCollected' },
        totalVolunteers: { $sum: 1 }
      }
    }
  ]);
  
  res.json({
    user: {
      totalItemsCollected: user.totalItemsCollected,
      totalCleanups: user.totalCleanups,
      impactScore: user.impactScore,
      rank
    },
    monthlyProgress: monthlyData,
    wasteDistribution,
    recentActivity,
    community: communityStats[0] || {}
  });
};
```

### Phase 3: Challenge Details Live Stats

#### New Endpoint
```javascript
GET /api/challenges/:id/stats
- Returns challenge stats + user's specific contribution
```

#### Implementation
```javascript
export const getChallengeStats = async (req, res) => {
  const { id } = req.params;
  const userId = req.mongoUser._id;
  
  // Get challenge
  const challenge = await Challenge.findById(id);
  
  // Get user's contribution to this challenge
  const userContribution = await Cleanup.aggregate([
    {
      $match: {
        userId: new ObjectId(userId),
        challengeId: new ObjectId(id)
      }
    },
    {
      $group: {
        _id: null,
        totalItems: { $sum: '$itemCount' }
      }
    }
  ]);
  
  res.json({
    challenge,
    userContribution: userContribution[0]?.totalItems || 0
  });
};
```

### Phase 4: "Real-time" Updates (Simple Polling)

Instead of WebSockets, use simple client-side polling:

#### Frontend Implementation
```javascript
// In ChallengeDetailsPage
useEffect(() => {
  const interval = setInterval(() => {
    // Refresh challenge stats every 30 seconds
    fetchChallengeStats();
  }, 30000);
  
  return () => clearInterval(interval);
}, []);

// In DashboardPage
useEffect(() => {
  const interval = setInterval(() => {
    // Refresh dashboard every 60 seconds
    fetchDashboardStats();
  }, 60000);
  
  return () => clearInterval(interval);
}, []);
```

**Alternative (Better UX)**: Add a "Refresh" button instead of auto-polling to save server resources.

### Phase 5: Leaderboard

#### New Endpoint
```javascript
GET /api/leaderboard?limit=10
- Returns top users by totalItemsCollected
```

#### Implementation
```javascript
export const getLeaderboard = async (req, res) => {
  const { limit = 10 } = req.query;
  
  const leaderboard = await User.find()
    .select('name location totalItemsCollected profileImage')
    .sort({ totalItemsCollected: -1 })
    .limit(parseInt(limit));
  
  // Add rank
  const withRank = leaderboard.map((user, index) => ({
    ...user.toObject(),
    rank: index + 1
  }));
  
  res.json(withRank);
};
```

### Phase 6: Achievements/Badges (Simple System)

#### Badge Award Logic
```javascript
// After each cleanup upload/log, check for badges
export const checkAndAwardBadges = async (userId) => {
  const user = await User.findById(userId);
  
  const milestones = [
    { name: 'First Cleanup', threshold: 1, field: 'totalCleanups' },
    { name: 'Century Club', threshold: 100, field: 'totalItemsCollected' },
    { name: 'Plastic Warrior', threshold: 50, field: 'totalItemsCollected', category: 'plastic_bottle' },
  ];
  
  for (const milestone of milestones) {
    // Check if user qualifies and hasn't received badge
    const userBadges = user.badges || [];
    if (!userBadges.includes(milestone.name)) {
      if (user[milestone.field] >= milestone.threshold) {
        // Award badge
        await User.findByIdAndUpdate(userId, {
          $push: { badges: milestone.name }
        });
        
        // Optional: Create notification
        await Notification.create({
          userId,
          message: `🎉 You've unlocked: ${milestone.name}!`,
          type: 'badge'
        });
      }
    }
  }
};
```

---

## 📋 Complete API Endpoint List

### Challenges
- `GET /api/challenges` - List all challenges
- `GET /api/challenges/stats` - Aggregated challenge stats
- `GET /api/challenges/joined` - User's joined challenges ✨ NEW
- `GET /api/challenges/:id` - Single challenge details ✨ NEW
- `GET /api/challenges/:id/stats` - Challenge stats + user contribution ✨ NEW
- `POST /api/challenges/:id/join` - Join a challenge ✨ NEW
- `POST /api/challenges/:id/leave` - Leave a challenge ✨ NEW

### Cleanups
- `POST /api/cleanups/upload` - AI photo upload (existing)
- `POST /api/cleanups/manual` - Manual cleanup log (existing)
- `GET /api/cleanups/history` - User's cleanup history ✨ NEW

### Dashboard
- `GET /api/dashboard/stats` - User dashboard data ✨ NEW

### Profile
- `GET /api/profile` - Get user profile (existing)
- `PATCH /api/profile` - Update profile (existing)

### Leaderboard
- `GET /api/leaderboard` - Top contributors ✨ NEW

### Achievements
- `GET /api/achievements` - User's achievements/badges ✨ NEW

---

## 🔄 Data Flow Example: Upload Cleanup Photo

```
User uploads photo in frontend
    ↓
POST /api/cleanups/upload { challengeId, image }
    ↓
Middleware: verifyFirebaseToken, ensureUserExists
    ↓
Controller: uploadCleanupPhoto()
    ↓
1. Save image to GridFS
2. Classify image with AI
3. Create Cleanup record
4. Update User stats (totalItemsCollected++, totalCleanups++)
5. Update Challenge stats (totalTrashCollected++, wasteBreakdown)
6. Check and award badges (checkAndAwardBadges)
    ↓
Return: { message, result }
    ↓
Frontend: Display success message
Frontend: (Optional) Poll /api/dashboard/stats to refresh dashboard
```

---

## 🚀 Implementation Priority

### Week 1: Core Functionality
1. ✅ Challenge join/leave endpoints
2. ✅ Get joined challenges endpoint
3. ✅ Frontend: Integrate join/leave with backend

### Week 2: Analytics
4. ✅ Dashboard stats endpoint
5. ✅ Challenge stats with user contribution
6. ✅ Frontend: Connect dashboard to real API

### Week 3: Enhanced Features
7. ✅ Leaderboard endpoint
8. ✅ Cleanup history endpoint
9. ✅ Badge awarding logic

### Week 4: Polish & Testing
10. ✅ Add refresh buttons or polling
11. ✅ Test all data flows end-to-end
12. ✅ Error handling & edge cases
13. ✅ Documentation

---

## 📝 Database Indexes for Performance

```javascript
// Users
User.index({ firebaseUid: 1 });
User.index({ totalItemsCollected: -1 }); // For leaderboard

// Challenges
Challenge.index({ status: 1 });
Challenge.index({ location: '2dsphere' }); // For geospatial queries

// Cleanups
Cleanup.index({ userId: 1, createdAt: -1 }); // For user's history
Cleanup.index({ challengeId: 1 }); // For challenge stats
Cleanup.index({ createdAt: -1 }); // For recent activity
```

---

## 🔒 Security Considerations

1. **Authentication**: All protected routes use Firebase token verification
2. **Authorization**: Users can only update their own data
3. **Input Validation**: Validate all inputs (challengeId, itemCount, etc.)
4. **Rate Limiting**: Add rate limiting for upload endpoints (future)
5. **File Size Limits**: Already enforced in multer (10MB max)

---

## 🎨 Frontend Integration Points

### Update JoinedChallengesContext
Instead of local state, fetch from backend:

```javascript
const fetchJoinedChallenges = async () => {
  const res = await apiCall('get', 'http://localhost:5000/api/challenges/joined');
  setJoinedChallenges(res.data);
};

const joinChallenge = async (challengeId) => {
  await apiCall('post', `http://localhost:5000/api/challenges/${challengeId}/join`);
  await fetchJoinedChallenges(); // Re-fetch
};
```

### Update Dashboard to use real data
```javascript
useEffect(() => {
  const fetchDashboardData = async () => {
    const res = await apiCall('get', 'http://localhost:5000/api/dashboard/stats');
    setMonthlyData(res.data.monthlyProgress);
    setWasteData(res.data.wasteDistribution);
    setRecentActivity(res.data.recentActivity);
    // etc.
  };
  fetchDashboardData();
}, []);
```

---

## ✅ Summary

**What to Build:**
1. Challenge participation endpoints (join/leave)
2. Dashboard analytics endpoint
3. Challenge stats with user contribution
4. Leaderboard endpoint
5. Badge awarding logic
6. Frontend integration with all new endpoints

**How to Keep it Simple:**
- Use REST APIs only (no WebSockets)
- Use MongoDB aggregation for analytics
- Use simple polling or manual refresh for "real-time" updates
- Leverage existing middleware and models
- Focus on core MVP features

**Key Benefits:**
- ✅ All data is live and synced with database
- ✅ Clean separation of concerns (routes → controllers → models)
- ✅ Scalable architecture (can add WebSockets later if needed)
- ✅ Easy to test and debug
- ✅ Suitable for capstone/development level

---

## 📚 Next Steps

1. Review this document with the team
2. Prioritize endpoints based on frontend needs
3. Start with Phase 1 (Challenge participation)
4. Test each phase before moving to next
5. Document API responses for frontend team
