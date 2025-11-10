import mongoose from "mongoose";
import dotenv from "dotenv";
import Challenge from "../models/Challenge.js";

dotenv.config();

const sampleChallenges = [
    // ========== ACTIVE CHALLENGES ==========
    {
        title: "Toronto Waterfront Cleanup",
        description: "Join us to protect the scenic Toronto shoreline and preserve marine life.",
        bannerImage: "/challangeimg/img1.jpg",
        startDate: new Date("2025-10-15"),
        endDate: new Date("2025-10-22"),
        status: "active",
        locationName: "Toronto, ON",
        province: "ON",
        location: {
            type: "Point",
            coordinates: [-79.3832, 43.6532]
        },
        goal: 5000,
        goalUnit: "items",
        totalTrashCollected: 3421,
        totalVolunteers: 234,
    },
    {
        title: "Vancouver Island Cleanup",
        description: "Help protect the stunning west coast of Vancouver Island from ocean debris.",
        bannerImage: "/challangeimg/img2.jpg",
        startDate: new Date("2025-10-20"),
        endDate: new Date("2025-10-27"),
        status: "active",
        locationName: "Victoria, BC",
        province: "BC",
        location: {
            type: "Point",
            coordinates: [-123.3656, 48.4284]
        },
        goal: 4000,
        goalUnit: "items",
        totalTrashCollected: 2156,
        totalVolunteers: 187,
    },
    {
        title: "Halifax Harbour Initiative",
        description: "Support cleanup of Halifax's historic harbour and coastal ecosystems.",
        bannerImage: "/challangeimg/img3.jpg",
        startDate: new Date("2025-10-25"),
        endDate: new Date("2025-10-31"),
        status: "active",
        locationName: "Halifax, NS",
        province: "NS",
        location: {
            type: "Point",
            coordinates: [-63.5752, 44.6488]
        },
        goal: 3500,
        goalUnit: "items",
        totalTrashCollected: 1807,
        totalVolunteers: 156,
    },
    {
        title: "Prince Edward Island Shores",
        description: "Join hands to protect the red-sand beaches of Prince Edward Island.",
        bannerImage: "/challangeimg/img4.jpg",
        startDate: new Date("2025-10-18"),
        endDate: new Date("2025-10-24"),
        status: "active",
        locationName: "Charlottetown, PE",
        province: "PE",
        location: {
            type: "Point",
            coordinates: [-63.1311, 46.2382]
        },
        goal: 2500,
        goalUnit: "items",
        totalTrashCollected: 1420,
        totalVolunteers: 92,
    },
    {
        title: "Newfoundland Coast",
        description: "Clean the rugged and beautiful coastline of Newfoundland.",
        bannerImage: "/challangeimg/img5.jpg",
        startDate: new Date("2025-10-22"),
        endDate: new Date("2025-10-29"),
        status: "active",
        locationName: "St. John's, NL",
        province: "NL",
        location: {
            type: "Point",
            coordinates: [-52.7126, 47.5615]
        },
        goal: 3200,
        goalUnit: "items",
        totalTrashCollected: 1890,
        totalVolunteers: 124,
    },
    {
        title: "Georgian Bay Cleanup",
        description: "Preserve the clear waters and natural beauty of Georgian Bay.",
        bannerImage: "/challangeimg/img6.jpg",
        startDate: new Date("2025-10-26"),
        endDate: new Date("2025-11-02"),
        status: "active",
        locationName: "Parry Sound, ON",
        province: "ON",
        location: {
            type: "Point",
            coordinates: [-80.0350, 45.3430]
        },
        goal: 4200,
        goalUnit: "items",
        totalTrashCollected: 2567,
        totalVolunteers: 189,
    },

    // ========== UPCOMING CHALLENGES ==========
    {
        title: "Great Lakes Lakeshore Drive",
        description: "A multi-location cleanup across Ontario's Great Lakes shorelines.",
        bannerImage: "/challangeimg/img7.jpg",
        startDate: new Date("2025-11-20"),
        endDate: new Date("2025-11-27"),
        status: "upcoming",
        locationName: "Multiple Locations, ON",
        province: "ON",
        location: {
            type: "Point",
            coordinates: [-79.9959, 43.2557]
        },
        goal: 6000,
        goalUnit: "items",
        totalTrashCollected: 0,
        totalVolunteers: 0,
    },
    {
        title: "Quebec Riverfront Renewal",
        description: "Join volunteers restoring Quebec's riverside environment.",
        bannerImage: "/challangeimg/img8.jpg",
        startDate: new Date("2025-11-22"),
        endDate: new Date("2025-11-29"),
        status: "upcoming",
        locationName: "Quebec City, QC",
        province: "QC",
        location: {
            type: "Point",
            coordinates: [-71.2080, 46.8139]
        },
        goal: 3800,
        goalUnit: "items",
        totalTrashCollected: 0,
        totalVolunteers: 0,
    },
    {
        title: "Montreal St. Lawrence River",
        description: "Help preserve the natural beauty of the St. Lawrence River in Montreal.",
        bannerImage: "/challangeimg/img9.jpg",
        startDate: new Date("2025-11-25"),
        endDate: new Date("2025-12-02"),
        status: "upcoming",
        locationName: "Montreal, QC",
        province: "QC",
        location: {
            type: "Point",
            coordinates: [-73.5673, 45.5017]
        },
        goal: 4500,
        goalUnit: "items",
        totalTrashCollected: 0,
        totalVolunteers: 0,
    },

    // ========== COMPLETED CHALLENGES ==========
    {
        title: "Tofino Beach Success",
        description: "Successfully protected the pristine beaches of Tofino on Vancouver Island.",
        bannerImage: "/challangeimg/img13.jpg",
        startDate: new Date("2025-09-15"),
        endDate: new Date("2025-09-22"),
        status: "completed",
        locationName: "Tofino, BC",
        province: "BC",
        location: {
            type: "Point",
            coordinates: [-125.9070, 49.1530]
        },
        goal: 2800,
        goalUnit: "items",
        totalTrashCollected: 2800,
        totalVolunteers: 145,
    },
    {
        title: "Lake Winnipeg Initiative",
        description: "Successfully cleaned the vast shores of Lake Winnipeg.",
        bannerImage: "/challangeimg/img14.jpg",
        startDate: new Date("2025-09-20"),
        endDate: new Date("2025-09-27"),
        status: "completed",
        locationName: "Winnipeg, MB",
        province: "MB",
        location: {
            type: "Point",
            coordinates: [-97.1384, 49.8951]
        },
        goal: 3400,
        goalUnit: "items",
        totalTrashCollected: 3450,
        totalVolunteers: 134,
    },
    {
        title: "Lunenburg Heritage Coast",
        description: "Successfully cleaned the historic UNESCO coastline of Lunenburg.",
        bannerImage: "/challangeimg/img15.jpg",
        startDate: new Date("2025-09-10"),
        endDate: new Date("2025-09-17"),
        status: "completed",
        locationName: "Lunenburg, NS",
        province: "NS",
        location: {
            type: "Point",
            coordinates: [-64.3088, 44.3765]
        },
        goal: 2600,
        goalUnit: "items",
        totalTrashCollected: 2650,
        totalVolunteers: 72,
    },
];

