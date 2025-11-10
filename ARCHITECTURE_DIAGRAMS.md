# WaveGuard Architecture Diagrams

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                            │
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │
│  │   Dashboard     │  │   Challenges    │  │     Upload      │   │
│  │   (Analytics)   │  │  (Browse/Join)  │  │  (AI/Manual)    │   │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘   │
│           │                    │                     │             │
│           └────────────────────┴─────────────────────┘             │
│                              │                                     │
│                   ┌──────────▼──────────┐                         │
│                   │   Firebase Auth     │                         │
│                   │  (Google Sign-in)   │                         │
│                   └──────────┬──────────┘                         │
└──────────────────────────────┼──────────────────────────────────────┘
                               │ ID Token
                               │
                    ═══════════▼════════════
                    HTTP REST API (Axios)
                    ═══════════▼════════════
                               │
┌──────────────────────────────▼──────────────────────────────────────┐
│                         BACKEND (Node.js/Express)                   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    MIDDLEWARE LAYER                          │  │
│  │                                                              │  │
│  │  ┌───────────────────┐  ┌────────────────┐  ┌─────────────┐│  │
│  │  │ verifyFirebase   │→ │ ensureUser     │→ │   Error     ││  │
│  │  │     Token        │  │   Exists       │  │  Handling   ││  │
│  │  └───────────────────┘  └────────────────┘  └─────────────┘│  │
│  └──────────────────────────────────────────────────────────────┘  │
│                               │                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    ROUTES & CONTROLLERS                      │  │
│  │                                                              │  │
│  │  challengeRoutes ────▶ challengeController                  │  │
│  │  cleanupRoutes ──────▶ cleanupController                    │  │
│  │  dashboardRoutes ────▶ dashboardController (NEW)            │  │
│  │  profileRoutes ──────▶ profileController                    │  │
│  │  leaderboardRoutes ──▶ leaderboardController (NEW)          │  │
│  │  achievementsRoutes ─▶ achievementsController (NEW)         │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                               │                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    BUSINESS LOGIC SERVICES                   │  │
│  │                                                              │  │
│  │  aiService ────────────▶ Classify trash images              │  │
│  │  badgeService ─────────▶ Award achievements                 │  │
│  │  fileService ──────────▶ GridFS image storage               │  │
│  │  updateUserStats() ────▶ Increment user totals              │  │
│  │  updateChallengeStats()▶ Update challenge data              │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                               │                                     │
└───────────────────────────────┼─────────────────────────────────────┘
                                │
                     ═══════════▼════════════
                        MongoDB Connection
                     ═══════════▼════════════
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                       DATABASE (MongoDB Atlas)                      │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │    users     │  │  challenges  │  │   cleanups   │            │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤            │
│  │ firebaseUid  │  │ title        │  │ userId       │            │
│  │ name         │  │ status       │  │ challengeId  │            │
│  │ email        │  │ goal         │  │ itemCount    │            │
│  │ totalItems   │  │ totalTrash   │  │ classification│           │
│  │ joinedChallenges│totalVolunteers│ logType      │            │
│  │ badges[]     │  │ wasteBreakdown│createdAt     │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     GridFS (Image Storage)                   │  │
│  │                                                              │  │
│  │  fs.files ──────────▶ Metadata (filename, contentType)      │  │
│  │  fs.chunks ─────────▶ Binary image chunks                   │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  INDEXES:                                                          │
│  • users: firebaseUid (unique), totalItemsCollected (desc)        │
│  • challenges: status, location (2dsphere)                        │
│  • cleanups: userId + createdAt, challengeId                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Upload Cleanup Photo (AI)

