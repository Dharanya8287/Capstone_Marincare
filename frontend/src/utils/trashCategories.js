// This file is used by the frontend to populate the manual log dropdown
// It MUST match the enums in `backend/src/models/Cleanup.js`
// and the keys in `backend/src/utils/trashCategories.js`

export const trashCategories = [
    { key: "plastic_bottle", displayName: "Plastic Bottles", icon: "🥤" },
    { key: "metal_can", displayName: "Metal Cans", icon: "🥫" },
    { key: "plastic_bag", displayName: "Plastic Bags", icon: "🛍️" },
    { key: "paper_cardboard", displayName: "Paper/Cardboard", icon: "📦" },
    { key: "cigarette_butt", displayName: "Cigarette Butts", icon: "🚬" },
    { key: "glass_bottle", displayName: "Glass Bottles", icon: "🍾" },
    { key: "unknown", displayName: "Other / Unknown", icon: "🗑️" },
];

