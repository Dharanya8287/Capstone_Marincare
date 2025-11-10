# Database Seeding Guide

## Overview

This guide explains how to populate your MongoDB database with sample challenge data for testing purposes.

---

## Quick Start

### Option 1: Using npm Script (Recommended)

```bash
cd backend
npm run seed
```

This will:
1. Connect to your MongoDB database
2. Clear all existing challenges
3. Insert 12 sample challenges (6 active, 3 upcoming, 3 completed)
4. Display a summary of inserted data

---

## Sample Data

The seed script creates **12 challenges** across Canada:

### Active Challenges (6)
1. **Toronto Waterfront Cleanup** - Toronto, ON
2. **Vancouver Island Cleanup** - Victoria, BC
3. **Halifax Harbour Initiative** - Halifax, NS
4. **Prince Edward Island Shores** - Charlottetown, PE
5. **Newfoundland Coast** - St. John's, NL
6. **Georgian Bay Cleanup** - Parry Sound, ON

### Upcoming Challenges (3)
7. **Great Lakes Lakeshore Drive** - Multiple Locations, ON
8. **Quebec Riverfront Renewal** - Quebec City, QC
9. **Montreal St. Lawrence River** - Montreal, QC

### Completed Challenges (3)
10. **Tofino Beach Success** - Tofino, BC
11. **Lake Winnipeg Initiative** - Winnipeg, MB
12. **Lunenburg Heritage Coast** - Lunenburg, NS

---

## Expected Output

```
Connecting to MongoDB...
✅ MongoDB Connected

Clearing existing challenges...
✅ Existing challenges cleared

Inserting sample challenges...
✅ Successfully inserted 12 challenges

📊 Challenge Summary:
   Active: 6
   Upcoming: 3
   Completed: 3
   Total: 12

✨ Database seeding completed successfully!

You can now test the application with these challenges.

👋 Database connection closed
```

---

## Important Notes

### ⚠️ Data Clearing

By default, the seed script **clears all existing challenges** before inserting new ones. 

**To preserve existing data**, comment out this line in `src/scripts/seedChallenges.js`:

```javascript
// await Challenge.deleteMany({});  // Comment this line to keep existing challenges
```

### 📍 Location Data

All challenges include proper geolocation coordinates for:
- Map display
- Geospatial queries
- Location-based filtering

### 📊 Pre-populated Stats

Each challenge includes realistic stats:
- `totalTrashCollected`: Varies by challenge
- `totalVolunteers`: Varies by challenge
- Active challenges: Partially complete (50-85% of goal)
- Completed challenges: Goal met or exceeded
- Upcoming challenges: 0 volunteers and items

---

## Testing the Data

After seeding, you can:

1. **View All Challenges**
   - Visit: http://localhost:3000/challenges
   - Should see 12 challenges categorized by status

2. **Join a Challenge**
   - Click on any active challenge
   - Click "Join Challenge" button
   - Verify volunteer count increments

3. **Test Filters**
   - Filter by status (Active/Upcoming/Completed)
   - Filter by province
   - Verify correct challenges appear

4. **Test API Endpoints**
   ```bash
   # Get all challenges
   curl http://localhost:5000/api/challenges

   # Get challenge stats
   curl http://localhost:5000/api/challenges/stats

   # Get specific challenge (use actual ID from database)
   curl http://localhost:5000/api/challenges/{challengeId}
   ```

---

## Alternative: Manual Database Seeding

If you prefer to use MongoDB Compass or command line:

### Using MongoDB Compass
1. Connect to your database
2. Open the `challenges` collection
3. Click "Add Data" → "Import File"
4. Use the JSON data from `seedChallenges.js`

### Using MongoDB Shell
```bash
mongosh
use waveguard
db.challenges.insertMany([...paste data from seedChallenges.js...])
```

---

## Troubleshooting

### Error: "Cannot connect to MongoDB"
**Solution:** Check your `.env` file has correct `MONGO_URI`
```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

### Error: "Module not found"
**Solution:** Make sure you're in the backend directory and dependencies are installed
```bash
cd backend
npm install
npm run seed
```

### Script runs but no data appears
**Solution:** 
1. Check if MongoDB is running
2. Verify database name in connection string
3. Check MongoDB Compass to confirm data insertion

---

## Customizing Seed Data

To add your own challenges or modify existing ones:

1. Open `backend/src/scripts/seedChallenges.js`
2. Edit the `sampleChallenges` array
3. Add/remove/modify challenge objects
4. Run `npm run seed` again

**Example: Add a new challenge**
```javascript
{
    title: "My Custom Challenge",
    description: "A custom cleanup event",
    bannerImage: "/challangeimg/custom.jpg",
    startDate: new Date("2025-12-01"),
    endDate: new Date("2025-12-08"),
    status: "upcoming",
    locationName: "Your City, Province",
    province: "XX",
    location: {
        type: "Point",
        coordinates: [-123.456, 45.678]  // [longitude, latitude]
    },
    goal: 1000,
    goalUnit: "items",
    totalTrashCollected: 0,
    totalVolunteers: 0,
},
```

---

## Development Workflow

### Initial Setup
```bash
cd backend
npm install
npm run seed
npm start
```

### During Development
```bash
# Reset database with fresh test data
npm run seed

# Start server
npm run dev
```

### Before Testing
```bash
# Always seed database first for consistent test data
npm run seed

# Then run tests
npm test  # (if you have tests configured)
```

---

## Production Considerations

⚠️ **DO NOT run the seed script in production!**

This script is for **development and testing only**. In production:

1. Challenges should be created through an admin panel
2. Use proper data migration tools
3. Never delete existing production data

---

## Related Files

- **Seed Script**: `backend/src/scripts/seedChallenges.js`
- **Challenge Model**: `backend/src/models/Challenge.js`
- **Challenge Controller**: `backend/src/controllers/challengeController.js`
- **Frontend Mock Data**: `frontend/src/data/challenges.js`

---

## Next Steps

After seeding:

1. ✅ Start backend: `npm start`
2. ✅ Start frontend: `cd ../frontend && npm run dev`
3. ✅ Visit: http://localhost:3000/challenges
4. ✅ Test join/leave functionality
5. ✅ Test filters and search
6. ✅ Verify volunteer counts update

---

**Happy Testing! 🌊**