```
┌─────────────┐
│   User      │
│   (Browser) │
└──────┬──────┘
       │ 1. Take/Select Photo
       ▼
┌─────────────────────────────┐
│  Upload Page                │
│  - Select challenge         │
│  - Choose image file        │
│  - Click "Submit & Classify"│
└──────┬──────────────────────┘
       │ 2. POST /api/cleanups/upload
       │    Headers: { Authorization: Bearer <token> }
       │    Body: { challengeId, image }
       ▼
┌────────────────────────────────────────────┐
│  Middleware: verifyFirebaseToken           │
│  - Decode Firebase ID token                │
│  - Verify signature                        │
│  - Extract user info (uid, email)          │
└──────┬─────────────────────────────────────┘
       │ 3. User authenticated
       ▼
┌────────────────────────────────────────────┐
│  Middleware: ensureUserExists              │
│  - Find user in MongoDB by firebaseUid     │
│  - If not found, create new user record    │
│  - Attach req.mongoUser                    │
└──────┬─────────────────────────────────────┘
       │ 4. User exists in MongoDB
       ▼
┌────────────────────────────────────────────┐
│  Controller: uploadCleanupPhoto()          │
│                                            │
│  Step 1: Save image to GridFS             │
│  ┌──────────────────────────────────────┐ │
│  │ const fileId = uploadImageToGridFS() │ │
│  │ - Store image as binary chunks       │ │
│  │ - Return GridFS file ID              │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Step 2: Classify image with AI           │
│  ┌──────────────────────────────────────┐ │
│  │ const result = classifyImage(buffer) │ │
│  │ - Load @xenova/transformers model    │ │
│  │ - Analyze image                      │ │
│  │ - Return { label, confidence }       │ │
│  │   e.g. "plastic_bottle", 0.87        │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Step 3: Create Cleanup record            │
│  ┌──────────────────────────────────────┐ │
│  │ Cleanup.create({                     │ │
│  │   userId,                            │ │
│  │   challengeId,                       │ │
│  │   imageFileId,                       │ │
│  │   classificationResult: result,      │ │
│  │   itemCount: 1,                      │ │
│  │   logType: 'ai',                     │ │
│  │   status: 'completed'                │ │
│  │ })                                   │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Step 4: Update User stats                │
│  ┌──────────────────────────────────────┐ │
│  │ User.findByIdAndUpdate(userId, {     │ │
│  │   $inc: {                            │ │
│  │     totalItemsCollected: 1,          │ │
│  │     totalCleanups: 1                 │ │
│  │   }                                  │ │
│  │ })                                   │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Step 5: Update Challenge stats           │
│  ┌──────────────────────────────────────┐ │
│  │ Challenge.findByIdAndUpdate({        │ │
│  │   $inc: {                            │ │
│  │     totalTrashCollected: 1,          │ │
│  │     'wasteBreakdown.plastic_bottle': 1│ │
│  │   }                                  │ │
│  │ })                                   │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Step 6: Check & award badges (future)    │
│  ┌──────────────────────────────────────┐ │
│  │ checkAndAwardBadges(userId)          │ │
│  │ - Check milestones reached           │ │
│  │ - Award new badges                   │ │
│  │ - Create notifications               │ │
│  └──────────────────────────────────────┘ │
│                                            │
└──────┬─────────────────────────────────────┘
       │ 5. Return response
       ▼
┌────────────────────────────────────────────┐
│  Response: 200 OK                          │
│  {                                         │
│    "message": "Success! AI classified as:  │
│                plastic_bottle",            │
│    "result": {                             │
│      "label": "plastic_bottle",            │
│      "confidence": 0.87                    │
│    }                                       │
│  }                                         │
└──────┬─────────────────────────────────────┘
       │ 6. Display success message
       ▼
┌─────────────────────────────┐
│  Frontend                   │
│  - Show success alert       │
│  - Clear file input         │
│  - (Optional) Redirect to   │
│    dashboard                │
│  - (Optional) Refresh stats │
└─────────────────────────────┘
```

---

## Data Flow: Join a Challenge

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ 1. Click "Join Challenge"
       ▼
┌─────────────────────────────┐
│  Challenge Details Page     │
│  - challengeId: 65c2a...    │
└──────┬──────────────────────┘
       │ 2. POST /api/challenges/:id/join
       │    Headers: { Authorization: Bearer <token> }
       ▼
