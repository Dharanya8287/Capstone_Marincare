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
    Divider,
    Card,
    CardContent,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import withAuth from "@/components/auth/withAuth";
import { useAuthContext } from "@/context/AuthContext";
import { challenges as mockChallenges } from "@/data/challenges";

function ChallengeDetailsPage({ params }) {
    const { id } = use(params);
    const { user } = useAuthContext();
    const fileInputRef = useRef(null);

    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joined, setJoined] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [userTrashCollected, setUserTrashCollected] = useState(245); // Mock user contribution

    // Mock trash categories (will be replaced with AI classification later)
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

    const handleJoin = () => {
        setJoined(true);
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

    const formatDate = (date) => {
        if (!date) return "";
        const d = typeof date === "string" ? date : new Date(date).toISOString();
        return d.slice(0, 10);
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
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h5" sx={{ textAlign: "center", color: "#64748b" }}>
                    Challenge not found.
                </Typography>
            </Container>
        );

    const progress = challenge.goal > 0 ? Math.min((challenge.totalTrashCollected / challenge.goal) * 100, 100) : 0;
    const userProgress = challenge.goal > 0 ? Math.min((userTrashCollected / challenge.goal) * 100, 100) : 0;
    const isActive = challenge.status === "active";

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
            {/* Banner Section */}
            <Paper
                sx={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    mb: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
            >
                <Box sx={{ position: "relative", height: { xs: 200, sm: 300 } }}>
                    <img
                        src={challenge.bannerImage}
                        alt={challenge.title}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7))",
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 20,
                            left: 20,
                            right: 20,
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                color: "white",
                                mb: 1,
                                fontSize: { xs: "1.5rem", sm: "2rem" },
                            }}
                        >
                            {challenge.title}
                        </Typography>
                        <Chip
                            label={challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                            size="small"
                            sx={{
                                backgroundColor:
                                    challenge.status === "active"
                                        ? "#10b981"
                                        : challenge.status === "completed"
                                            ? "#6b7280"
                                            : "#f59e0b",
                                color: "white",
                                fontWeight: 600,
                            }}
                        />
                    </Box>
                </Box>
            </Paper>

            <Grid container spacing={3}>
                {/* Left Column - Main Info */}
                <Grid item xs={12} md={8}>
                    {/* Challenge Info Card */}
                    <Paper sx={{ p: 3, borderRadius: "16px", mb: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#1e293b" }}>
                            Challenge Details
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <LocationOnIcon sx={{ color: "#0ea5e9", mr: 1 }} />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                                            Location
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                                            {challenge.region || challenge.locationName}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <CalendarTodayIcon sx={{ color: "#0ea5e9", mr: 1 }} />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                                            Duration
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                                            {formatDateReadable(challenge.startDate)} - {formatDateReadable(challenge.endDate)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <PeopleIcon sx={{ color: "#0ea5e9", mr: 1 }} />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                                            Volunteers
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                                            {challenge.totalVolunteers.toLocaleString()} Participants
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.8 }}>
                            {challenge.description}
                        </Typography>
                    </Paper>

                    {/* Overall Progress Card */}
                    <Paper sx={{ p: 3, borderRadius: "16px", mb: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                                Overall Progress
                            </Typography>
                            <EmojiEventsIcon sx={{ color: "#f59e0b", fontSize: 28 }} />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: "#0ea5e9", mb: 1 }}>
                            {challenge.totalTrashCollected.toLocaleString()} / {challenge.goal.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
                            items collected
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 12,
                                borderRadius: 6,
                                backgroundColor: "#e5e7eb",
                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#10b981",
                                    borderRadius: 6,
                                },
                            }}
                        />
                        <Typography variant="caption" sx={{ color: "#64748b", mt: 1, display: "block" }}>
                            {progress.toFixed(1)}% completed
                        </Typography>
                    </Paper>

                    {/* User Contribution Card */}
                    {joined && (
                        <Paper sx={{ p: 3, borderRadius: "16px", mb: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                                    Your Contribution
                                </Typography>
                                <PersonIcon sx={{ color: "#8b5cf6", fontSize: 28 }} />
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: "#8b5cf6", mb: 1 }}>
                                {userTrashCollected.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
                                items collected by you
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={userProgress}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: "#e5e7eb",
                                    "& .MuiLinearProgress-bar": {
                                        backgroundColor: "#8b5cf6",
                                        borderRadius: 4,
                                    },
                                }}
                            />
                            <Typography variant="caption" sx={{ color: "#64748b", mt: 1, display: "block" }}>
                                {userProgress.toFixed(1)}% of goal
                            </Typography>
                        </Paper>
                    )}

                    {/* Trash Categories Card */}
                    <Paper sx={{ p: 3, borderRadius: "16px", mb: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#1e293b" }}>
                            Trash Categories
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748b", mb: 3 }}>
                            AI-powered classification (coming soon)
                        </Typography>
                        <Grid container spacing={2}>
                            {trashCategories.map((category, idx) => (
                                <Grid item xs={6} sm={4} key={idx}>
                                    <Card
                                        sx={{
                                            borderRadius: "12px",
                                            border: `2px solid ${category.color}`,
                                            boxShadow: "none",
                                            transition: "all 0.3s ease",
                                            "&:hover": {
                                                transform: "translateY(-4px)",
                                                boxShadow: `0 8px 16px ${category.color}40`,
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ textAlign: "center", p: 2 }}>
                                            <Typography variant="h4" sx={{ mb: 0.5 }}>
                                                {category.icon}
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                sx={{ fontWeight: 700, color: category.color, mb: 0.5 }}
                                            >
                                                {category.count}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: "#64748b" }}>
                                                {category.type}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>

                {/* Right Column - Action Panel */}
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: "16px",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                            position: "sticky",
                            top: 20,
                        }}
                    >
                        {!joined ? (
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#1e293b" }}>
                                    Join This Challenge
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#64748b", mb: 3 }}>
                                    Be part of the cleanup movement and make a difference!
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    onClick={handleJoin}
                                    sx={{
                                        backgroundColor: "#0ea5e9",
                                        color: "white",
                                        py: 1.5,
                                        borderRadius: "12px",
                                        textTransform: "none",
                                        fontWeight: 700,
                                        fontSize: "1rem",
                                        "&:hover": {
                                            backgroundColor: "#0284c7",
                                        },
                                    }}
                                >
                                    Join Challenge
                                </Button>
                            </Box>
                        ) : (
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#1e293b" }}>
                                    Upload Trash Photos
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#64748b", mb: 3 }}>
                                    {isActive
                                        ? "Capture your cleanup efforts and track your impact"
                                        : "This challenge has ended"}
                                </Typography>

                                {isActive && (
                                    <>
                                        <Box sx={{ mb: 3 }}>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                startIcon={<CameraAltIcon />}
                                                onClick={handleTakePhoto}
                                                sx={{
                                                    backgroundColor: "#10b981",
                                                    color: "#fff",
                                                    py: 1.5,
                                                    borderRadius: "12px",
                                                    textTransform: "none",
                                                    fontWeight: 600,
                                                    fontSize: "1rem",
                                                    mb: 1.5,
                                                    "&:hover": {
                                                        backgroundColor: "#059669",
                                                    },
                                                }}
                                            >
                                                Take Photo
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                startIcon={<CloudUploadIcon />}
                                                onClick={() => fileInputRef.current?.click()}
                                                sx={{
                                                    borderColor: "#0ea5e9",
                                                    color: "#0ea5e9",
                                                    py: 1.5,
                                                    borderRadius: "12px",
                                                    textTransform: "none",
                                                    fontWeight: 600,
                                                    fontSize: "1rem",
                                                    "&:hover": {
                                                        borderColor: "#0284c7",
                                                        backgroundColor: "#f0f9ff",
                                                    },
                                                }}
                                            >
                                                Choose from Gallery
                                            </Button>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                style={{ display: "none" }}
                                                onChange={handleFileSelect}
                                                capture="environment"
                                            />
                                        </Box>

                                        {selectedFiles.length > 0 && (
                                            <Box sx={{ mb: 3 }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ fontWeight: 600, mb: 1.5, color: "#1e293b" }}
                                                >
                                                    Selected Photos ({selectedFiles.length})
                                                </Typography>
                                                <Grid container spacing={1}>
                                                    {selectedFiles.map((file, idx) => (
                                                        <Grid item xs={6} key={idx}>
                                                            <Box
                                                                sx={{
                                                                    position: "relative",
                                                                    paddingTop: "100%",
                                                                    borderRadius: "10px",
                                                                    overflow: "hidden",
                                                                }}
                                                            >
                                                                <img
                                                                    src={URL.createObjectURL(file)}
                                                                    alt={file.name}
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: 0,
                                                                        left: 0,
                                                                        width: "100%",
                                                                        height: "100%",
                                                                        objectFit: "cover",
                                                                    }}
                                                                />
                                                                <IconButton
                                                                    onClick={() => removeFile(idx)}
                                                                    sx={{
                                                                        position: "absolute",
                                                                        top: 4,
                                                                        right: 4,
                                                                        backgroundColor: "rgba(0,0,0,0.6)",
                                                                        color: "#fff",
                                                                        padding: "4px",
                                                                        "&:hover": {
                                                                            backgroundColor: "rgba(0,0,0,0.8)",
                                                                        },
                                                                    }}
                                                                    size="small"
                                                                >
                                                                    <CloseIcon fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Box>
                                        )}

                                        <Button
                                            variant="contained"
                                            fullWidth
                                            disabled={selectedFiles.length === 0 || uploading}
                                            onClick={handleUpload}
                                            sx={{
                                                backgroundColor: "#8b5cf6",
                                                color: "white",
                                                py: 1.5,
                                                borderRadius: "12px",
                                                textTransform: "none",
                                                fontWeight: 700,
                                                fontSize: "1rem",
                                                "&:hover": {
                                                    backgroundColor: "#7c3aed",
                                                },
                                                "&:disabled": {
                                                    backgroundColor: "#e5e7eb",
                                                    color: "#94a3b8",
                                                },
                                            }}
                                        >
                                            {uploading ? "Analyzing..." : "Submit Photos"}
                                        </Button>
                                    </>
                                )}

                                {!isActive && (
                                    <Box
                                        sx={{
                                            textAlign: "center",
                                            py: 3,
                                            px: 2,
                                            backgroundColor: "#f1f5f9",
                                            borderRadius: "12px",
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                                            Uploads are only available for active challenges
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default withAuth(ChallengeDetailsPage);