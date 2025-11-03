"use client";
import React, { useState, useRef } from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    Paper,
    Grid,
    IconButton,
    Card,
    CardContent,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Chip,
    Alert,
} from "@mui/material";
import {
    CloudUpload,
    CameraAlt,
    Close,
    CheckCircle,
    EmojiEvents,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import withAuth from "@/components/auth/withAuth";
import { useJoinedChallenges } from "@/context/JoinedChallengesContext";

function UploadPage() {
    const router = useRouter();
    const fileInputRef = useRef(null);
    const { getActiveChallenges } = useJoinedChallenges();

    const [selectedChallenge, setSelectedChallenge] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    const activeChallenges = getActiveChallenges();

    const wasteTypes = [
        { icon: "🥤", label: "Plastic Bottles" },
        { icon: "🥫", label: "Metal Cans" },
        { icon: "🛍️", label: "Plastic Bags" },
        { icon: "📄", label: "Paper/Cardboard" },
        { icon: "🚬", label: "Cigarette Butts" },
        { icon: "🍾", label: "Glass Bottles" },
    ];

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles((prev) => [...prev, ...files]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        setSelectedFiles((prev) => [...prev, ...files]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const removeFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleTakePhoto = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = () => {
        if (!selectedChallenge) {
            alert("Please select a challenge first!");
            return;
        }
        if (selectedFiles.length === 0) {
            alert("Please select at least one photo!");
            return;
        }

        setUploading(true);
        setTimeout(() => {
            alert(`Successfully uploaded ${selectedFiles.length} photo(s) to challenge!`);
            setSelectedFiles([]);
            setUploading(false);
        }, 2000);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
                pb: 4,
            }}
        >
            <Container maxWidth="xl" sx={{ pt: { xs: 2, sm: 3, md: 4 } }}>
                {/* Header */}
                <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 4 } }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            color: "#0d1b2a",
                            mb: 1.5,
                            fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
                        }}
                    >
                        📸 Upload Cleanup Photos
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#64748b",
                            maxWidth: 700,
                            mx: "auto",
                            fontSize: { xs: "0.95rem", sm: "1.05rem" },
                            px: 2,
                        }}
                    >
                        Our AI automatically identifies and classifies waste from your photos.
                        Select a challenge and start contributing!
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {/* Left Column - Challenge Selection & Upload */}
                    <Grid item xs={12} lg={8}>
                        {/* Active Challenges Selection */}
                        {activeChallenges.length > 0 ? (
                            <Paper
                                sx={{
                                    p: { xs: 2.5, sm: 3.5 },
                                    mb: 3,
                                    borderRadius: "20px",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                                    <EmojiEvents sx={{ color: "#f59e0b", fontSize: 28, mr: 1.5 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                                        Select Your Challenge
                                    </Typography>
                                </Box>

                                {/* Desktop: Cards Grid */}
                                <Box sx={{ display: { xs: "none", md: "block" } }}>
                                    <Grid container spacing={2}>
                                        {activeChallenges.map((challenge) => (
                                            <Grid item xs={12} sm={6} key={challenge._id}>
                                                <Card
                                                    onClick={() => setSelectedChallenge(challenge._id)}
                                                    sx={{
                                                        cursor: "pointer",
                                                        borderRadius: "16px",
                                                        border:
                                                            selectedChallenge === challenge._id
                                                                ? "3px solid #0ea5e9"
                                                                : "2px solid #e5e7eb",
                                                        backgroundColor:
                                                            selectedChallenge === challenge._id
                                                                ? "#f0f9ff"
                                                                : "white",
                                                        transition: "all 0.3s ease",
                                                        "&:hover": {
                                                            transform: "translateY(-4px)",
                                                            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                                                        },
                                                    }}
                                                >
                                                    <CardContent sx={{ p: 2.5 }}>
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                alignItems: "flex-start",
                                                                mb: 1.5,
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="subtitle1"
                                                                sx={{ fontWeight: 700, color: "#1e293b", flex: 1 }}
                                                            >
                                                                {challenge.title}
                                                            </Typography>
                                                            {selectedChallenge === challenge._id && (
                                                                <CheckCircle sx={{ color: "#0ea5e9", fontSize: 24 }} />
                                                            )}
                                                        </Box>
                                                        <Typography variant="body2" sx={{ color: "#64748b", mb: 1 }}>
                                                            📍 {challenge.region || challenge.locationName}
                                                        </Typography>
                                                        <Chip
                                                            label={`${challenge.totalTrashCollected.toLocaleString()} / ${challenge.goal.toLocaleString()} items`}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: "#e0f2fe",
                                                                color: "#0369a1",
                                                                fontWeight: 600,
                                                            }}
                                                        />
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>

                                {/* Mobile: Dropdown */}
                                <Box sx={{ display: { xs: "block", md: "none" } }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Select Challenge</InputLabel>
                                        <Select
                                            value={selectedChallenge}
                                            label="Select Challenge"
                                            onChange={(e) => setSelectedChallenge(e.target.value)}
                                        >
                                            {activeChallenges.map((challenge) => (
                                                <MenuItem key={challenge._id} value={challenge._id}>
                                                    {challenge.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Paper>
                        ) : (
                            <Alert
                                severity="info"
                                sx={{
                                    mb: 3,
                                    borderRadius: "16px",
                                    "& .MuiAlert-message": { width: "100%" },
                                }}
                            >
                                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                                    No Active Challenges Yet
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    Join an active challenge to start uploading your cleanup photos!
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => router.push("/challenges")}
                                    sx={{
                                        textTransform: "none",
                                        fontWeight: 600,
                                        backgroundColor: "#0ea5e9",
                                        "&:hover": { backgroundColor: "#0284c7" },
                                    }}
                                >
                                    Browse Challenges
                                </Button>
                            </Alert>
                        )}

                        {/* Upload Zone */}
                        <Paper
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            sx={{
                                p: { xs: 3, sm: 4 },
                                mb: 3,
                                borderRadius: "20px",
                                border: isDragging ? "3px dashed #0ea5e9" : "2px dashed #cbd5e1",
                                backgroundColor: isDragging ? "#f0f9ff" : "#fff",
                                transition: "all 0.3s ease",
                                textAlign: "center",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mb: 1,
                                        boxShadow: "0 8px 24px rgba(14, 165, 233, 0.3)",
                                    }}
                                >
                                    <CloudUpload sx={{ fontSize: 40, color: "white" }} />
                                </Box>

                                <Typography variant="h6" sx={{ fontWeight: 700, color: "#0d1b2a" }}>
                                    Drop your photos here
                                </Typography>

                                <Typography variant="body2" sx={{ color: "#64748b", mb: 1 }}>
                                    or use the buttons below
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 2,
                                        flexWrap: "wrap",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        startIcon={<CameraAlt />}
                                        onClick={handleTakePhoto}
                                        sx={{
                                            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                            color: "#fff",
                                            px: 3,
                                            py: 1.5,
                                            borderRadius: "12px",
                                            textTransform: "none",
                                            fontWeight: 700,
                                            fontSize: "1rem",
                                            boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
                                            "&:hover": {
                                                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                                            },
                                        }}
                                    >
                                        Take Photo
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        startIcon={<CloudUpload />}
                                        onClick={() => fileInputRef.current?.click()}
                                        sx={{
                                            borderColor: "#0ea5e9",
                                            borderWidth: 2,
                                            color: "#0ea5e9",
                                            px: 3,
                                            py: 1.5,
                                            borderRadius: "12px",
                                            textTransform: "none",
                                            fontWeight: 700,
                                            fontSize: "1rem",
                                            "&:hover": {
                                                borderWidth: 2,
                                                borderColor: "#0284c7",
                                                backgroundColor: "#f0f9ff",
                                            },
                                        }}
                                    >
                                        Choose Files
                                    </Button>
                                </Box>

                                <Typography variant="caption" sx={{ color: "#94a3b8", mt: 1 }}>
                                    Supports: JPG, PNG, HEIC • Max size: 10MB per file
                                </Typography>
                            </Box>

                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleFileSelect}
                                capture="environment"
                            />
                        </Paper>

                        {/* Selected Files Preview */}
                        {selectedFiles.length > 0 && (
                            <Paper
                                sx={{
                                    p: 3,
                                    mb: 3,
                                    borderRadius: "20px",
                                    backgroundColor: "#fff",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 2,
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#0d1b2a" }}>
                                        Selected Photos ({selectedFiles.length})
                                    </Typography>
                                    <Button
                                        size="small"
                                        onClick={() => setSelectedFiles([])}
                                        sx={{ color: "#ef4444", textTransform: "none", fontWeight: 600 }}
                                    >
                                        Clear All
                                    </Button>
                                </Box>
                                <Grid container spacing={2}>
                                    {selectedFiles.map((file, index) => (
                                        <Grid item xs={6} sm={4} md={3} key={index}>
                                            <Box
                                                sx={{
                                                    position: "relative",
                                                    paddingTop: "100%",
                                                    borderRadius: "16px",
                                                    overflow: "hidden",
                                                    backgroundColor: "#f1f5f9",
                                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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
                                                    onClick={() => removeFile(index)}
                                                    sx={{
                                                        position: "absolute",
                                                        top: 8,
                                                        right: 8,
                                                        backgroundColor: "rgba(239, 68, 68, 0.95)",
                                                        color: "#fff",
                                                        width: 32,
                                                        height: 32,
                                                        "&:hover": {
                                                            backgroundColor: "#dc2626",
                                                        },
                                                    }}
                                                >
                                                    <Close fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={!selectedChallenge || uploading}
                                    onClick={handleSubmit}
                                    sx={{
                                        mt: 3,
                                        background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                                        color: "white",
                                        py: 2,
                                        borderRadius: "14px",
                                        textTransform: "none",
                                        fontWeight: 700,
                                        fontSize: "1.125rem",
                                        boxShadow: "0 8px 24px rgba(139, 92, 246, 0.3)",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                                        },
                                        "&:disabled": {
                                            background: "#e2e8f0",
                                            color: "#94a3b8",
                                            boxShadow: "none",
                                        },
                                    }}
                                >
                                    {uploading ? "Analyzing Photos..." : "Submit Photos"}
                                </Button>
                            </Paper>
                        )}
                    </Grid>

                    {/* Right Column - Info Sidebar */}
                    <Grid item xs={12} lg={4}>
                        {/* How It Works */}
                        <Paper
                            sx={{
                                p: { xs: 2.5, sm: 3 },
                                mb: 3,
                                borderRadius: "20px",
                                backgroundColor: "#fff",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0d1b2a", mb: 3 }}>
                                How It Works
                            </Typography>

                            {[
                                {
                                    step: "1",
                                    title: "Select Challenge",
                                    desc: "Choose which cleanup challenge to contribute to",
                                    color: "#f59e0b",
                                },
                                {
                                    step: "2",
                                    title: "Upload Photos",
                                    desc: "Take photos of collected waste items",
                                    color: "#10b981",
                                },
                                {
                                    step: "3",
                                    title: "AI Analysis",
                                    desc: "Our AI identifies and counts waste types",
                                    color: "#8b5cf6",
                                },
                                {
                                    step: "4",
                                    title: "Track Impact",
                                    desc: "See your contribution to the challenge",
                                    color: "#0ea5e9",
                                },
                            ].map((item, index) => (
                                <Box key={index} sx={{ display: "flex", gap: 2, mb: index < 3 ? 3 : 0 }}>
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "12px",
                                            backgroundColor: `${item.color}20`,
                                            color: item.color,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 800,
                                            fontSize: "1.25rem",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {item.step}
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: 700, color: "#0d1b2a", mb: 0.5 }}
                                        >
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.5 }}>
                                            {item.desc}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Paper>

                        {/* Detectable Waste Types */}
                        <Paper
                            sx={{
                                p: { xs: 2.5, sm: 3 },
                                borderRadius: "20px",
                                backgroundColor: "#fff",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0d1b2a", mb: 3 }}>
                                Detectable Waste Types
                            </Typography>

                            <Grid container spacing={1.5}>
                                {wasteTypes.map((type, index) => (
                                    <Grid item xs={6} key={index}>
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: "12px",
                                                backgroundColor: "#f8fafc",
                                                border: "1px solid #e2e8f0",
                                                textAlign: "center",
                                                transition: "all 0.3s ease",
                                                "&:hover": {
                                                    backgroundColor: "#f0f9ff",
                                                    borderColor: "#0ea5e9",
                                                    transform: "translateY(-2px)",
                                                },
                                            }}
                                        >
                                            <Typography sx={{ fontSize: "2rem", mb: 0.5 }}>
                                                {type.icon}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{ color: "#475569", fontWeight: 600, fontSize: "0.75rem" }}
                                            >
                                                {type.label}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default withAuth(UploadPage);