┌────────────────────────────────────────────┐
│  Middleware: verifyFirebaseToken           │
│  + ensureUserExists                        │
└──────┬─────────────────────────────────────┘
       │ 3. Authenticated
       ▼
┌────────────────────────────────────────────┐
│  Controller: joinChallenge()               │
│                                            │
│  Step 1: Update User                       │
│  ┌──────────────────────────────────────┐ │
│  │ User.findByIdAndUpdate(userId, {     │ │
│  │   $addToSet: {                       │ │
│  │     joinedChallenges: challengeId    │ │
│  │   },                                 │ │
│  │   $inc: { totalChallenges: 1 }       │ │
│  │ })                                   │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Step 2: Update Challenge                  │
│  ┌──────────────────────────────────────┐ │
│  │ Challenge.findByIdAndUpdate({        │ │
│  │   $inc: { totalVolunteers: 1 }       │ │
│  │ })                                   │ │
│  └──────────────────────────────────────┘ │
│                                            │
└──────┬─────────────────────────────────────┘
       │ 4. Return updated challenge
       ▼
┌────────────────────────────────────────────┐
│  Response: 200 OK                          │
│  {                                         │
│    "message": "Joined successfully",       │
│    "challenge": { ...updated challenge }   │
│  }                                         │
└──────┬─────────────────────────────────────┘
       │ 5. Update UI
       ▼
┌─────────────────────────────┐
│  Frontend                   │
│  - Update joinedChallenges  │
│    context                  │
│  - Show "Joined" button     │
│  - Display success message  │
└─────────────────────────────┘
```

---

## Data Flow: Dashboard Stats

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ 1. Navigate to Dashboard
       ▼
┌─────────────────────────────┐
│  Dashboard Page             │
│  useEffect() on mount       │
└──────┬──────────────────────┘
       │ 2. GET /api/dashboard/stats
       │    Headers: { Authorization: Bearer <token> }
       ▼
┌────────────────────────────────────────────┐
│  Middleware: verifyFirebaseToken           │
│  + ensureUserExists                        │
└──────┬─────────────────────────────────────┘
       │ 3. Authenticated
       ▼
┌────────────────────────────────────────────┐
│  Controller: getDashboardStats()           │
│                                            │
│  Step 1: Get User Basic Stats              │
│  ┌──────────────────────────────────────┐ │
│  │ User.findById(userId)                │ │
│  │ → totalItemsCollected: 427           │ │
│  │ → totalCleanups: 12                  │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Step 2: Monthly Progress (Aggregation)    │
│  ┌──────────────────────────────────────┐ │
│  │ Cleanup.aggregate([                  │ │
│  │   { $match: { userId } },            │ │
│  │   { $group: {                        │ │
│  │       _id: { year, month },          │ │
│  │       items: { $sum: '$itemCount' }  │ │
│  │   }},                                │ │
│  │   { $sort: { _id: 1 } },             │ │
│  │   { $limit: 6 }                      │ │
│  │ ])                                   │ │
│  │ → [                                  │ │
│  │     { month: 'Jun', items: 50 },     │ │
│  │     { month: 'Jul', items: 65 },     │ │
│  │     ...                              │ │
│  │   ]                                  │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Step 3: Waste Distribution                │
│  ┌──────────────────────────────────────┐ │
│  │ Cleanup.aggregate([                  │ │
│  │   { $match: { userId } },            │ │
│  │   { $group: {                        │ │
│  │       _id: '$classificationResult.label',│
│  │       count: { $sum: '$itemCount' }  │ │
│  │   }}                                 │ │
│  │ ])                                   │ │
│  │ → [                                  │ │
│  │     { label: 'plastic_bottle', count: 150 },│
│  │     { label: 'metal_can', count: 85 },│ │
│  │     ...                              │ │
│  │   ]                                  │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Step 4: Recent Activity                   │
│  ┌──────────────────────────────────────┐ │
│  │ Cleanup.find({ userId })             │ │
│  │   .populate('challengeId')           │ │
│  │   .sort({ createdAt: -1 })           │ │
│  │   .limit(5)                          │ │
│  │ → Last 5 cleanups with challenge info│ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Step 5: User Rank                         │
│  ┌──────────────────────────────────────┐ │
│  │ User.countDocuments({                │ │
│  │   totalItemsCollected: { $gt: 427 }  │ │
│  │ }) + 1                               │ │
│  │ → rank: 47                           │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Step 6: Community Stats                   │
│  ┌──────────────────────────────────────┐ │
│  │ User.aggregate([                     │ │
│  │   { $group: {                        │ │
│  │       totalItems: { $sum: '$totalItemsCollected' },│
│  │       totalVolunteers: { $sum: 1 }   │ │
│  │   }}                                 │ │
│  │ ])                                   │ │
│  │ → { totalItems: 12547, totalVolunteers: 2891 }│
│  └──────────────────────────────────────┘ │
│                                            │
└──────┬─────────────────────────────────────┘
       │ 7. Combine all data
       ▼
┌────────────────────────────────────────────┐
│  Response: 200 OK                          │
│  {                                         │
│    "user": { totalItems: 427, rank: 47 }, │
│    "monthlyProgress": [...],               │
│    "wasteDistribution": [...],             │
│    "recentActivity": [...],                │
│    "community": { totalItems: 12547, ... } │
│  }                                         │
└──────┬─────────────────────────────────────┘
       │ 8. Render charts
       ▼
┌─────────────────────────────┐
│  Frontend                   │
│  - Update all chart data    │
│  - Display stats cards      │
│  - Show recent activity     │
│  - Display community impact │
└─────────────────────────────┘
```

