"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import withAuth from '@/components/auth/withAuth';
import { useAuthContext } from '@/context/AuthContext';
import { Box, Typography, Grid, Card, CircularProgress } from "@mui/material";
import { apiCall } from "@/utils/api";

import {
    HeroSection,
    HeroOverlay,
    HeroTag,
    HeroTitle,
    HeroDesc,
    HeroButtons,
    PrimaryButton,
    OutlineButton,
    StatsBox,
    WorkSection,
    WorkBadge,
    WorkGrid,
    WorkCard,
    CleanSection,
    CleanBox,
    CleanText,
    MissionSection,
    MissionContent,
    MissionButton,
} from "./home.styles";

function HomePage() {
    const router = useRouter();
    const { user: authUser, authVersion } = useAuthContext(); // Get Firebase auth user and version
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        totalItemsCollected: 0,
        activeContributors: 0,
        liveChallenges: 0,
        totalWasteKg: 0,
        beachesCleaned: 0
    });
    const [loading, setLoading] = useState(true);
    const [userLoading, setUserLoading] = useState(true);

    // Fetch user profile - re-runs when authenticated user changes
    useEffect(() => {
        const fetchUserProfile = async () => {
            // Reset user state when starting fetch
            setUserLoading(true);
            setUser(null);
            
            try {
                const response = await apiCall('get', `${process.env.NEXT_PUBLIC_API_URL}/api/profile`);
                if (response?.data) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            } finally {
                setUserLoading(false);
            }
        };

        // Only fetch if we have an authenticated user
        if (authUser?.uid) {
            fetchUserProfile();
        } else {
            // Clear user data if no auth user
            setUser(null);
            setUserLoading(false);
        }
    }, [authUser?.uid, authVersion]); // Re-fetch when auth user UID or version changes

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/home/stats`);
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Error fetching home stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Determine if user is first-time (no cleanups) or returning user
    const isFirstTimeUser = user && user.totalCleanups === 0;
    
    // Get greeting based on time of day
    const getTimeBasedGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    // Get user's first name or fallback to "there"
    const getFirstName = () => {
        if (!user || !user.name) return "there";
        return user.name.split(" ")[0];
    };

    const greeting = getTimeBasedGreeting();
    const firstName = getFirstName();

    return (
        <>

            {/* HERO SECTION */}
            <HeroSection>
                <HeroOverlay>
                    <HeroTag>WaveGuard Platform</HeroTag>
                    <HeroTitle>
                        {userLoading ? (
                            <>
                                Welcome to Your <br />
                                <span style={{ color: "#67e8c3" }}>Impact Dashboard</span>
                            </>
                        ) : isFirstTimeUser ? (
                            <>
                                {greeting}, {firstName}! <br />
                                <span style={{ color: "#67e8c3" }}>Welcome to WaveGuard</span>
                            </>
                        ) : (
                            <>
                                Welcome Back, {firstName}! <br />
                                <span style={{ color: "#67e8c3" }}>Your Impact Continues</span>
                            </>
                        )}
                    </HeroTitle>
                    <HeroDesc>
                        {userLoading ? (
                            <>
                                Track your contributions, join cleanup challenges, and connect with 
                                volunteers making a difference. Your efforts are creating real change 
                                across Canada's coastlines.
                            </>
                        ) : isFirstTimeUser ? (
                            <>
                                Ready to make your first impact? Join cleanup challenges, upload your contributions, 
                                and track your progress. Let's protect Canada's 243,042 km of coastline together!
                            </>
                        ) : (
                            <>
                                Continue making a difference! You've collected {user?.totalItemsCollected || 0} items 
                                across {user?.totalCleanups || 0} cleanups. Every contribution helps protect our oceans.
                            </>
                        )}
                    </HeroDesc>
                    <HeroButtons>
                        <PrimaryButton onClick={() => router.push('/challenges')}>
                            Browse Challenges
                        </PrimaryButton>
                        <OutlineButton onClick={() => router.push('/upload')}>
                            Upload Cleanup
                        </OutlineButton>
                    </HeroButtons>

                    <StatsBox>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <CircularProgress size={30} sx={{ color: '#fff' }} />
                            </Box>
                        ) : (
                            <>
                                <Box>
                                    <Typography variant="h5" color="#fff" fontWeight={700}>
                                        {stats.totalItemsCollected.toLocaleString()}
                                    </Typography>
                                    <Typography color="#d0eaf0">Total Items Classified</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h5" color="#fff" fontWeight={700}>
                                        {stats.activeContributors.toLocaleString()}
                                    </Typography>
                                    <Typography color="#d0eaf0">Active Contributors</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h5" color="#fff" fontWeight={700}>
                                        {stats.liveChallenges}
                                    </Typography>
                                    <Typography color="#d0eaf0">Live Challenges</Typography>
                                </Box>
                            </>
                        )}
                    </StatsBox>
                </HeroOverlay>
            </HeroSection>

            {/* HOW TO USE THE APP */}
            <WorkSection>
                <WorkBadge>Getting Started</WorkBadge>
                <Typography variant="h4" fontWeight={700} color="#003554" mb={1}>
                    How to Use WaveGuard
                </Typography>
                <Typography color="#004b63" mb={6} maxWidth="700px" margin="0 auto 48px">
                    Follow these simple steps to start making an impact. Our AI-powered platform 
                    makes it easy to track and share your cleanup efforts.
                </Typography>

                <WorkGrid>
                    {[
                        {
                            img: "/images/challenges.png",
                            title: "1. Join a Challenge",
                            desc: "Browse active cleanup challenges in your area and join the ones that interest you.",
                        },
                        {
                            img: "/images/cleanup-optimized.webp",
                            title: "2. Collect Waste",
                            desc: "Participate in beach or shoreline cleanups and collect marine debris.",
                        },
                        {
                            img: "/images/ai-detection.png",
                            title: "3. Upload & Classify",
                            desc: "Take photos of collected items. Our AI instantly identifies and categorizes waste types.",
                        },
                        {
                            img: "/images/track.png",
                            title: "4. Track Impact",
                            desc: "View your statistics, earn badges, and see how you're contributing to ocean conservation.",
                        },
                    ].map((card, i) => (
                        <WorkCard key={i}>
                            <Image src={card.img} alt={card.title} width={64} height={64} />
                            <Typography variant="h6" color="#0077b6" mt={1} mb={1}>
                                {card.title}
                            </Typography>
                            <Typography color="#004b63" fontSize="14px" lineHeight={1.6}>
                                {card.desc}
                            </Typography>
                        </WorkCard>
                    ))}
                </WorkGrid>
            </WorkSection>

            {/* COMMUNITY STATS */}
            <CleanSection>
                <CleanBox>
                    <Box sx={{ maxWidth: 500, textAlign: 'center' }}>
                        <Image
                            src="/images/community.png"
                            alt="Community Impact"
                            width={280}
                            height={280}
                            style={{ borderRadius: 12 }}
                        />
                    </Box>
                    <CleanText>
                        <span className="badge">Our Community</span>
                        <h3>Volunteer Contributions So Far</h3>
                        <p>
                            Together, our community has made incredible progress in protecting 
                            Canada's coastlines. Here's what we've accomplished as a team.
                        </p>
                        <Box sx={{ mt: 3 }}>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                                    <CircularProgress size={30} />
                                </Box>
                            ) : (
                                [
                                    { label: "Items Collected & Classified", value: stats.totalItemsCollected.toLocaleString(), color: "#0077b6" },
                                    { label: "Total Waste Removed", value: `${stats.totalWasteKg.toLocaleString()} kg`, color: "#00a6d6" },
                                    { label: "Active Volunteers This Month", value: stats.activeContributors.toLocaleString(), color: "#67e8c3" },
                                    { label: "Beaches & Shorelines Cleaned", value: stats.beachesCleaned.toLocaleString(), color: "#51cf66" },
                                ].map((stat, i) => (
                                    <Box key={i} sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography variant="body2" fontWeight={600} color="#003554">
                                                {stat.label}
                                            </Typography>
                                            <Typography variant="body2" fontWeight={700} color={stat.color}>
                                                {stat.value}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))
                            )}
                        </Box>
                    </CleanText>
                </CleanBox>
            </CleanSection>

            {/* CHALLENGES & ACHIEVEMENTS */}
            <WorkSection sx={{ background: "#fff" }}>
                <WorkBadge>Engagement Features</WorkBadge>
                <Typography variant="h4" fontWeight={700} color="#003554" mb={1}>
                    Challenges & Achievements
                </Typography>
                <Typography color="#004b63" mb={6} maxWidth="700px" margin="0 auto 48px">
                    Stay motivated with our gamification features. Complete challenges, earn badges, 
                    and climb the leaderboard while making a real difference.
                </Typography>

                <Grid container spacing={4} maxWidth="1000px" margin="0 auto" justifyContent="center">
                    {[
                        {
                            title: "Active Challenges",
                            icon: "🏆",
                            desc: "Join local and national cleanup events",
                            count: loading ? "..." : `${stats.liveChallenges} Live`,
                            color: "#0077b6"
                        },
                        {
                            title: "Earn Badges",
                            icon: "🎖️",
                            desc: "Unlock achievements for your contributions",
                            count: "15 Types",
                            color: "#ffa500"
                        },
                        {
                            title: "Leaderboards",
                            icon: "📊",
                            desc: "Compete with volunteers across Canada",
                            count: "Top 100",
                            color: "#51cf66"
                        },
                    ].map((feature, i) => (
                        <Grid item xs={12} sm={4} key={i}>
                            <Card 
                                elevation={0} 
                                sx={{ 
                                    p: 3, 
                                    textAlign: 'center',
                                    border: `2px solid ${feature.color}20`,
                                    borderRadius: 3,
                                    height: '100%',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: `0 8px 24px ${feature.color}30`
                                    }
                                }}
                            >
                                <Typography fontSize="3rem" mb={1}>{feature.icon}</Typography>
                                <Typography variant="h6" color={feature.color} fontWeight={700} mb={1}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" color="#004b63" mb={2} lineHeight={1.6}>
                                    {feature.desc}
                                </Typography>
                                <Typography variant="h6" color="#003554" fontWeight={700}>
                                    {feature.count}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </WorkSection>

            {/* CTA SECTION */}
            <MissionSection>
                <MissionContent>
                    <span className="badge">Start Contributing</span>
                    <h3>Ready to Make Your Impact?</h3>
                    <p>
                        Every cleanup you log contributes to vital scientific research and helps 
                        protect Canada's marine ecosystems. Join a challenge today and start tracking 
                        your environmental impact.
                    </p>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <PrimaryButton onClick={() => router.push('/challenges')}>
                            Browse Challenges
                        </PrimaryButton>
                        <OutlineButton onClick={() => router.push('/upload')} sx={{ 
                            border: '2px solid #fff',
                            '&:hover': { background: 'rgba(255,255,255,0.1)' }
                        }}>
                            Upload Your First Cleanup
                        </OutlineButton>
                    </Box>
                </MissionContent>
            </MissionSection>
        </>
    );
}
export default withAuth(HomePage);
