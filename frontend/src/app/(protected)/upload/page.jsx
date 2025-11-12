"use client";
import React, { useState, useRef, useEffect, use } from "react";
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
    CircularProgress,
    Tabs,
    Tab,
    TextField,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import {
    CloudUpload,
    CameraAlt,
    Close,
    CheckCircle,
    EmojiEvents,
    Warning,
    ListAlt,
    Check,
    PhotoCamera,
    Recycling,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import withAuth from "@/components/auth/withAuth";
import { useJoinedChallenges } from "@/context/JoinedChallengesContext";
import { useAuthContext } from "@/context/AuthContext";
import { apiCall } from "@/utils/api";
import { trashCategories } from "@/utils/trashCategories";

function UploadPage() {
    const router = useRouter();
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const { getActiveChallenges } = useJoinedChallenges();
    const { user, loading: authLoading } = useAuthContext();

    const [selectedChallenge, setSelectedChallenge] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [showResultDialog, setShowResultDialog] = useState(false);
    const [classificationResult, setClassificationResult] = useState(null);

    const [tabValue, setTabValue] = useState(0); // 0 for AI, 1 for Manual
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [manualForm, setManualForm] = useState({
        label: '',
        itemCount: 1,
    });

    const activeChallenges = getActiveChallenges();

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setError("");
        setSuccess("");
    };

    const handleManualFormChange = (event) => {
        const { name, value } = event.target;
        setManualForm(prev => ({ ...prev, [name]: value }));
    };

    const validateFile = (file) => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        
        if (file.size > maxSize) {
            setError(`File is too large. Maximum size is 10MB.`);
            return false;
        }
        
        if (!allowedTypes.includes(file.type)) {
            setError('Only image files (JPEG, PNG, WebP) are allowed.');
            return false;
        }
        
        return true;
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setError("");
        setSuccess("");
        
        if (files.length > 0 && validateFile(files[0])) {
            setSelectedFiles(files.slice(0, 1)); // Only allow one file
        } else {
            setSelectedFiles([]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        setError("");
        setSuccess("");
        
        if (files.length > 0 && validateFile(files[0])) {
            setSelectedFiles(files.slice(0, 1)); // Only allow one file
        } else {
            setSelectedFiles([]);
        }
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
        cameraInputRef.current.click();
    };

    const handleCameraCapture = (e) => {
        const files = Array.from(e.target.files);
        setError("");
        setSuccess("");
        
        if (files.length > 0 && validateFile(files[0])) {
            setSelectedFiles(files.slice(0, 1)); // Only allow one file
        } else {
            setSelectedFiles([]);
        }
    };

    const getCategoryIcon = (label) => {
        const icons = {
            plastic_bottle: "🍾",
            metal_can: "🥫",
            plastic_bag: "🛍️",
            paper_cardboard: "📦",
            cigarette_butt: "🚬",
            glass_bottle: "🍷",
            unknown: "🗑️",
        };
        return icons[label] || "🗑️";
    };

    const getCategoryDisplayName = (label) => {
        const names = {
            plastic_bottle: "Plastic Bottle",
            metal_can: "Metal Can",
            plastic_bag: "Plastic Bag",
            paper_cardboard: "Paper/Cardboard",
            cigarette_butt: "Cigarette Butt",
            glass_bottle: "Glass Bottle",
            unknown: "Unknown Trash",
        };
        return names[label] || "Unknown Trash";
    };

    const handleCloseResultDialog = () => {
        setShowResultDialog(false);
        setClassificationResult(null);
        // Redirect to challenge details after closing
        if (selectedChallenge) {
            router.push(`/challenges/${selectedChallenge}`);
        }
    };

    // --- FIX: Updated handleSubmit for SYNCHRONOUS flow ---
    const handleSubmit = async () => {
        if (!selectedChallenge) {
            setError("Please select a challenge first!");
            return;
        }
        if (selectedFiles.length === 0) {
            setError("Please select at least one photo!");
            return;
        }
        if (!user) {
            setError("You must be logged in to upload.");
            return;
        }

        setUploading(true);
        setError("");
        setSuccess("");

        try {
            const formData = new FormData();
            formData.append("challengeId", selectedChallenge);
            formData.append("image", selectedFiles[0]);

            const res = await apiCall(
                'post',
                `${process.env.NEXT_PUBLIC_API_URL}/api/cleanups/upload`,
                formData,
                true // force refresh token
            );

            // The backend now returns a 200 with the result
            const result = res.data.result || { label: 'unknown', confidence: 0 };
            setClassificationResult(result);
            setShowResultDialog(true);
            setSelectedFiles([]);

        } catch (err) {
            console.error("AI Upload error:", err);
            setError(err.response?.data?.message || "An error occurred during upload.");
        } finally {
            setUploading(false);
        }
    };
    // --- END FIX ---

    const handleManualSubmit = async () => {
        if (!selectedChallenge) {
            setError("Please select a challenge first!");
            return;
        }
        if (!manualForm.label) {
            setError("Please select a trash category.");
            return;
        }
        const count = parseInt(manualForm.itemCount, 10);
        if (isNaN(count) || count <= 0) {
            setError("Please enter a valid item count.");
            return;
        }
        if (!user) {
            setError("You must be logged in to log a cleanup.");
            return;
        }

        setUploading(true);
        setError("");
        setSuccess("");

        try {
            const payload = {
                challengeId: selectedChallenge,
                label: manualForm.label,
                itemCount: count,
            };

            const res = await apiCall(
                'post',
                `${process.env.NEXT_PUBLIC_API_URL}/api/cleanups/manual`,
                payload,
                true // force refresh token
            );

            const displayMessage = `${res.data.message} - Category counts updated instantly!`;
            setSuccess(displayMessage);
            setManualForm({ label: '', itemCount: 1 }); // Reset form

            // Show success for 2 seconds, then redirect to challenge details
            setTimeout(() => {
                router.push(`/challenges/${selectedChallenge}`);
            }, 2000);

        } catch (err) {
            console.error("Manual Log error:", err);
            setError(err.response?.data?.message || "An error occurred while logging.");
        } finally {
            setUploading(false);
        }
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
                        Log Your Cleanup
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
                        Choose AI-powered photo upload or log your items manually.
                    </Typography>
                </Box>

                <Grid container spacing={3} justifyContent="center">
                    {/* Main Column - Upload */}
                    <Grid item xs={12} md={10} lg={8}>
                        {/* Challenge Selection */}
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
                                        1. Select Your Challenge
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
                                    Join an active challenge to start logging your cleanup!
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

                        {/* --- Tabs for AI / Manual --- */}
                        <Paper
                            sx={{
                                p: { xs: 2, sm: 3 },
                                mb: 3,
                                borderRadius: "20px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            }}
                        >
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                                <Tabs value={tabValue} onChange={handleTabChange} centered>
                                    <Tab icon={<CameraAlt />} iconPosition="start" label="AI Upload (1 Photo)" />
                                    <Tab icon={<ListAlt />} iconPosition="start" label="Log Manually" />
                                </Tabs>
                            </Box>

                            {/* --- AI Upload Panel --- */}
                            {tabValue === 0 && (
                                <Box>
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
                                        }}
                                    >
                                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                            <Box sx={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)", display: "flex", alignItems: "center", justifyContent: "center", mb: 1, boxShadow: "0 8px 24px rgba(14, 165, 233, 0.3)" }}>
                                                <CloudUpload sx={{ fontSize: 40, color: "white" }} />
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0d1b2a" }}>
                                                Drop your photo here
                                            </Typography>
                                            {/* --- FIX: Updated text --- */}
                                            <Typography variant="body2" sx={{ color: "#64748b", mb: 1 }}>
                                                Upload one photo of a single item or small pile.
                                            </Typography>
                                            {/* --- END FIX --- */}
                                            
                                            {/* Action Buttons Row */}
                                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<CloudUpload />}
                                                    onClick={() => fileInputRef.current?.click()}
                                                    sx={{ borderColor: "#0ea5e9", borderWidth: 2, color: "#0ea5e9", px: 3, py: 1.5, borderRadius: "12px", textTransform: "none", fontWeight: 700, fontSize: "1rem", "&:hover": { borderWidth: 2, borderColor: "#0284c7", backgroundColor: "#f0f9ff" } }}
                                                >
                                                    Choose File
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<PhotoCamera />}
                                                    onClick={handleTakePhoto}
                                                    sx={{ 
                                                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                                        color: "white",
                                                        px: 3, 
                                                        py: 1.5, 
                                                        borderRadius: "12px", 
                                                        textTransform: "none", 
                                                        fontWeight: 700, 
                                                        fontSize: "1rem",
                                                        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                                                        "&:hover": { 
                                                            background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                                                            boxShadow: "0 6px 16px rgba(16, 185, 129, 0.4)",
                                                        } 
                                                    }}
                                                >
                                                    Take Photo
                                                </Button>
                                            </Box>
                                            
                                            <Typography variant="caption" sx={{ color: "#94a3b8", mt: 1 }}>
                                                Supports: JPG, PNG • Max size: 10MB
                                            </Typography>
                                        </Box>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            onChange={handleFileSelect}
                                        />
                                        <input
                                            ref={cameraInputRef}
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            style={{ display: "none" }}
                                            onChange={handleCameraCapture}
                                        />
                                    </Paper>

                                    {selectedFiles.length > 0 && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0d1b2a", mb: 2 }}>
                                                Selected Photo
                                            </Typography>
                                            
                                            {/* Display filename */}
                                            <Paper sx={{ p: 2, mb: 2, borderRadius: "12px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                                                <List dense>
                                                    {selectedFiles.map((file, index) => (
                                                        <ListItem key={index} sx={{ px: 0 }}>
                                                            <ListItemIcon>
                                                                <CheckCircle sx={{ color: "#10b981" }} />
                                                            </ListItemIcon>
                                                            <ListItemText 
                                                                primary={file.name}
                                                                secondary={`${(file.size / 1024).toFixed(2)} KB`}
                                                                primaryTypographyProps={{ fontWeight: 600, fontSize: "0.95rem" }}
                                                                secondaryTypographyProps={{ fontSize: "0.85rem" }}
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Paper>
                                            
                                            <Grid container spacing={2}>
                                                {selectedFiles.map((file, index) => (
                                                    <Grid item xs={6} sm={4} key={index}>
                                                        <Box sx={{ position: "relative", paddingTop: "100%", borderRadius: "16px", overflow: "hidden", backgroundColor: "#f1f5f9", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                                                            <img src={URL.createObjectURL(file)} alt={file.name} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                                                            <IconButton onClick={() => removeFile(index)} sx={{ position: "absolute", top: 8, right: 8, backgroundColor: "rgba(239, 68, 68, 0.95)", color: "#fff", width: 32, height: 32, "&:hover": { backgroundColor: "#dc2626" } }}>
                                                                <Close fontSize="small" />
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
                                        size="large"
                                        disabled={!selectedChallenge || uploading || selectedFiles.length === 0}
                                        onClick={handleSubmit}
                                        sx={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", color: "white", py: 2, borderRadius: "14px", textTransform: "none", fontWeight: 700, fontSize: "1.125rem", boxShadow: "0 8px 24px rgba(139, 92, 246, 0.3)", "&:hover": { background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" }, "&:disabled": { background: "#e2e8f0", color: "#94a3b8", boxShadow: "none" } }}
                                    >
                                        {uploading ? <CircularProgress size={26} color="inherit" /> : "Submit & Classify"}
                                    </Button>
                                </Box>
                            )}

                            {/* --- Manual Log Panel --- */}
                            {tabValue === 1 && (
                                <Box>
                                    <Alert severity="info" icon={<Warning />} sx={{ mb: 3, borderRadius: "12px" }}>
                                        Use this form if AI fails or to log a large number of items of the same type.
                                    </Alert>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={8}>
                                            <FormControl fullWidth>
                                                <InputLabel>Trash Category</InputLabel>
                                                <Select
                                                    name="label"
                                                    value={manualForm.label}
                                                    label="Trash Category"
                                                    onChange={handleManualFormChange}
                                                >
                                                    {trashCategories.map((cat) => (
                                                        <MenuItem key={cat.key} value={cat.key}>
                                                            <span style={{ marginRight: '10px' }}>{cat.icon}</span> {cat.displayName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                name="itemCount"
                                                label="Item Count"
                                                type="number"
                                                fullWidth
                                                value={manualForm.itemCount}
                                                onChange={handleManualFormChange}
                                                inputProps={{ min: 1 }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={!selectedChallenge || uploading}
                                        onClick={handleManualSubmit}
                                        sx={{ mt: 3, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "white", py: 2, borderRadius: "14px", textTransform: "none", fontWeight: 700, fontSize: "1.125rem", boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)", "&:hover": { background: "linear-gradient(135deg, #059669 0%, #047857 100%)" }, "&:disabled": { background: "#e2e8f0", color: "#94a3b8", boxShadow: "none" } }}
                                    >
                                        {uploading ? <CircularProgress size={26} color="inherit" /> : "Log Cleanup Manually"}
                                    </Button>
                                </Box>
                            )}

                            {/* --- Error / Success Messages --- */}
                            {error && (
                                <Alert severity="error" sx={{ mt: 3, borderRadius: "12px" }}>
                                    {error}
                                </Alert>
                            )}
                            {success && (
                                <Alert severity="success" icon={<Check />} sx={{ mt: 3, borderRadius: "12px" }}>
                                    {success}
                                </Alert>
                            )}

                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Classification Result Dialog */}
            <Dialog 
                open={showResultDialog} 
                onClose={handleCloseResultDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: "20px",
                        p: 2,
                    }
                }}
            >
                <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <Box sx={{ 
                            width: 80, 
                            height: 80, 
                            borderRadius: "50%", 
                            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)"
                        }}>
                            <CheckCircle sx={{ fontSize: 48, color: "white" }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: "#0d1b2a" }}>
                            Successfully Classified!
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {classificationResult && (
                        <Box sx={{ textAlign: "center", py: 2 }}>
                            <Typography variant="h2" sx={{ fontSize: "4rem", mb: 2 }}>
                                {getCategoryIcon(classificationResult.label)}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: "#0ea5e9", mb: 1 }}>
                                {getCategoryDisplayName(classificationResult.label)}
                            </Typography>
                            <Chip 
                                icon={<Recycling />}
                                label={`${(classificationResult.confidence * 100).toFixed(1)}% confident`}
                                sx={{ 
                                    backgroundColor: "#e0f2fe", 
                                    color: "#0369a1", 
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    py: 2.5,
                                    mt: 2
                                }}
                            />
                            <Alert severity="success" sx={{ mt: 3, borderRadius: "12px" }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    Your cleanup has been logged and category counts updated!
                                </Typography>
                            </Alert>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                    <Button 
                        onClick={handleCloseResultDialog}
                        variant="contained"
                        size="large"
                        sx={{ 
                            background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                            color: "white",
                            px: 4,
                            py: 1.5,
                            borderRadius: "12px",
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "1rem",
                            "&:hover": {
                                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"
                            }
                        }}
                    >
                        View Challenge Details
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default withAuth(UploadPage);

