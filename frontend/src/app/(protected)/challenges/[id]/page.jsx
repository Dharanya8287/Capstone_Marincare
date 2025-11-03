"use client";
import React, { useEffect, useState, useRef, use } from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    CircularProgress,
    Paper,
    LinearProgress,
    Chip,
    Grid,
    IconButton,
    Stack,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useRouter } from "next/navigation";
import withAuth from "@/components/auth/withAuth";
import { useAuthContext } from "@/context/AuthContext";
import { useJoinedChallenges } from "@/context/JoinedChallengesContext";
import { challenges as mockChallenges } from "@/data/challenges";

function ChallengeDetailsPage({ params }) {
    const { id } = use(params);
    const { user } = useAuthContext();
    const { joinChallenge, isJoined } = useJoinedChallenges();
    const router = useRouter();
    const fileInputRef = useRef(null);

    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [userTrashCollected, setUserTrashCollected] = useState(245);

    const [trashCategories] = useState([
        { type: "Plastic", count: 150, color: "#3b82f6", icon: "🥤" },
        { type: "Paper", count: 85, color: "#10b981", icon: "📄" },
        { type: "Metal", count: 45, color: "#f59e0b", icon: "🥫" },
        { type: "Glass", count: 30, color: "#8b5cf6", icon: "🍾" },
        { type: "Other", count: 20, color: "#6b7280", icon: "🗑️" },
    ]);

    useEffect(() => {
        setLoading(true);
        const foundChallenge = mockChallenges.find((c) => c._id === id);
        setChallenge(foundChallenge || null);
        setLoading(false);
    }, [id]);

    const joined = challenge ? isJoined(challenge._id) : false;

    const handleJoin = () => {
        if (challenge) {
            joinChallenge(challenge);
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles((prev) => [...prev, ...files]);
    };

    const handleTakePhoto = () => {
        fileInputRef.current.click();
    };

    const removeFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = () => {
        if (selectedFiles.length === 0) return;
        setUploading(true);
        setTimeout(() => {
            alert("Upload successful! AI is analyzing your trash photos...");
            setSelectedFiles([]);
            setUploading(false);
        }, 1500);
    };

    const handleGoToUpload = () => {
        router.push("/upload");
    };

    const formatDateReadable = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    if (loading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <CircularProgress />
            </Box>
        );

    if (!challenge)
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h5" sx={{ textAlign: "center", color: "#64748b" }}>
                    Challenge not found.
                </Typography>
            </Container>
        );

    const progress = challenge.goal > 0 ? Math.min((challenge.totalTrashCollected / challenge.goal) * 100, 100) : 0;
    const userProgress = challenge.goal > 0 ? Math.min((userTrashCollected / challenge.goal) * 100, 100) : 0;
    const isActive = challenge.status === "active";

    return (
        <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh", pb: 4 }}>
            {/* Hero Banner */}
            <Box
                sx={{
                    position: "relative",
                    height: { xs: "280px", sm: "360px", md: "420px" },
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${challenge.bannerImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
                        },
                    }}
                />
                <Container
                    maxWidth="xl"
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        pb: { xs: 3, sm: 4 },
                    }}
                >
                    <Chip
                        label={challenge.status.toUpperCase()}
                        size="small"
                        sx={{
                            backgroundColor:
                                challenge.status === "active"
                                    ? "#10b981"
                                    : challenge.status === "completed"
                                        ? "#6b7280"
                                        : "#f59e0b",
                            color: "white",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            mb: 2,
                            width: "fit-content",
                        }}
                    />
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 900,
                            color: "white",
                            mb: 2,
                            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                        }}
                    >
                        {challenge.title}
                    </Typography>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <LocationOnIcon sx={{ color: "white", fontSize: 20 }} />
                            <Typography sx={{ color: "white", fontWeight: 500 }}>
                                {challenge.region || challenge.locationName}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CalendarTodayIcon sx={{ color: "white", fontSize: 18 }} />
                            <Typography sx={{ color: "white", fontWeight: 500 }}>
                                {formatDateReadable(challenge.startDate)} - {formatDateReadable(challenge.endDate)}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <PeopleIcon sx={{ color: "white", fontSize: 20 }} />
                            <Typography sx={{ color: "white", fontWeight: 500 }}>
                                {challenge.totalVolunteers.toLocaleString()} Volunteers
                            </Typography>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mt: { xs: -2, sm: -3 }, position: "relative", zIndex: 2 }}>
                <Grid container spacing={{ xs: 2, md: 3 }}>
                    {/* Main Content Area */}
                    <Grid item xs={12} lg={8}>
                        {/* Description Card */}
                        <Paper
                            sx={{
                                p: { xs: 2.5, sm: 3.5 },
                                borderRadius: "20px",
                                mb: { xs: 2, md: 3 },
                                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#1e293b" }}>
                                About This Challenge
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.8 }}>
                                {challenge.description}
                            </Typography>
                        </Paper>

                        {/* Progress Cards Row */}
                        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 2, md: 3 } }}>
                            {/* Overall Progress */}
                            <Grid item xs={12} sm={joined ? 6 : 12}>
                                <Paper
                                    sx={{
                                        p: { xs: 2.5, sm: 3 },
                                        borderRadius: "20px",
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                        background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                                        color: "white",
                                        height: "100%",
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <EmojiEventsIcon sx={{ fontSize: 32, mr: 1.5 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            Overall Progress
                                        </Typography>
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 0.5 }}>
                                        {challenge.totalTrashCollected.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                                        of {challenge.goal.toLocaleString()} items collected
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={progress}
                                        sx={{
                                            height: 10,
                                            borderRadius: 5,
                                            backgroundColor: "rgba(255,255,255,0.3)",
                                            "& .MuiLinearProgress-bar": {
                                                backgroundColor: "white",
                                                borderRadius: 5,
                                            },
                                        }}
                                    />
                                    <Typography variant="caption" sx={{ mt: 1, display: "block", opacity: 0.9 }}>
                                        {progress.toFixed(1)}% Complete
                                    </Typography>
                                </Paper>
                            </Grid>

                            {/* User Contribution */}
                            {joined && (
                                <Grid item xs={12} sm={6}>
                                    <Paper
                                        sx={{
                                            p: { xs: 2.5, sm: 3 },
                                            borderRadius: "20px",
                                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                            background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                                            color: "white",
                                            height: "100%",
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                            <PersonIcon sx={{ fontSize: 32, mr: 1.5 }} />
                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                Your Impact
                                            </Typography>
                                        </Box>
                                        <Typography variant="h3" sx={{ fontWeight: 900, mb: 0.5 }}>
                                            {userTrashCollected.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                                            items collected by you
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={userProgress}
                                            sx={{
                                                height: 10,
                                                borderRadius: 5,
                                                backgroundColor: "rgba(255,255,255,0.3)",
                                                "& .MuiLinearProgress-bar": {
                                                    backgroundColor: "white",
                                                    borderRadius: 5,
                                                },
                                            }}
                                        />
                                        <Typography variant="caption" sx={{ mt: 1, display: "block", opacity: 0.9 }}>
                                            {userProgress.toFixed(1)}% of Goal
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>

                        {/* Trash Categories */}
                        <Paper
                            sx={{
                                p: { xs: 2.5, sm: 3.5 },
                                borderRadius: "20px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}>
                                        Trash Categories
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                                        AI-powered classification (coming soon)
                                    </Typography>
                                </Box>
                                <TrendingUpIcon sx={{ color: "#10b981", fontSize: 32 }} />
                            </Box>
                            <Grid container spacing={2}>
                                {trashCategories.map((category, idx) => (
                                    <Grid item xs={6} sm={4} md={2.4} key={idx}>
                                        <Box
                                            sx={{
                                                p: 2.5,
                                                borderRadius: "16px",
                                                backgroundColor: `${category.color}15`,
                                                border: `2px solid ${category.color}30`,
                                                textAlign: "center",
                                                transition: "all 0.3s ease",
                                                cursor: "pointer",
                                                "&:hover": {
                                                    transform: "translateY(-8px)",
                                                    boxShadow: `0 12px 24px ${category.color}30`,
                                                    borderColor: category.color,
                                                },
                                            }}
                                        >
                                            <Typography variant="h3" sx={{ mb: 1 }}>
                                                {category.icon}
                                            </Typography>
                                            <Typography
                                                variant="h5"
                                                sx={{ fontWeight: 800, color: category.color, mb: 0.5 }}
                                            >
                                                {category.count}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                                                {category.type}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Sidebar - Action Panel */}
                    <Grid item xs={12} lg={4}>
                        <Box sx={{ position: { lg: "sticky" }, top: { lg: 20 } }}>
                            <Paper
                                sx={{
                                    p: { xs: 2.5, sm: 3.5 },
                                    borderRadius: "20px",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                }}
                            >
                                {!joined ? (
                                    <Box>
                                        <Typography
                                            variant="h5"
                                            sx={{ fontWeight: 800, mb: 2, color: "#1e293b", textAlign: "center" }}
                                        >
                                            Join This Challenge
                                        </Typography>
                                        <Box
                                            sx={{
                                                textAlign: "center",
                                                py: 3,
                                                px: 2,
                                                mb: 3,
                                                backgroundColor: "#f0f9ff",
                                                borderRadius: "16px",
                                                border: "2px dashed #0ea5e9",
                                            }}
                                        >
                                            <Typography sx={{ fontSize: "4rem", mb: 1 }}>🌊</Typography>
                                            <Typography variant="body1" sx={{ color: "#0284c7", fontWeight: 600 }}>
                                                Be part of the cleanup movement and make a real difference!
                                            </Typography>
                                        </Box>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            onClick={handleJoin}
                                            sx={{
                                                background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                                                color: "white",
                                                py: 2,
                                                borderRadius: "14px",
                                                textTransform: "none",
                                                fontWeight: 700,
                                                fontSize: "1.125rem",
                                                boxShadow: "0 8px 24px rgba(14, 165, 233, 0.3)",
                                                "&:hover": {
                                                    background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                                                    boxShadow: "0 12px 32px rgba(14, 165, 233, 0.4)",
                                                },
                                            }}
                                        >
                                            Join Challenge
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box>
                                        <Box
                                            sx={{
                                                textAlign: "center",
                                                py: 2,
                                                px: 2,
                                                mb: 3,
                                                backgroundColor: "#dcfce7",
                                                borderRadius: "16px",
                                                border: "2px solid #10b981",
                                            }}
                                        >
                                            <Typography sx={{ fontSize: "3rem", mb: 1 }}>✅</Typography>
                                            <Typography variant="h6" sx={{ color: "#047857", fontWeight: 700, mb: 0.5 }}>
                                                You're In!
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#065f46" }}>
                                                Start uploading your cleanup photos
                                            </Typography>
                                        </Box>

                                        {isActive && (
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                size="large"
                                                startIcon={<CloudUploadIcon />}
                                                onClick={handleGoToUpload}
                                                sx={{
                                                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                                    color: "white",
                                                    py: 2,
                                                    borderRadius: "14px",
                                                    textTransform: "none",
                                                    fontWeight: 700,
                                                    fontSize: "1.125rem",
                                                    boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
                                                    "&:hover": {
                                                        background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                                                        boxShadow: "0 12px 32px rgba(16, 185, 129, 0.4)",
                                                    },
                                                }}
                                            >
                                                Go to Upload Page
                                            </Button>
                                        )}

                                        {!isActive && (
                                            <Box
                                                sx={{
                                                    textAlign: "center",
                                                    py: 4,
                                                    px: 2,
                                                    backgroundColor: "#fef3c7",
                                                    borderRadius: "16px",
                                                    border: "2px dashed #f59e0b",
                                                }}
                                            >
                                                <Typography sx={{ fontSize: "3rem", mb: 1 }}>⏰</Typography>
                                                <Typography variant="body2" sx={{ color: "#92400e", fontWeight: 600 }}>
                                                    Uploads are only available for active challenges
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                )}
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default withAuth(ChallengeDetailsPage);