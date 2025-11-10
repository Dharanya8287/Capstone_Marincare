# WaveGuard Backend Implementation Checklist

## 📋 Summary of Analysis

### Current State
- ✅ **Frontend**: Complete UI for all pages (Dashboard, Challenges, Upload, Profile, Achievements)
- ✅ **Backend**: Partial implementation with models, basic controllers, Firebase auth
- ⚠️ **Gap**: No real-time data syncing, challenge participation not tracked in backend, dashboard uses mock data

### What This Document Provides
1. **Comprehensive architecture analysis** → See `BACKEND_ARCHITECTURE.md`
2. **Complete API documentation** → See `API_DOCUMENTATION.md`
3. **Implementation checklist** → This document
4. **Clean, simple approach** suitable for capstone/development level

---

## 🎯 Implementation Approach

### Design Philosophy
- **Simple REST APIs** instead of complex WebSockets
- **MongoDB aggregation** for analytics instead of separate analytics service
- **Immediate stats updates** after each action
- **Client-side polling or manual refresh** for "real-time" updates
- **Leverage existing infrastructure** (Firebase Auth, MongoDB, GridFS)

### Architecture Pattern
```
Frontend (React/Next.js)
    ↓ HTTP REST with Firebase Token
Middleware (Auth + User Creation)
    ↓
Controllers (Business Logic)
    ↓
Models (MongoDB)
```

---

## ✅ Implementation Checklist

### Phase 1: Challenge Participation (Week 1)

#### Backend Tasks
- [ ] **Create endpoint: `POST /api/challenges/:id/join`**
  - File: `backend/src/controllers/challengeController.js`
  - Add challengeId to user.joinedChallenges[]
  - Increment user.totalChallenges
  - Increment challenge.totalVolunteers
  - Return updated challenge

- [ ] **Create endpoint: `POST /api/challenges/:id/leave`**
  - File: `backend/src/controllers/challengeController.js`
  - Remove challengeId from user.joinedChallenges[]
  - Decrement user.totalChallenges
  - Decrement challenge.totalVolunteers
  - Return updated challenge

- [ ] **Create endpoint: `GET /api/challenges/joined`**
  - File: `backend/src/controllers/challengeController.js`
  - Return user's joined challenges
  - Support status filter (active, upcoming, completed)

- [ ] **Create endpoint: `GET /api/challenges/:id`**
  - File: `backend/src/controllers/challengeController.js`
  - Return single challenge details

- [ ] **Update routes**
  - File: `backend/src/routes/challengeRoutes.js`
  - Add new routes with authentication middleware

#### Frontend Tasks
- [ ] **Update JoinedChallengesContext**
  - File: `frontend/src/context/JoinedChallengesContext.jsx`
  - Replace local state with API calls
  - Fetch joined challenges from backend on mount
  - Call join/leave endpoints

- [ ] **Update Challenges Page**
  - File: `frontend/src/app/(protected)/challenges/page.jsx`
  - Fetch challenges from backend
  - Update filters to work with backend data

- [ ] **Update Challenge Details Page**
  - File: `frontend/src/app/(protected)/challenges/[id]/page.jsx`
  - Use backend join/leave endpoints
  - Refresh challenge data after join/leave

#### Testing
- [ ] Test join challenge flow end-to-end
- [ ] Test leave challenge flow
- [ ] Verify user.joinedChallenges[] updates correctly
- [ ] Verify challenge.totalVolunteers updates correctly
- [ ] Test with multiple users simultaneously

---

### Phase 2: Dashboard Analytics (Week 2)

#### Backend Tasks
- [ ] **Create endpoint: `GET /api/dashboard/stats`**
  - File: `backend/src/controllers/dashboardController.js` (create new)
  - Aggregate user's monthly progress (last 6 months)
  - Aggregate waste distribution by category
  - Get recent cleanup activity (last 5)
  - Calculate user's rank
  - Get community stats (total items, total volunteers)
  - Return comprehensive dashboard data

- [ ] **Create endpoint: `GET /api/challenges/:id/stats`**
  - File: `backend/src/controllers/challengeController.js`
  - Return challenge stats
  - Calculate user's contribution to this challenge
  - Return percentage of user's contribution

- [ ] **Update routes**
  - File: `backend/src/routes/dashboardRoutes.js` (create new)
  - Add dashboard routes with authentication

- [ ] **Register new routes in server.js**
  - File: `backend/src/server.js`
  - Add: `app.use('/api/dashboard', dashboardRoutes);`

#### Frontend Tasks
- [ ] **Update Dashboard Page**
  - File: `frontend/src/app/(protected)/dashboard/page.jsx`
  - Replace mock data with API call to `/api/dashboard/stats`
  - Map API response to chart components
  - Add refresh button or auto-refresh every 60 seconds

- [ ] **Update Challenge Details Page**
  - File: `frontend/src/app/(protected)/challenges/[id]/page.jsx`
  - Fetch user's contribution from `/api/challenges/:id/stats`
  - Update progress bars with real data
  - Update trash categories breakdown with real data

