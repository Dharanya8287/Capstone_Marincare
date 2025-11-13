# WaveGuard API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

---

## 📌 Existing Endpoints

### Challenges

#### `GET /challenges`
Get all challenges

**Response:**
```json
[
  {
    "_id": "65c2a123456789012345678a",
    "title": "Toronto Waterfront Cleanup",
    "description": "Join us to protect...",
    "bannerImage": "/images/challenge1.jpg",
    "startDate": "2025-10-15T00:00:00.000Z",
    "endDate": "2025-10-22T00:00:00.000Z",
    "status": "active",
    "locationName": "Toronto, ON",
    "province": "ON",
    "location": {
      "type": "Point",
      "coordinates": [-79.3832, 43.6532]
    },
    "goal": 5000,
    "goalUnit": "items",
    "totalTrashCollected": 3421,
    "totalVolunteers": 234,
    "wasteBreakdown": {
      "plastic_bottle": 150,
      "metal_can": 85,
      "plastic_bag": 120,
      "paper_cardboard": 60,
      "cigarette_butt": 45,
      "glass_bottle": 30
    },
    "createdAt": "2025-09-01T00:00:00.000Z",
    "updatedAt": "2025-10-10T12:30:00.000Z"
  }
]
```

#### `GET /challenges/stats`
Get aggregated challenge statistics

**Response:**
```json
{
  "totalChallenges": 15,
  "activeVolunteers": 1501,
  "itemsCollected": 22861,
  "provinces": 10
}
```

---

### Cleanups

#### `POST /cleanups/upload`
Upload a cleanup photo for AI classification (requires location verification)