---

## Authentication Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ 1. Click "Sign in with Google"
       ▼
┌─────────────────────────────┐
│  Login Page                 │
│  signInWithPopup()          │
└──────┬──────────────────────┘
       │ 2. Firebase Auth SDK
       ▼
┌────────────────────────────────────────────┐
│  Firebase Authentication                   │
│  - Google OAuth flow                       │
│  - User selects Google account             │
│  - Google authorizes                       │
└──────┬─────────────────────────────────────┘
       │ 3. Firebase returns User object
       ▼
┌────────────────────────────────────────────┐
│  Frontend: AuthContext                     │
│  - onAuthStateChanged() triggered          │
│  - setUser(currentUser)                    │
│  - Get ID token: user.getIdToken(true)     │
└──────┬─────────────────────────────────────┘
       │ 4. Store user in context
       │    Token stored in Firebase SDK
       ▼
┌─────────────────────────────┐
│  Every API Request          │
│  - Get fresh token          │
│  - Add to headers           │
│  - Send to backend          │
└──────┬──────────────────────┘
       │ 5. Authorization: Bearer <token>
       ▼
┌────────────────────────────────────────────┐
│  Backend: verifyFirebaseToken middleware   │
│                                            │
│  Step 1: Extract token from header         │
│  ┌──────────────────────────────────────┐ │
│  │ const token = req.headers            │ │
│  │   .authorization.split(' ')[1]       │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Step 2: Verify with Firebase Admin        │
│  ┌──────────────────────────────────────┐ │
│  │ admin.auth()                         │ │
│  │   .verifyIdToken(token)              │ │
│  │   → decodedToken                     │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Step 3: Attach user info to request       │
│  ┌──────────────────────────────────────┐ │
│  │ req.user = {                         │ │
│  │   uid: decodedToken.uid,             │ │
│  │   email: decodedToken.email,         │ │
│  │   name: decodedToken.name            │ │
│  │ }                                    │ │
│  └──────────────────────────────────────┘ │
│                                            │
└──────┬─────────────────────────────────────┘
       │ 6. User verified
       ▼
