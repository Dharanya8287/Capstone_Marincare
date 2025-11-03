// components/common/StatCard.jsx
import React from "react";
import { Box, Typography, Paper, useMediaQuery, useTheme } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PeopleIcon from "@mui/icons-material/People";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PublicIcon from "@mui/icons-material/Public";

const StatCard = ({ stats }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (!stats) return null;

    const statsData = [
        {
            label: "Total Challenges",
            value: stats.totalChallenges || 0,
            icon: <EmojiEventsIcon sx={{ fontSize: isMobile ? 28 : 32 }} />,
            color: "#0ea5e9",
            bgColor: "#e0f2fe"
        },
        {
            label: "Active Volunteers",
            value: stats.activeVolunteers || 0,
            icon: <PeopleIcon sx={{ fontSize: isMobile ? 28 : 32 }} />,
            color: "#10b981",
            bgColor: "#d1fae5"
        },
        {
            label: "Items Collected",
            value: stats.itemsCollected || 0,
            icon: <DeleteOutlineIcon sx={{ fontSize: isMobile ? 28 : 32 }} />,
            color: "#f59e0b",
            bgColor: "#fef3c7"
        },
        {
            label: "Provinces",
            value: stats.provinces || 0,
            icon: <PublicIcon sx={{ fontSize: isMobile ? 28 : 32 }} />,
            color: "#8b5cf6",
            bgColor: "#ede9fe"
        },
    ];

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr 1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr 1fr",
                },
                gap: { xs: 2, sm: 2.5, md: 3 },
                mb: 4,
            }}
        >
            {statsData.map((stat, index) => (
                <Paper
                    key={index}
                    elevation={0}
                    sx={{
                        p: { xs: 2.5, sm: 3 },
                        borderRadius: "16px",
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            gap: 1.5,
                        }}
                    >
                        <Box
                            sx={{
                                width: { xs: 50, sm: 56 },
                                height: { xs: 50, sm: 56 },
                                borderRadius: "12px",
                                backgroundColor: stat.bgColor,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: stat.color,
                            }}
                        >
                            {stat.icon}
                        </Box>
                        <Box>
                            <Typography
                                variant={isMobile ? "h5" : "h4"}
                                sx={{
                                    fontWeight: 700,
                                    color: "text.primary",
                                    lineHeight: 1,
                                    mb: 0.5,
                                }}
                            >
                                {stat.value.toLocaleString()}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                    fontWeight: 500,
                                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                                }}
                            >
                                {stat.label}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
};

export default StatCard;