**Authentication:** Required

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `image`: File (max 10MB)
  - `challengeId`: String (MongoDB ObjectId)
  - `latitude`: Number (user's current latitude)
  - `longitude`: Number (user's current longitude)

**Example:**
```javascript
const formData = new FormData();
formData.append('image', file);
formData.append('challengeId', '65c2a123456789012345678a');
formData.append('latitude', '43.6532');
formData.append('longitude', '-79.3832');

await apiCall('post', 'http://localhost:5000/api/cleanups/upload', formData, true);
```

**Response (Success):**
```json
{
  "message": "Success! AI classified as: plastic_bottle",
  "result": {
    "label": "plastic_bottle",
    "confidence": 0.87
  }
}
```

**Response (Location Too Far):**
```json
{
  "message": "You are too far from the challenge location (8.5 km away, maximum allowed is 5 km)",
  "distance": 8.5,
  "maxDistance": 5,
  "error": "LOCATION_TOO_FAR"
}
```

**Response (AI Unavailable):**
```json
{
  "message": "AI classification is currently unavailable. Please use manual entry or try again later.",
  "error": "AI_UNAVAILABLE"
}
```

**Side Effects:**
- Creates a Cleanup record in database
- Updates User.totalItemsCollected and User.totalCleanups
- Updates Challenge.totalTrashCollected and Challenge.wasteBreakdown

---

#### `POST /cleanups/manual`
Manually log a cleanup (requires location verification)

**Authentication:** Required

**Request Body:**
```json
{
  "challengeId": "65c2a123456789012345678a",
  "label": "plastic_bottle",
  "itemCount": 10,
  "latitude": 43.6532,
  "longitude": -79.3832
}
```

**Valid Labels:**
- `plastic_bottle`
- `metal_can`
- `plastic_bag`
- `paper_cardboard`
- `cigarette_butt`
- `glass_bottle`
- `unknown`

**Response (Success):**
```json
{
  "message": "Successfully logged 10 item(s) as plastic_bottle."
}
```

**Response (Location Too Far):**
```json
{
  "message": "You are too far from the challenge location (8.5 km away, maximum allowed is 5 km)",
  "distance": 8.5,
  "maxDistance": 5,
  "error": "LOCATION_TOO_FAR"
}
```

**Side Effects:**
- Same as upload endpoint (updates user and challenge stats)

**Notes:**
- Location verification can be bypassed for testing using environment variables
- See `LOCATION_FEATURE_ANALYSIS.md` for testing configuration

---

### Profile

#### `GET /profile`
Get current user's profile

**Authentication:** Required

**Response:**
```json
{
  "_id": "65c2a987654321098765432a",
  "firebaseUid": "firebase-uid-123",
  "name": "John Doe",
  "email": "john@example.com",
  "profileImage": "https://example.com/photo.jpg",
  "location": "Toronto, ON",
  "bio": "Passionate about ocean conservation",
  "totalItemsCollected": 427,
  "totalCleanups": 12,
  "totalChallenges": 3,
  "impactScore": 8900,
  "joinedChallenges": [
    "65c2a123456789012345678a",
    "65c2a123456789012345678b"
  ],
  "badges": ["First Cleanup", "Century Club"],
  "createdAt": "2025-09-01T00:00:00.000Z",
  "updatedAt": "2025-10-10T12:30:00.000Z"
}
```

---

#### `PATCH /profile`
Update current user's profile

**Authentication:** Required

**Request Body:**
```json
{
  "name": "John Doe",
  "location": "Toronto, ON",
  "bio": "Updated bio",
  "profileImage": "https://example.com/new-photo.jpg"
}
```

**Response:**
```json
{
  "_id": "65c2a987654321098765432a",
  "name": "John Doe",
  "location": "Toronto, ON",
  "bio": "Updated bio",
  // ... rest of user data
}
```

---

## 🆕 Proposed New Endpoints

### Challenge Participation

#### `POST /challenges/:id/join`
Join a challenge

**Authentication:** Required

**Response:**
```json
{
  "message": "Joined successfully",
  "challenge": {
    "_id": "65c2a123456789012345678a",
    "title": "Toronto Waterfront Cleanup",
    "totalVolunteers": 235,
    // ... rest of challenge data
  }
}
```

**Side Effects:**
- Adds challengeId to User.joinedChallenges[]
- Increments User.totalChallenges by 1
- Increments Challenge.totalVolunteers by 1

---

#### `POST /challenges/:id/leave`
Leave a challenge

**Authentication:** Required

**Response:**
```json
{
  "message": "Left successfully",
  "challenge": {
    "_id": "65c2a123456789012345678a",
    "totalVolunteers": 234,
    // ... rest of challenge data
  }
}
```

**Side Effects:**
- Removes challengeId from User.joinedChallenges[]
- Decrements User.totalChallenges by 1
- Decrements Challenge.totalVolunteers by 1

---

#### `GET /challenges/joined`
Get all challenges the user has joined

**Authentication:** Required

**Query Parameters:**
- `status` (optional): Filter by status (`active`, `upcoming`, `completed`)

**Examples:**
- `/api/challenges/joined` - All joined challenges
- `/api/challenges/joined?status=active` - Only active challenges

**Response:**
```json
[
  {
    "_id": "65c2a123456789012345678a",
    "title": "Toronto Waterfront Cleanup",
    "status": "active",
    // ... rest of challenge data
  }
]
```

---

#### `GET /challenges/:id`
Get single challenge details

**Response:**
```json
{
  "_id": "65c2a123456789012345678a",
  "title": "Toronto Waterfront Cleanup",
  "description": "...",
  "status": "active",
  "totalTrashCollected": 3421,
  "totalVolunteers": 234,
  // ... full challenge data
}
```

---

#### `GET /challenges/:id/stats`
Get challenge stats including user's contribution

**Authentication:** Required

**Response:**
```json
{
  "challenge": {
    "_id": "65c2a123456789012345678a",
    "title": "Toronto Waterfront Cleanup",
    "totalTrashCollected": 3421,
    "totalVolunteers": 234,
    "goal": 5000,
    "wasteBreakdown": {
      "plastic_bottle": 150,
      "metal_can": 85,
      // ...
    }
  },
  "userContribution": 245,
  "userPercentage": 7.16
}
```

---

### Dashboard Analytics

#### `GET /dashboard/stats`
Get user's dashboard analytics

**Authentication:** Required

**Response:**
```json
{
  "user": {
    "totalItemsCollected": 427,
    "totalCleanups": 12,
    "impactScore": 8900,
    "rank": 47
  },
  "monthlyProgress": [
    { "month": "Jun", "year": 2025, "items": 50 },
    { "month": "Jul", "year": 2025, "items": 65 },
    { "month": "Aug", "year": 2025, "items": 75 },
    { "month": "Sep", "year": 2025, "items": 85 },
    { "month": "Oct", "year": 2025, "items": 110 }
  ],
  "wasteDistribution": [
    { "label": "plastic_bottle", "count": 150 },
    { "label": "metal_can", "count": 85 },
    { "label": "plastic_bag", "count": 120 },
    { "label": "paper_cardboard", "count": 60 },
    { "label": "cigarette_butt", "count": 45 },
    { "label": "glass_bottle", "count": 30 }
  ],
  "recentActivity": [
    {
      "challengeId": "65c2a123456789012345678a",
      "challengeTitle": "Toronto Waterfront Cleanup",
      "location": "Toronto, ON",
      "itemCount": 34,
      "date": "2025-10-08T00:00:00.000Z"
    }
  ],
  "community": {
    "totalItems": 12547,
    "totalVolunteers": 2891
  }
}
```

**Notes:**
- `monthlyProgress`: Last 6 months of cleanup activity
- `wasteDistribution`: Breakdown by trash category
- `recentActivity`: Last 5 cleanup activities
- `rank`: User's position in the leaderboard

---

### Cleanup History

#### `GET /cleanups/history`
Get user's cleanup history

**Authentication:** Required

**Query Parameters:**
- `challengeId` (optional): Filter by challenge
- `limit` (optional): Number of results (default: 20)
- `page` (optional): Page number for pagination (default: 1)

**Examples:**
- `/api/cleanups/history?limit=10`
- `/api/cleanups/history?challengeId=65c2a123456789012345678a`

**Response:**
```json
{
  "cleanups": [
    {
      "_id": "65c2a789012345678901234a",
      "challengeId": {
        "_id": "65c2a123456789012345678a",
        "title": "Toronto Waterfront Cleanup",
        "locationName": "Toronto, ON"
      },
      "itemCount": 10,
      "classificationResult": {
        "label": "plastic_bottle",
        "confidence": 0.87
      },
      "logType": "ai",
      "status": "completed",
      "createdAt": "2025-10-08T14:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

---

### Leaderboard

#### `GET /leaderboard`
Get top contributors

**Query Parameters:**
- `limit` (optional): Number of results (default: 10, max: 100)

**Examples:**
- `/api/leaderboard`
- `/api/leaderboard?limit=50`

**Response:**
```json
[
  {
    "_id": "65c2a987654321098765432a",
    "name": "Sarah Chen",
    "location": "Vancouver, BC",
    "profileImage": "https://example.com/photo.jpg",
    "totalItemsCollected": 482,
    "rank": 1
  },
  {
    "_id": "65c2a987654321098765432b",
    "name": "Michael Torres",
    "location": "Toronto, ON",
    "profileImage": "https://example.com/photo2.jpg",
    "totalItemsCollected": 427,
    "rank": 2
  }
]
```

---

### Achievements

#### `GET /achievements`
Get user's achievements and badges

**Authentication:** Required

**Response:**
```json
{
  "badges": [
    {
      "name": "First Cleanup",
      "description": "Completed your first cleanup",
      "icon": "🎉",
      "rarity": "Common",
      "earnedAt": "2025-09-05T12:00:00.000Z"
    },
    {
      "name": "Century Club",
      "description": "Collected 100 items",
      "icon": "💯",
      "rarity": "Uncommon",
      "earnedAt": "2025-09-28T14:30:00.000Z"
    },
    {
      "name": "Plastic Warrior",
      "description": "Collected 50 plastic bottles",
      "icon": "🥤",
      "rarity": "Rare",
      "earnedAt": "2025-10-04T10:15:00.000Z"
    }
  ],
  "progress": {
    "nextBadge": "500 Club",
    "currentCount": 427,
    "requiredCount": 500,
    "percentage": 85.4
  }
}
```

---

## 🔧 Error Responses

All endpoints follow a consistent error format:

### 400 Bad Request
```json
{
  "message": "Invalid challenge ID."
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided" 
}
```

### 404 Not Found
```json
{
  "message": "Challenge not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error during cleanup upload."
}
```

---

## 📝 Frontend Integration Examples

### Using apiCall utility

```javascript
import { apiCall } from '@/utils/api';

// Get all challenges
const challenges = await apiCall('get', 'http://localhost:5000/api/challenges');

// Join a challenge
await apiCall('post', `http://localhost:5000/api/challenges/${challengeId}/join`);

// Upload cleanup photo
const formData = new FormData();
formData.append('image', file);
formData.append('challengeId', challengeId);
await apiCall('post', 'http://localhost:5000/api/cleanups/upload', formData, true);

// Get dashboard stats
const stats = await apiCall('get', 'http://localhost:5000/api/dashboard/stats');

// Manual cleanup log
const data = { challengeId, label: 'plastic_bottle', itemCount: 10 };
await apiCall('post', 'http://localhost:5000/api/cleanups/manual', data);

// Get leaderboard
const leaderboard = await apiCall('get', 'http://localhost:5000/api/leaderboard?limit=20');
```

---

## 🧪 Testing with cURL

### Get challenges (public)
```bash
curl http://localhost:5000/api/challenges
```

### Join a challenge (authenticated)
```bash
curl -X POST http://localhost:5000/api/challenges/65c2a123456789012345678a/join \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

### Upload cleanup photo (authenticated)
```bash
curl -X POST http://localhost:5000/api/cleanups/upload \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -F "image=@/path/to/photo.jpg" \
  -F "challengeId=65c2a123456789012345678a"
```

### Get dashboard stats (authenticated)
```bash
curl http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

---

## 🔄 Real-time Updates Strategy

Since we're not using WebSockets for simplicity, here are recommended strategies:

### Option 1: Manual Refresh Button
Add a refresh button on pages that need live data:
```javascript
const handleRefresh = async () => {
  setLoading(true);
  await fetchDashboardStats();
  await fetchChallengeStats();
  setLoading(false);
};
```

### Option 2: Simple Polling (30-60 seconds)
```javascript
useEffect(() => {
  const interval = setInterval(() => {
    fetchChallengeStats();
  }, 30000); // Every 30 seconds
  
  return () => clearInterval(interval);
}, []);
```

### Option 3: Refresh on Action
After user uploads a cleanup, automatically refresh:
```javascript
const handleUpload = async () => {
  await apiCall('post', '/api/cleanups/upload', formData);
  // Immediately refresh stats
  await fetchDashboardStats();
  await fetchChallengeStats();
};
```

**Recommended:** Combine Option 1 (manual refresh button) with Option 3 (refresh on action).

---

## 📊 Data Models Reference

### User
```javascript
{
  firebaseUid: String (unique, required),
  name: String,
  email: String (unique, required),
  profileImage: String,
  location: String,
  bio: String,
  totalItemsCollected: Number (default: 0),
  totalCleanups: Number (default: 0),
  totalChallenges: Number (default: 0),
  impactScore: Number (default: 0),
  joinedChallenges: [ObjectId] (ref: Challenge),
  badges: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Challenge
```javascript
{
  title: String (required),
  description: String,
  bannerImage: String,
  startDate: Date,
  endDate: Date,
  status: String (enum: ['active', 'completed', 'upcoming']),
  locationName: String (required),
  province: String (required),
  location: {
    type: String (enum: ['Point']),
    coordinates: [Number] // [longitude, latitude]
  },
  goal: Number,
  goalUnit: String (default: 'items'),
  totalTrashCollected: Number (default: 0),
  totalVolunteers: Number (default: 0),
  wasteBreakdown: {
    plastic_bottle: Number,
    metal_can: Number,
    plastic_bag: Number,
    paper_cardboard: Number,
    cigarette_butt: Number,
    glass_bottle: Number
  },
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Cleanup
```javascript
{
  userId: ObjectId (ref: User, required),
  challengeId: ObjectId (ref: Challenge, required),
  imageFileId: ObjectId (GridFS file ID),
  logType: String (enum: ['ai', 'manual'], default: 'ai'),
  status: String (enum: ['processing', 'completed', 'failed']),
  classificationResult: {
    label: String (enum: trash categories),
    confidence: Number
  },
  itemCount: Number (default: 1),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Next Steps for Implementation

1. **Backend Team:**
   - Implement new endpoints in order of priority
   - Add database indexes for performance
   - Write tests for each endpoint
   - Document any changes to data models

2. **Frontend Team:**
   - Update JoinedChallengesContext to use backend API
   - Connect dashboard to /api/dashboard/stats
   - Add leaderboard page using /api/leaderboard
   - Implement refresh mechanism (button or polling)

3. **Testing:**
   - End-to-end testing of full data flow
   - Test with multiple users simultaneously
   - Verify real-time updates work as expected

---

## 📞 Support

For questions or issues, contact:
- Backend Lead: Mohamed Ijas
- Frontend Lead: Dinesh Babu Ilamaran

---

**Last Updated:** November 10, 2025  
**Version:** 1.0