#### Testing
- [ ] Verify dashboard shows real user data
- [ ] Test monthly progress chart with different date ranges
- [ ] Test waste distribution with different user data
- [ ] Verify recent activity shows correct cleanups
- [ ] Test user rank calculation
- [ ] Test challenge stats with user contribution

---

### Phase 3: Enhanced Features (Week 3)

#### Backend Tasks
- [ ] **Create endpoint: `GET /api/leaderboard`**
  - File: `backend/src/controllers/leaderboardController.js` (create new)
  - Query top users by totalItemsCollected
  - Support limit parameter (default 10, max 100)
  - Add rank to each user
  - Return user list

- [ ] **Create endpoint: `GET /api/cleanups/history`**
  - File: `backend/src/controllers/cleanupController.js`
  - Return user's cleanup history
  - Support pagination (page, limit)
  - Support challenge filter
  - Populate challenge details

- [ ] **Create badge awarding logic**
  - File: `backend/src/services/badgeService.js` (create new)
  - Define milestones (First Cleanup, Century Club, etc.)
  - Check and award badges after each cleanup
  - Create notification when badge is awarded

- [ ] **Integrate badge logic into cleanup controller**
  - File: `backend/src/controllers/cleanupController.js`
  - Call `checkAndAwardBadges(userId)` after upload/manual log
  - Update both AI and manual endpoints

- [ ] **Create endpoint: `GET /api/achievements`**
  - File: `backend/src/controllers/achievementsController.js`
  - Return user's badges
  - Calculate progress to next badge
  - Return badge details (name, description, rarity, earned date)

- [ ] **Update routes**
  - Add leaderboard routes
  - Add achievements routes
  - Update cleanup routes

#### Frontend Tasks
- [ ] **Create/Update Leaderboard component**
  - File: `frontend/src/components/sections/LeaderboardSection.jsx` (or on Dashboard)
  - Fetch from `/api/leaderboard`
  - Display top contributors
  - Highlight current user if in top 10

- [ ] **Update Profile Page - Achievements Tab**
  - File: `frontend/src/app/(protected)/profile/page.jsx`
  - Replace mock achievements with `/api/achievements`
  - Display earned badges
  - Show progress to next badge

- [ ] **Add Cleanup History to Profile**
  - File: `frontend/src/app/(protected)/profile/page.jsx`
  - Fetch from `/api/cleanups/history`
  - Add pagination controls
  - Display cleanup details with challenge info

#### Testing
- [ ] Test leaderboard ranking accuracy
- [ ] Test badge awarding after cleanup
- [ ] Verify badge notifications appear
- [ ] Test cleanup history pagination
- [ ] Test achievements display

---

### Phase 4: Real-time Updates (Week 4)

#### Backend Tasks
- [ ] **Add database indexes for performance**
  - File: Various model files
  - Add indexes: User(totalItemsCollected), Cleanup(userId, createdAt)
  - Add compound indexes where needed

- [ ] **Optimize aggregation queries**
  - Add pagination to expensive queries
  - Add caching if needed (optional)

#### Frontend Tasks
- [ ] **Add refresh button to Dashboard**
  - File: `frontend/src/app/(protected)/dashboard/page.jsx`
  - Add floating action button for manual refresh
  - Show loading state during refresh

- [ ] **Add refresh button to Challenge Details**
  - File: `frontend/src/app/(protected)/challenges/[id]/page.jsx`
  - Refresh challenge stats and user contribution

- [ ] **Implement auto-refresh on Upload success**
  - File: `frontend/src/app/(protected)/upload/page.jsx`
  - After successful upload, trigger dashboard refresh
  - Optional: Redirect to dashboard with success message

- [ ] **Add polling for active pages (optional)**
  - Use `setInterval` to refresh data every 30-60 seconds
  - Clear interval on component unmount
  - Only enable on active challenges/dashboard

#### Testing
- [ ] Test refresh functionality
- [ ] Verify data updates after cleanup upload
- [ ] Test with multiple browser tabs
- [ ] Performance test with large datasets

---

### Phase 5: Polish & Testing (Week 4)

#### Backend Tasks
- [ ] **Add input validation**
  - Validate ObjectIds
  - Validate itemCount > 0
  - Validate labels match enum

- [ ] **Improve error messages**
  - Consistent error format
  - Helpful error messages for users

- [ ] **Add request logging**
  - Log all API requests for debugging
  - Optional: Add middleware for logging

#### Frontend Tasks
- [ ] **Add error handling**
  - Display user-friendly error messages
  - Add retry logic for failed requests
  - Handle network errors gracefully

- [ ] **Add loading states**
  - Show spinners during data fetch
  - Skeleton loaders for better UX

- [ ] **Add success notifications**
  - Toast messages for successful actions
  - Confirmation modals for destructive actions

#### Testing
- [ ] **End-to-end testing**
  - Complete user journey: Sign up → Join challenge → Upload cleanup → View dashboard
  - Test with multiple user accounts
  - Test edge cases (no data, first user, etc.)

- [ ] **Performance testing**
  - Test with 100+ cleanups
  - Test with 10+ concurrent users
  - Monitor MongoDB query performance

