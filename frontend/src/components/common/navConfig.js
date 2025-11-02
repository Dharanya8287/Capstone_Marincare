"use client";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MilitaryTechRoundedIcon from "@mui/icons-material/MilitaryTechRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";

export const navItems = [
    { label: "Home", path: "/landing", icon: HomeRoundedIcon },
    { label: "Challenges", path: "/challenges", icon: MilitaryTechRoundedIcon },
    { label: "Upload", path: "/upload", icon: AddPhotoAlternateRoundedIcon },
    { label: "Dashboard", path: "/dashboard", icon: DashboardRoundedIcon },
    { label: "Achievements", path: "/achievements", icon: EmojiEventsRoundedIcon },
];

export const mobileOrder = [
    "/landing",
    "/challenges",
    "/upload",
    "/dashboard",
    "/achievements",
];
