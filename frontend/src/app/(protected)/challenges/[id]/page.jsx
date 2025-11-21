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
    Alert,
    Snackbar,
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import withAuth from "@/components/auth/withAuth";
import { useAuthContext } from "@/context/AuthContext";
import { useJoinedChallenges } from "@/context/JoinedChallengesContext";
import { apiCall } from "@/utils/api";
import { getCurrentLocation, formatLocationError } from "@/utils/geolocation";

function ChallengeDetailsPage({ params }) {
    const { id } = use(params);
    const { user } = useAuthContext();
    const { joinChallenge, leaveChallenge, isJoined, refreshJoinedChallenges } = useJoinedChallenges();
    const router = useRouter();
    const fileInputRef = useRef(null);

    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [userTrashCollected, setUserTrashCollected] = useState(245);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [lastRefreshTime, setLastRefreshTime] = useState(0);

    // Trash categories mapping - matches backend predefined categories
    const getCategoryDisplay = (key, count) => {
        const categoryMap = {
            plastic_bottle: { type: "Plastic Bottle", color: "#3b82f6", icon: "🥤" },
            metal_can: { type: "Metal Can", color: "#f59e0b", icon: "🥫" },
            plastic_bag: { type: "Plastic Bag", color: "#06b6d4", icon: "🛍️" },
            paper_cardboard: { type: "Paper/Cardboard", color: "#10b981", icon: "📄" },
            cigarette_butt: { type: "Cigarette Butt", color: "#ef4444", icon: "🚬" },
            glass_bottle: { type: "Glass Bottle", color: "#8b5cf6", icon: "🍾" },
        };
        return { ...categoryMap[key], count: count || 0, key };
    };

    // Get trash categories from challenge wasteBreakdown
    const getTrashCategories = () => {
        if (!challenge || !challenge.wasteBreakdown) return [];
        
        const breakdown = challenge.wasteBreakdown;
        return [
            getCategoryDisplay('plastic_bottle', breakdown.plastic_bottle),
            getCategoryDisplay('metal_can', breakdown.metal_can),
            getCategoryDisplay('plastic_bag', breakdown.plastic_bag),
            getCategoryDisplay('paper_cardboard', breakdown.paper_cardboard),
            getCategoryDisplay('cigarette_butt', breakdown.cigarette_butt),
            getCategoryDisplay('glass_bottle', breakdown.glass_bottle),
        ];
    };

    const trashCategories = getTrashCategories();

    // Fetch challenge from backend (initial load only)
    const fetchChallenge = async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            
            const response = await apiCall('get', `${process.env.NEXT_PUBLIC_API_URL}/api/challenges/${id}`);
            setChallenge(response.data);
            
            if (showLoading) setLoading(false);
        } catch (error) {
            console.error('Error fetching challenge:', error);
            setSnackbar({ open: true, message: 'Error loading challenge', severity: 'error' });
            if (showLoading) setLoading(false);
        }
    };

    // Silently refresh challenge data (no loading state)
    const refreshChallengeData = async () => {
        try {
            const response = await apiCall('get', `${process.env.NEXT_PUBLIC_API_URL}/api/challenges/${id}`);
            // Only update if data changed to prevent unnecessary re-renders
            setChallenge(prev => {
                const newData = response.data;
                // Compare critical fields to see if update is needed
                if (!prev || 
                    prev.totalTrashCollected !== newData.totalTrashCollected ||
                    prev.totalVolunteers !== newData.totalVolunteers ||
                    JSON.stringify(prev.wasteBreakdown) !== JSON.stringify(newData.wasteBreakdown)) {
                    return newData;
                }
                return prev;
            });
        } catch (error) {
            console.error('Error refreshing challenge:', error);
            // Silently fail on refresh, don't show error to user
        }
    };

    // Throttled refresh to prevent excessive API calls
    const throttledRefresh = () => {
        const now = Date.now();
        const THROTTLE_MS = 3000; // Minimum 3 seconds between refreshes
        
        if (now - lastRefreshTime >= THROTTLE_MS) {
            setLastRefreshTime(now);
            refreshChallengeData();
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchChallenge(true);
    }, [id]);

    // Auto-refresh challenge data every 10 seconds to get latest stats (silently)
    useEffect(() => {
        const intervalId = setInterval(() => {
            refreshChallengeData();
        }, 10000); // Refresh every 10 seconds

        return () => clearInterval(intervalId);
    }, [id]);

    // Refresh data when page becomes visible (user returns from upload page)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                // Page is now visible, refresh challenge data (throttled)
                throttledRefresh();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Also refresh on window focus (for better UX, throttled)
        window.addEventListener('focus', throttledRefresh);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', throttledRefresh);
        };
    }, [id]); // Removed lastRefreshTime from dependencies

    const joined = challenge ? isJoined(challenge._id) : false;

    const handleJoin = async () => {
        if (!challenge) return;
        
        try {
            setActionLoading(true);
            
            // Get user's current location
            let userLocation = null;
            try {
                setSnackbar({ 
                    open: true, 
                    message: 'Requesting your location...', 
                    severity: 'info' 
                });
                
                userLocation = await getCurrentLocation();
                
                console.log('Location obtained:', userLocation);
            } catch (locationError) {
                console.error('Location error:', locationError);
                setSnackbar({ 
                    open: true, 
                    message: formatLocationError(locationError), 
                    severity: 'error' 
                });
                setActionLoading(false);
                return;
            }
            
            // Join challenge with location
            await joinChallenge(challenge._id, userLocation);
            
            // Silently refresh challenge data to get updated volunteer count
            await refreshChallengeData();
            
            setSnackbar({ open: true, message: 'Successfully joined the challenge!', severity: 'success' });
        } catch (error) {
            console.error('Error joining challenge:', error);
            
            // Handle location verification errors
            const errorData = error.response?.data;
            const errorCode = errorData?.error;
            
            if (errorCode === 'LOCATION_TOO_FAR') {
                const distance = errorData?.distance;
                const maxDistance = errorData?.maxDistance;
                setSnackbar({ 
                    open: true, 
                    message: `You are ${distance} km from the challenge location (max allowed: ${maxDistance} km)`, 
                    severity: 'error' 
                });
            } else if (errorCode === 'LOCATION_REQUIRED') {
                setSnackbar({ 
                    open: true, 
                    message: 'Location is required to join this challenge', 
                    severity: 'error' 
                });
            } else {
                setSnackbar({ 
                    open: true, 
                    message: errorData?.message || 'Error joining challenge', 
                    severity: 'error' 
                });
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleLeave = async () => {
        if (!challenge) return;
        
        try {
            setActionLoading(true);
            await leaveChallenge(challenge._id);
            
            // Silently refresh challenge data to get updated volunteer count
            await refreshChallengeData();
            
            setSnackbar({ open: true, message: 'Successfully left the challenge', severity: 'info' });
        } catch (error) {
            console.error('Error leaving challenge:', error);
            setSnackbar({ 
                open: true, 
                message: error.response?.data?.message || 'Error leaving challenge', 
                severity: 'error' 
            });
        } finally {
            setActionLoading(false);
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

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
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
            {/* Back Button */}
            <Container maxWidth="xl" sx={{ pt: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.push('/challenges')}
                    sx={{
                        color: "#64748b",
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": {
                            backgroundColor: "#f1f5f9",
                            color: "#1e293b",
                        },
                    }}
                >
                    Back to Challenges
                </Button>
            </Container>

            {/* Hero Banner */}
            <Box
                sx={{
                    position: "relative",
                    height: { xs: "280px", sm: "360px", md: "420px" },
                    overflow: "hidden",
                    mt: 2,
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
                    {/* Top Row - Progress Cards (Full Width) */}
                    <Grid item xs={12}>
                        <Grid container spacing={{ xs: 2, md: 3 }}>
                            {/* Overall Progress */}
                            <Grid item xs={12} sm={6} md={4}>
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
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper
                                    sx={{
                                        p: { xs: 2.5, sm: 3 },
                                        borderRadius: "20px",
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                        background: joined 
                                            ? "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                                            : "linear-gradient(135deg, #64748b 0%, #475569 100%)",
                                        color: "white",
                                        height: "100%",
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <PersonIcon sx={{ fontSize: 32, mr: 1.5 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            {joined ? "Your Impact" : "Join to Track"}
                                        </Typography>
                                    </Box>
                                    {joined ? (
                                        <>
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
                                        </>
                                    ) : (
                                        <>
                                            <Typography variant="h3" sx={{ fontWeight: 900, mb: 0.5 }}>
                                                0
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                                                Join to start tracking your impact
                                            </Typography>
                                            <Box sx={{ height: 10, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 5 }} />
                                        </>
                                    )}
                                </Paper>
                            </Grid>

                            {/* Challenge Details Card (Now in Top Row) */}
                            <Grid item xs={12} md={4}>
                                <Paper
                                    sx={{
                                        p: { xs: 2.5, sm: 3 },
                                        borderRadius: "20px",
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                        color: "white",
                                        height: "100%",
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <PeopleIcon sx={{ fontSize: 32, mr: 1.5 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            Challenge Info
                                        </Typography>
                                    </Box>
                                    <Stack spacing={1.5}>
                                        <Box>
                                            <Typography variant="caption" sx={{ opacity: 0.9, display: "block" }}>
                                                Volunteers
                                            </Typography>
                                            <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                                {challenge.totalVolunteers.toLocaleString()}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ opacity: 0.9, display: "block" }}>
                                                Timeline
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {formatDateReadable(challenge.startDate)} - {formatDateReadable(challenge.endDate)}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Main Content Row */}
                    <Grid item xs={12} md={8}>
                        {/* Action Card - Now in Main Content */}
                        {!joined ? (
                            <Paper
                                sx={{
                                    p: { xs: 2.5, sm: 3.5 },
                                    borderRadius: "20px",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                    mb: 3,
                                }}
                            >
                                <Grid container spacing={3} alignItems="center">
                                    <Grid item xs={12} sm={6}>
                                        <Box
                                            sx={{
                                                textAlign: "center",
                                                py: 3,
                                                px: 2,
                                                backgroundColor: "#f0f9ff",
                                                borderRadius: "16px",
                                                border: "2px dashed #0ea5e9",
                                            }}
                                        >
                                            <Typography sx={{ fontSize: "4rem", mb: 1 }}>🌊</Typography>
                                            <Typography variant="body1" sx={{ color: "#0284c7", fontWeight: 600 }}>
                                                Be part of the cleanup movement!
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography
                                            variant="h5"
                                            sx={{ fontWeight: 800, mb: 2, color: "#1e293b" }}
                                        >
                                            Join This Challenge
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            onClick={handleJoin}
                                            disabled={actionLoading}
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
                                                "&:disabled": {
                                                    background: "#e2e8f0",
                                                    color: "#94a3b8",
                                                },
                                            }}
                                        >
                                            {actionLoading ? <CircularProgress size={24} color="inherit" /> : "Join Challenge"}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        ) : (
                            <Paper
                                sx={{
                                    p: { xs: 2.5, sm: 3.5 },
                                    borderRadius: "20px",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                    mb: 3,
                                }}
                            >
                                <Grid container spacing={3} alignItems="center">
                                    <Grid item xs={12} sm={6}>
                                        <Box
                                            sx={{
                                                textAlign: "center",
                                                py: 2,
                                                px: 2,
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
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        {isActive && (
                                            <Stack spacing={2}>
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
                                                <Button
                                                    variant="outlined"
                                                    fullWidth
                                                    size="medium"
                                                    onClick={handleLeave}
                                                    disabled={actionLoading}
                                                    sx={{
                                                        borderColor: "#ef4444",
                                                        color: "#ef4444",
                                                        py: 1.5,
                                                        borderRadius: "14px",
                                                        textTransform: "none",
                                                        fontWeight: 600,
                                                        fontSize: "1rem",
                                                        "&:hover": {
                                                            borderColor: "#dc2626",
                                                            color: "#dc2626",
                                                            backgroundColor: "#fef2f2",
                                                        },
                                                        "&:disabled": {
                                                            borderColor: "#e2e8f0",
                                                            color: "#94a3b8",
                                                        },
                                                    }}
                                                >
                                                    {actionLoading ? <CircularProgress size={20} color="inherit" /> : "Leave Challenge"}
                                                </Button>
                                            </Stack>
                                        )}
                                        {!isActive && (
                                            <Stack spacing={2}>
                                                <Box
                                                    sx={{
                                                        textAlign: "center",
                                                        py: 3,
                                                        px: 2,
                                                        backgroundColor: "#fef3c7",
                                                        borderRadius: "16px",
                                                        border: "2px dashed #f59e0b",
                                                    }}
                                                >
                                                    <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>⏰</Typography>
                                                    <Typography variant="body2" sx={{ color: "#92400e", fontWeight: 600 }}>
                                                        Uploads only available for active challenges
                                                    </Typography>
                                                </Box>
                                                <Button
                                                    variant="outlined"
                                                    fullWidth
                                                    size="medium"
                                                    onClick={handleLeave}
                                                    disabled={actionLoading}
                                                    sx={{
                                                        borderColor: "#ef4444",
                                                        color: "#ef4444",
                                                        py: 1.5,
                                                        borderRadius: "14px",
                                                        textTransform: "none",
                                                        fontWeight: 600,
                                                        fontSize: "1rem",
                                                        "&:hover": {
                                                            borderColor: "#dc2626",
                                                            color: "#dc2626",
                                                            backgroundColor: "#fef2f2",
                                                        },
                                                        "&:disabled": {
                                                            borderColor: "#e2e8f0",
                                                            color: "#94a3b8",
                                                        },
                                                    }}
                                                >
                                                    {actionLoading ? <CircularProgress size={20} color="inherit" /> : "Leave Challenge"}
                                                </Button>
                                            </Stack>
                                        )}
                                    </Grid>
                                </Grid>
                            </Paper>
                        )}

                        {/* Description Card */}
                        <Paper
                            sx={{
                                p: { xs: 2.5, sm: 3.5 },
                                borderRadius: "20px",
                                mb: 3,
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
                    </Grid>

                    {/* Right Sidebar - Challenge Details */}
                    <Grid item xs={12} md={4}>
                        <Paper
                            sx={{
                                p: { xs: 2.5, sm: 3.5 },
                                borderRadius: "20px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                position: { md: "sticky" },
                                top: { md: 20 },
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: "#1e293b" }}>
                                Location & Details
                            </Typography>
                            
                            <Stack spacing={3}>
                                {/* Location */}
                                <Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                        <LocationOnIcon sx={{ fontSize: 22, color: "#0ea5e9", mr: 1 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
                                            Location
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{ color: "#1e293b", fontWeight: 600, pl: 4 }}>
                                        {challenge.locationName}
                                    </Typography>
                                </Box>

                                {/* Province */}
                                <Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                        <Box sx={{ width: 22, height: 22, borderRadius: "4px", 
                                            backgroundColor: "#8b5cf6",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mr: 1
                                        }}>
                                            <Typography sx={{ color: "white", fontSize: "0.75rem", fontWeight: 800 }}>
                                                {challenge.province}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
                                            Province
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{ color: "#1e293b", fontWeight: 600, pl: 4 }}>
                                        {challenge.province}
                                            </Typography>
                                </Box>

                                {/* Goal */}
                                <Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                        <EmojiEventsIcon sx={{ fontSize: 22, color: "#f59e0b", mr: 1 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
                                            Goal
                                        </Typography>
                                    </Box>
                                    <Typography variant="h5" sx={{ color: "#1e293b", fontWeight: 800, pl: 4 }}>
                                        {challenge.goal.toLocaleString()}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "#64748b", pl: 4 }}>
                                        {challenge.goalUnit}
                                    </Typography>
                                </Box>

                                {/* Status */}
                                <Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                        <Box sx={{ width: 22, height: 22, borderRadius: "50%", 
                                            backgroundColor: challenge.status === "active" ? "#10b981" : 
                                                           challenge.status === "completed" ? "#6b7280" : "#f59e0b",
                                            mr: 1
                                        }} />
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
                                            Status
                                        </Typography>
                                    </Box>
                                    <Chip 
                                        label={challenge.status.toUpperCase()} 
                                        size="small"
                                        sx={{ 
                                            ml: 4,
                                            backgroundColor: challenge.status === "active" ? "#10b981" : 
                                                           challenge.status === "completed" ? "#6b7280" : "#f59e0b",
                                            color: "white",
                                            fontWeight: 700,
                                            fontSize: "0.7rem",
                                        }}
                                    />
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* Full Width - Trash Categories */}
                    <Grid item xs={12}>
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
                                        AI-powered classification • Real-time updates
                                    </Typography>
                                </Box>
                                <TrendingUpIcon sx={{ color: "#10b981", fontSize: 32 }} />
                            </Box>
                            <Grid container spacing={2}>
                                {trashCategories.map((category, idx) => (
                                    <Grid item xs={6} sm={4} md={2} key={category.key}>
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
                </Grid>
            </Container>

            {/* Snackbar for notifications */}
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={4000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity} 
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default withAuth(ChallengeDetailsPage);