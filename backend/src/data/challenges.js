// Sample data - expand this to ~20 challenges
export const challenges = [
    {
        title: "Toronto Waterfront Challenge",
        description: "Join us in cleaning up the beautiful Toronto waterfront.",
        bannerImage: "/images/challenges/toronto-waterfront.jpg", // Use placeholder paths
        startDate: new Date("2025-11-05"),
        endDate: new Date("2025-11-20"),
        status: "active",
        locationName: "Toronto, ON",
        province: "ON",
        goal: 5000,
        location: { coordinates: [-79.3832, 43.6532] },
        totalTrashCollected: 3421,
        totalVolunteers: 234,
    },
    {
        title: "Vancouver Island Cleanup",
        description: "Help preserve the stunning coastline of Vancouver Island.",
        bannerImage: "/images/challenges/vancouver-island.jpg",
        startDate: new Date("2025-10-20"),
        endDate: new Date("2025-10-27"),
        status: "active",
        locationName: "Victoria, BC",
        province: "BC",
        goal: 4000,
        location: { coordinates: [-123.3656, 48.4284] },
        totalTrashCollected: 2156,
        totalVolunteers: 187,
    },
    // ... add more challenges here
];