┌────────────────────────────────────────────┐
│  Backend: ensureUserExists middleware      │
│                                            │
│  Step 1: Find user in MongoDB              │
│  ┌──────────────────────────────────────┐ │
│  │ User.findOne({                       │ │
│  │   firebaseUid: req.user.uid          │ │
│  │ })                                   │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Step 2: Create if not exists              │
│  ┌──────────────────────────────────────┐ │
│  │ if (!user) {                         │ │
│  │   user = User.create({               │ │
│  │     firebaseUid: req.user.uid,       │ │
│  │     email: req.user.email,           │ │
│  │     name: req.user.name              │ │
│  │   })                                 │ │
│  │ }                                    │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Step 3: Attach to request                 │
│  ┌──────────────────────────────────────┐ │
│  │ req.mongoUser = user                 │ │
│  └──────────────────────────────────────┘ │
│                                            │
└──────┬─────────────────────────────────────┘
       │ 7. User ready for controllers
       ▼
┌────────────────────────────────────────────┐
│  Controller Function                       │
│  - Access req.user (Firebase data)         │
│  - Access req.mongoUser (MongoDB record)   │
│  - Process request                         │
│  - Return response                         │
└────────────────────────────────────────────┘
```

---

## Database Relationships

```
┌─────────────────────────┐
│        User             │
│─────────────────────────│
│ _id: ObjectId           │
│ firebaseUid: String     │◄────────────┐
│ name: String            │             │
│ email: String           │             │
│ joinedChallenges: [     │             │
│   ObjectId ──────┐      │             │
│ ]                │      │             │
│ badges: [String] │      │             │
└──────────────────┼──────┘             │
                   │                    │
                   │ References         │
                   │                    │
                   ▼                    │
┌──────────────────────────┐            │
│      Challenge           │            │
│──────────────────────────│            │
│ _id: ObjectId            │◄───────┐   │
│ title: String            │        │   │
│ status: String           │        │   │
│ goal: Number             │        │   │
│ totalTrashCollected: Number│      │   │
│ totalVolunteers: Number  │        │   │
│ wasteBreakdown: {        │        │   │
│   plastic_bottle: Number │        │   │
│   metal_can: Number      │        │   │
│   ...                    │        │   │
│ }                        │        │   │
└──────────────────────────┘        │   │
                                    │   │
                                    │   │
                                    │   │
┌─────────────────────────────┐    │   │
│        Cleanup              │    │   │
│─────────────────────────────│    │   │
│ _id: ObjectId               │    │   │
│ userId: ObjectId ───────────┼────┘   │
│ challengeId: ObjectId ──────┼────────┘
│ imageFileId: ObjectId ──────┼──────┐
│ classificationResult: {     │      │
│   label: String             │      │
│   confidence: Number        │      │
│ }                           │      │
│ itemCount: Number           │      │
│ logType: 'ai' | 'manual'    │      │
│ status: String              │      │
│ createdAt: Date             │      │
└─────────────────────────────┘      │
                                     │
                                     │ References
                                     ▼
                          ┌──────────────────┐
                          │ GridFS (Images)  │
                          │──────────────────│
                          │ fs.files         │
                          │ fs.chunks        │
                          └──────────────────┘
```

---

## Scalability Considerations (Future)

```
Current (MVP):
┌────────────┐
│  Frontend  │
└─────┬──────┘
      │ REST
      ▼
┌────────────┐     ┌──────────┐
│  Backend   │────▶│ MongoDB  │
└────────────┘     └──────────┘

Future (Scale):
┌────────────┐
│  Frontend  │
└─────┬──────┘
      │ REST
      ▼
┌─────────────────┐
│ Load Balancer   │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│Backend │ │Backend │
│Node 1  │ │Node 2  │
└───┬────┘ └───┬────┘
    │          │
    └────┬─────┘
         ▼
   ┌──────────────┐
   │ Redis Cache  │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │MongoDB Cluster│
   │ (Replica Set) │
   └───────────────┘
```

---

**Last Updated:** November 10, 2025  
**Version:** 1.0
