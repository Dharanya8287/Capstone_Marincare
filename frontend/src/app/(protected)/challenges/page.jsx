"use client";
import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Container,
    Typography,
    CircularProgress,
    useMediaQuery,
    useTheme,
    IconButton,
    MenuItem,
    FormControl,
    Select,
    InputLabel,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import axios from "axios";
import {
    PageContainerStyle,
    HeaderBoxStyle,
    HeaderTitleStyle,
    HeaderSubtitleStyle,
} from "./challenge.styles";

import StatsCard from "@/components/common/StatCard";
import ChallengeCard from "@/components/cards/challengeCard";
import CTASection from "@/components/sections/CTASection";
import withAuth from "@/components/auth/withAuth";

// Import mock data as fallback
import { challenges as mockChallenges, mockStats, regions as regionList } from "@/data/challenges";

function ChallengesPage() {
    const [challenges, setChallenges] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedRegion, setSelectedRegion] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const activeScrollRef = useRef(null);
    const upcomingScrollRef = useRef(null);
    const completedScrollRef = useRef(null);

    // RegionList
    const uniqueRegions = ["All", ...new Set(regionList.filter((r) => r && r !== "All"))];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [challengesRes, statsRes] = await Promise.all([
                    axios.get("/api/challenges"),
                    axios.get("/api/challenges/stats"),
                ]);
                setChallenges(challengesRes.data || []);
                setStats(statsRes.data || mockStats);
            } catch (apiError) {
                console.warn("Using mock data:", apiError.message);
                setChallenges(mockChallenges);
                setStats(mockStats);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Safer filter logic
    const filterChallenges = (challengeList) => {
        let filtered = [...challengeList];
        if (selectedRegion !== "All") {
            filtered = filtered.filter((c) => c.region?.toLowerCase() === selectedRegion.toLowerCase());
        }
        if (selectedStatus !== "All") {
            filtered = filtered.filter((c) => c.status?.toLowerCase() === selectedStatus.toLowerCase());
        }
        return filtered;
    };

    const activeChallenges = filterChallenges(challenges.filter((c) => c.status?.toLowerCase() === "active"));
    const upcomingChallenges = filterChallenges(challenges.filter((c) => c.status?.toLowerCase() === "upcoming"));
    const completedChallenges = filterChallenges(challenges.filter((c) => c.status?.toLowerCase() === "completed"));

    // Scroll handler
    const scroll = (ref, direction) => {
        if (ref.current) {
            const scrollAmount = 400;
            ref.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    // Scrollable section
    const ScrollableRow = ({ title, icon, challenges, scrollRef }) => {
        if (challenges.length === 0) return null;

        return (
            <Box sx={{ mb: 6 }}>
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 3,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {icon}
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: "#1e293b",
                                fontSize: { xs: "1.125rem", sm: "1.25rem" },
                            }}
                        >
                            {title}
                        </Typography>
                    </Box>

                    {!isMobile && (
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton
                                onClick={() => scroll(scrollRef, "left")}
                                sx={{
                                    backgroundColor: "#f1f5f9",
                                    "&:hover": { backgroundColor: "#e2e8f0" },
                                }}
                            >
                                <ChevronLeftIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => scroll(scrollRef, "right")}
                                sx={{
                                    backgroundColor: "#f1f5f9",
                                    "&:hover": { backgroundColor: "#e2e8f0" },
                                }}
                            >
                                <ChevronRightIcon />
                            </IconButton>
                        </Box>
                    )}
                </Box>

                {/* Cards */}
                <Box
                    ref={scrollRef}
                    sx={{
                        display: "flex",
                        gap: 3,
                        overflowX: "auto",
                        overflowY: "hidden",
                        pb: 2,
                        "&::-webkit-scrollbar": { height: "8px" },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#cbd5e1",
                            borderRadius: "10px",
                        },
                    }}
                >
                    {challenges.map((challenge, i) => (
                        <Box
                            key={challenge._id || i}
                            sx={{
                                minWidth: { xs: "280px", sm: "340px", md: "360px" },
                                maxWidth: { xs: "280px", sm: "340px", md: "360px" },
                            }}
                        >
                            <ChallengeCard challenge={challenge} />
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={PageContainerStyle}>
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={HeaderBoxStyle}>
                    <Typography variant={isMobile ? "h5" : "h4"} sx={HeaderTitleStyle}>
                        🌊 Cleanup Challenges
                    </Typography>
                    <Typography variant={isMobile ? "body2" : "body1"} sx={HeaderSubtitleStyle}>
                        Join hands in restoring our coastlines — every cleanup counts!
                    </Typography>
                </Box>

                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "50vh",
                        }}
                    >
                        <CircularProgress size={60} />
                    </Box>
                ) : (
                    <>
                        <StatsCard stats={stats} />

                        {/* Filters */}
                        <Box
                            sx={{
                                mb: 5,
                                p: 3,
                                backgroundColor: "white",
                                borderRadius: "16px",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2,
                            }}
                        >
                            {/* Region */}
                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel>Filter by Region</InputLabel>
                                <Select
                                    value={selectedRegion}
                                    label="Filter by Region"
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                >
                                    {uniqueRegions.map((region) => (
                                        <MenuItem key={region} value={region}>
                                            {region}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Status */}
                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel>Filter by Status</InputLabel>
                                <Select
                                    value={selectedStatus}
                                    label="Filter by Status"
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    {["All", "Active", "Upcoming", "Completed"].map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Sections */}
                        <ScrollableRow
                            title="Active Challenges"
                            icon={<TrendingUpIcon sx={{ fontSize: 28, color: "#10b981" }} />}
                            challenges={activeChallenges}
                            scrollRef={activeScrollRef}
                        />

                        <ScrollableRow
                            title="Upcoming Challenges"
                            icon={<ScheduleIcon sx={{ fontSize: 28, color: "#f59e0b" }} />}
                            challenges={upcomingChallenges}
                            scrollRef={upcomingScrollRef}
                        />

                        <ScrollableRow
                            title="Completed Challenges"
                            icon={<CheckCircleIcon sx={{ fontSize: 28, color: "#6b7280" }} />}
                            challenges={completedChallenges}
                            scrollRef={completedScrollRef}
                        />

                        <CTASection />
                    </>
                )}
            </Container>
        </Box>
    );
}

export default withAuth(ChallengesPage);
