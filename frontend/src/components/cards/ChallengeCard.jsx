import React from "react";
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    LinearProgress,
    Chip,
    Button,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/navigation";
import { useJoinedChallenges } from "@/context/JoinedChallengesContext";

const ChallengeCard = ({ challenge }) => {
    const {
        _id,
        title,
        bannerImage,
        locationName,
        totalTrashCollected,
        goal,
        status,
        totalVolunteers,
        startDate,
        endDate,
    } = challenge;

    const router = useRouter();
    const { isJoined } = useJoinedChallenges();
    const joined = isJoined(_id);

    const handleCardClick = () => {
        router.push(`/challenges/${_id}`);  // FIXED: Changed from /challenges/ to /challenges/
    };

    const handleButtonClick = (e) => {
        e.stopPropagation(); // Prevent bubbling to Card click
        router.push(`/challenges/${_id}`);  // FIXED: Changed from /challenges/ to /challenges/
    };

    const progress = goal > 0 ? Math.min((totalTrashCollected / goal) * 100, 100) : 0;

    const getStatusConfig = () => {
        const configs = {
            active: { label: "Active", bgColor: "#10b981" },
            completed: { label: "Completed", bgColor: "#6b7280" },
            upcoming: { label: "Upcoming", bgColor: "#f59e0b" },
        };
        return configs[status] || configs.active;
    };

    const statusConfig = getStatusConfig();

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const getProgressColor = () => {
        if (progress >= 80) return "#10b981";
        if (progress >= 50) return "#0ea5e9";
        return "#f59e0b";
    };

    return (
        <Card
            onClick={handleCardClick}
            sx={{
                cursor: "pointer",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: "12px",
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                transition: "all 0.3s ease",
                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
                    borderColor: "#0ea5e9",
                },
            }}
        >
            {/* Banner */}
            <Box sx={{ position: "relative", height: 180 }}>
                <CardMedia
                    component="img"
                    image={bannerImage}
                    alt={title}
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
                <Chip
                    label={statusConfig.label}
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        backgroundColor: statusConfig.bgColor,
                        color: "white",
                        fontWeight: 600,
                    }}
                />
            </Box>

            {/* Content */}
            <CardContent sx={{ display: "flex", flexDirection: "column", flexGrow: 1, p: 2.5 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        fontSize: "1rem",
                        lineHeight: 1.3,
                        mb: 1.5,
                        color: "#1e293b",
                    }}
                >
                    {title}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOnIcon sx={{ fontSize: 18, color: "#64748b", mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                        {locationName}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CalendarTodayIcon sx={{ fontSize: 16, color: "#64748b", mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                        {formatDate(startDate)} – {formatDate(endDate)}
                    </Typography>
                </Box>

                <Box sx={{ mt: "auto", mb: 2 }}>
                    <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, fontSize: "0.8rem", color: "#1e293b", mb: 0.5 }}
                    >
                        {totalTrashCollected.toLocaleString()} / {goal.toLocaleString()} items collected
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: "#e5e7eb",
                            "& .MuiLinearProgress-bar": {
                                backgroundColor: getProgressColor(),
                            },
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pt: 2,
                        borderTop: "1px solid #e5e7eb",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <PeopleIcon sx={{ fontSize: 16, color: "#64748b", mr: 0.5 }} />
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                            {totalVolunteers.toLocaleString()} volunteers
                        </Typography>
                    </Box>
                    {status === "active" && (
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={joined ? <CheckCircleIcon /> : null}
                            sx={{
                                backgroundColor: joined ? "#10b981" : "#0ea5e9",
                                color: "white",
                                textTransform: "none",
                                fontWeight: 600,
                                px: 2.5,
                                py: 0.5,
                                borderRadius: "6px",
                                "&:hover": {
                                    backgroundColor: joined ? "#059669" : "#0284c7",
                                },
                                cursor: "pointer",
                            }}
                            onClick={handleButtonClick}
                        >
                            {joined ? "Joined" : "Join"}
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ChallengeCard;