- [ ] **Security testing**
  - Verify auth tokens are validated
  - Test unauthorized access attempts
  - Verify users can't modify other users' data

---

## 📁 Files to Create/Modify

### Backend - New Files
```
backend/src/controllers/dashboardController.js
backend/src/controllers/leaderboardController.js
backend/src/routes/dashboardRoutes.js
backend/src/routes/leaderboardRoutes.js
backend/src/services/badgeService.js
```

### Backend - Files to Modify
```
backend/src/controllers/challengeController.js (add join/leave/stats endpoints)
backend/src/controllers/cleanupController.js (integrate badge service, add history)
backend/src/controllers/achievementsController.js (implement endpoints)
backend/src/routes/challengeRoutes.js (add new routes)
backend/src/routes/cleanupRoutes.js (add history route)
backend/src/routes/achievementsRoutes.js (add routes)
backend/src/server.js (register new routes)
backend/src/models/User.js (possibly add indexes)
backend/src/models/Challenge.js (possibly add indexes)
backend/src/models/Cleanup.js (possibly add indexes)
```

### Frontend - Files to Modify
```
frontend/src/context/JoinedChallengesContext.jsx (use backend API)
frontend/src/app/(protected)/dashboard/page.jsx (use real data)
frontend/src/app/(protected)/challenges/page.jsx (use backend join/leave)
frontend/src/app/(protected)/challenges/[id]/page.jsx (use real stats)
frontend/src/app/(protected)/profile/page.jsx (add achievements, history)
frontend/src/app/(protected)/upload/page.jsx (refresh after upload)
```

---

## 🔧 Development Workflow

### For Each New Endpoint

1. **Define the endpoint**
   - Method (GET, POST, etc.)
   - Path (/api/...)
   - Request/Response format

2. **Implement controller function**
   - Add business logic
   - Handle errors
   - Return consistent format

3. **Add route**
   - Register in appropriate route file
   - Add authentication middleware if needed

4. **Test with cURL or Postman**
   - Test happy path
   - Test error cases
   - Verify response format

5. **Update frontend**
   - Create/update API call
   - Handle response
   - Update UI

6. **End-to-end test**
   - Test complete flow from UI to database
   - Verify data persistence
   - Check for edge cases

---

## 🚀 Deployment Checklist (Future)

When ready to deploy:

- [ ] Set up environment variables
- [ ] Configure MongoDB connection string (production)
- [ ] Update CORS origins for production frontend URL
- [ ] Set up Firebase project for production
- [ ] Add rate limiting for API endpoints
- [ ] Set up logging and monitoring
- [ ] Configure file upload limits
- [ ] Test on production environment
- [ ] Create backup strategy for MongoDB
- [ ] Set up CI/CD pipeline

---

## 📊 Success Criteria

### MVP Features Complete When:
- ✅ Users can join/leave challenges via backend
- ✅ Dashboard shows real user data (not mock)
- ✅ Challenge stats update in real-time after cleanup
- ✅ Leaderboard displays top contributors
- ✅ Users earn badges automatically
- ✅ All data persists in MongoDB
- ✅ Firebase authentication works end-to-end
- ✅ AI classification updates challenge stats correctly
- ✅ Manual logging works as expected

### Performance Benchmarks:
- [ ] Dashboard loads in < 2 seconds
- [ ] Challenge list loads in < 1 second
- [ ] Photo upload + AI classification completes in < 5 seconds
- [ ] API responses < 500ms for most endpoints

### Code Quality:
- [ ] Consistent error handling across all endpoints
- [ ] All endpoints have authentication where needed
- [ ] Input validation on all POST/PATCH endpoints
- [ ] Database indexes added for frequently queried fields
- [ ] No security vulnerabilities

---

## 📝 Notes for Team

### Backend Team
- Start with Phase 1 (most critical for frontend integration)
- Use MongoDB aggregation framework for analytics
- Keep controllers focused and single-purpose
- Add comments for complex aggregations

### Frontend Team
- Wait for backend endpoints before integrating
- Test with mock data first
- Add loading states for all async operations
- Handle errors gracefully with user-friendly messages

### Testing Team
- Test each phase independently before moving to next
- Document any bugs found
- Test with different data volumes
- Verify performance under load

---

## 🎓 Learning Resources

### MongoDB Aggregation
- [Aggregation Pipeline](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/)
- [Aggregation Operators](https://www.mongodb.com/docs/manual/reference/operator/aggregation/)

### Firebase Admin SDK
- [Verify ID Tokens](https://firebase.google.com/docs/auth/admin/verify-id-tokens)

### REST API Best Practices
- [RESTful API Design](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

## ✅ Quick Start

To start implementing:

1. Read `BACKEND_ARCHITECTURE.md` for full context
2. Review `API_DOCUMENTATION.md` for endpoint details
3. Choose a phase from this checklist
4. Create a branch: `git checkout -b feature/phase-1-challenge-participation`
5. Implement backend endpoints first
6. Test with cURL/Postman
7. Update frontend to use new endpoints
8. Test end-to-end
9. Create PR and get reviewed

---

**Document Version:** 1.0  
**Last Updated:** November 10, 2025  
**Status:** Ready for Implementation