async function seedChallenges() {
    try {
        // Connect to MongoDB
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");

        // Clear existing challenges (optional - comment out if you want to keep existing data)
        console.log("\nClearing existing challenges...");
        await Challenge.deleteMany({});
        console.log("✅ Existing challenges cleared");

        // Insert sample challenges
        console.log("\nInserting sample challenges...");
        const insertedChallenges = await Challenge.insertMany(sampleChallenges);
        console.log(`✅ Successfully inserted ${insertedChallenges.length} challenges`);

        // Display summary
        console.log("\n📊 Challenge Summary:");
        const activeChallenges = insertedChallenges.filter(c => c.status === "active");
        const upcomingChallenges = insertedChallenges.filter(c => c.status === "upcoming");
        const completedChallenges = insertedChallenges.filter(c => c.status === "completed");
        
        console.log(`   Active: ${activeChallenges.length}`);
        console.log(`   Upcoming: ${upcomingChallenges.length}`);
        console.log(`   Completed: ${completedChallenges.length}`);
        console.log(`   Total: ${insertedChallenges.length}`);

        console.log("\n✨ Database seeding completed successfully!");
        console.log("\nYou can now test the application with these challenges.");

    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log("\n👋 Database connection closed");
        process.exit(0);
    }
}

// Run the seed function
seedChallenges();
