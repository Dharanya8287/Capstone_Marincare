"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Grid, Card, CardContent, LinearProgress, Container } from "@mui/material";
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
    Section,
    SectionBadge,
    FeatureGrid,
    FeatureCard,
    StatCard,
    ImpactBox,
    CTASection,
} from "./landing.styles";

function Page() {
    const router = useRouter();

    const ecosystemStats = [
        {
            number: "243,042 km",
            label: "Canada's Coastline",
            desc: "The world's longest coastline spanning three oceans",
            color: "#0077b6"
        },
        {
            number: "8 Million",
            label: "Tons of Plastic",
            desc: "Enter oceans globally every year",
            color: "#ff6b6b"
        },
        {
            number: "15,000+",
            label: "Marine Species",
            desc: "At risk from ocean plastic pollution",
            color: "#51cf66"
        },
        {
            number: "90%",
            label: "Of Seabirds",
            desc: "In Canadian waters contain microplastics",
            color: "#0077b6"
        },
    ];

    const impactData = [
        { label: "Plastic Bottles", count: 4521, percentage: 90 },
        { label: "Food Wrappers", count: 3204, percentage: 65 },
        { label: "Cigarette Butts", count: 2891, percentage: 58 },
        { label: "Fishing Gear", count: 1931, percentage: 38 },
    ];

    const features = [
        {
            emoji: "🤖",
            title: "AI-Powered Detection",
            desc: "Advanced AI instantly classifies waste types from photos, providing accurate data for environmental research.",
        },
        {
            emoji: "📊",
            title: "Real-Time Impact Tracking",
            desc: "Watch your contribution grow with detailed analytics showing items collected, weight removed, and CO2 offset.",
        },
        {
            emoji: "🏆",
            title: "Community Challenges",
            desc: "Join local cleanup events, compete on leaderboards, and connect with passionate volunteers.",
        },
        {
            emoji: "🔬",
            title: "Scientific Data Collection",
            desc: "Your efforts contribute to valuable research helping scientists combat marine pollution.",
        },
    ];

    return (
        <Box sx={{ width: "100%", overflowX: "hidden" }}>
            {/* HERO SECTION */}
            <HeroSection>
                <HeroOverlay>
                    <HeroTag>Canada's Ocean Guardian Platform</HeroTag>
                    <HeroTitle>
                        Protect Canada's Shorelines,
                        <br />
                        <span style={{ color: "#67e8c3" }}>One Cleanup at a Time</span>
                    </HeroTitle>
                    <HeroDesc>
                        Turn your cleanup efforts into measurable environmental impact. WaveGuard
                        uses AI to classify waste, track progress, and unite volunteers across
                        Canada's <span style={{ color: "#67e8c3", fontWeight: 700 }}>243,042 km</span> of coastline.
                    </HeroDesc>
                    <HeroButtons>
                        <PrimaryButton onClick={() => router.push('/signup')}>
                            Get Started Free
                        </PrimaryButton>
                        <OutlineButton onClick={() => router.push('/signup')}>
                            Watch How It Works
                        </OutlineButton>
                    </HeroButtons>

                    <StatsBox>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700, mb: 0.5 }}>
                                12,547
                            </Typography>
                            <Typography sx={{ color: "#d0eaf0", fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                                Items Collected This Month
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700, mb: 0.5 }}>
                                847 kg
                            </Typography>
                            <Typography sx={{ color: "#d0eaf0", fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                                Waste Removed From Beaches
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700, mb: 0.5 }}>
                                47
                            </Typography>
                            <Typography sx={{ color: "#d0eaf0", fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                                Active Cleanup Challenges
                            </Typography>
                        </Box>
                    </StatsBox>
                </HeroOverlay>
            </HeroSection>

            {/* OCEAN ECOSYSTEM CRISIS SECTION */}
            <Section sx={{ background: "#f8f9fa" }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
                        <SectionBadge sx={{
                            background: "rgba(0, 119, 182, 0.1)",
                            color: "#0077b6",
                            borderColor: "#0077b6"
                        }}>
                            The Ocean Crisis
                        </SectionBadge>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                color: "#003554",
                                mt: 2,
                                mb: 2,
                                fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" }
                            }}
                        >
                            Understanding the Challenge
                        </Typography>
                        <Typography
                            sx={{
                                color: "#004b63",
                                maxWidth: "700px",
                                margin: "0 auto",
                                fontSize: { xs: "1rem", md: "1.125rem" },
                                px: 2
                            }}
                        >
                            Canada's vast coastline faces unprecedented threats from marine debris.
                            Here's why your action matters.
                        </Typography>
                    </Box>

                    <Grid container spacing={3} justifyContent="center">
                        {ecosystemStats.map((stat, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: "flex" }}>
                                <StatCard elevation={0}>
                                    <CardContent sx={{ textAlign: "center", width: "100%" }}>
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                color: stat.color,
                                                fontWeight: 700,
                                                mb: 2,
                                                fontSize: { xs: "2rem", sm: "2.25rem", md: "2.5rem" },
                                                textAlign: "center"
                                            }}
                                        >
                                            {stat.number}
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: "#0077b6",
                                                fontWeight: 600,
                                                mb: 1,
                                                fontSize: { xs: "1.125rem", md: "1.25rem" },
                                                textAlign: "center"
                                            }}
                                        >
                                            {stat.label}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="#004b63"
                                            sx={{
                                                textAlign: "center",
                                                lineHeight: 1.5,
                                                px: 1
                                            }}
                                        >
                                            {stat.desc}
                                        </Typography>
                                    </CardContent>
                                </StatCard>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Section>

            {/* CANADA'S COASTAL CRISIS */}
            <Section sx={{
                background: "linear-gradient(135deg, #0077b6 0%, #003554 100%)",
                color: "#fff"
            }}>
                <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                    <Grid container spacing={{ xs: 4, md: 8 }} alignItems="stretch" justifyContent="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                justifyContent: "center",
                                maxWidth: { md: "600px" },
                                mx: { md: "0", lg: "auto" },
                                pr: { md: 2, lg: 4 }
                            }}>
                                <SectionBadge sx={{
                                    background: "rgba(103, 232, 195, 0.2)",
                                    color: "#67e8c3",
                                    borderColor: "#67e8c3",
                                    mb: 3
                                }}>
                                    Critical Facts
                                </SectionBadge>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 3,
                                        fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem", lg: "2.75rem" },
                                        lineHeight: 1.2
                                    }}
                                >
                                    Canada's Coastal Crisis
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        mb: 3,
                                        lineHeight: 1.8,
                                        opacity: 0.95,
                                        fontSize: { xs: "1rem", md: "1.0625rem", lg: "1.125rem" }
                                    }}
                                >
                                    Every year, over <strong style={{ color: "#67e8c3" }}>8 million tons</strong> of
                                    plastic enter our oceans. In Canada alone, marine debris threatens critical habitats
                                    for endangered species like the North Atlantic right whale and leatherback sea turtles.
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        mb: 4,
                                        lineHeight: 1.8,
                                        opacity: 0.95,
                                        fontSize: { xs: "1rem", md: "1.0625rem", lg: "1.125rem" }
                                    }}
                                >
                                    Microplastics have been found in <strong style={{ color: "#67e8c3" }}>90% of seabirds</strong> in
                                    Canadian waters, and ghost fishing gear continues to trap and kill marine life
                                    for decades after being abandoned.
                                </Typography>
                                <Box sx={{ mt: { xs: 2, md: 0 } }}>
                                    {["Measurable impact tracking", "Scientific data contribution", "Community-driven solutions"].map((text, idx) => (
                                        <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
                                            <Box sx={{
                                                minWidth: "28px",
                                                height: "28px",
                                                borderRadius: "50%",
                                                background: "#67e8c3",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#003554",
                                                fontWeight: 700,
                                                fontSize: "0.875rem",
                                                flexShrink: 0
                                            }}>✓</Box>
                                            <Typography sx={{ fontSize: { xs: "1rem", md: "1.0625rem" } }}>
                                                {text}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                justifyContent: "center",
                                maxWidth: { md: "600px" },
                                mx: { md: "0", lg: "auto" },
                                pl: { md: 2, lg: 4 }
                            }}>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 4,
                                        fontSize: { xs: "1.5rem", md: "1.75rem", lg: "2rem" }
                                    }}
                                >
                                    Most Collected Items (2024)
                                </Typography>
                                {impactData.map((item, index) => (
                                    <Box key={index} sx={{ mb: 3.5 }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5, alignItems: "baseline" }}>
                                            <Typography
                                                variant="body1"
                                                fontWeight={600}
                                                sx={{ fontSize: { xs: "1rem", md: "1.0625rem", lg: "1.125rem" } }}
                                            >
                                                {item.label}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontSize: { xs: "0.9375rem", md: "1rem" },
                                                    ml: 2
                                                }}
                                            >
                                                {item.count} items
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={item.percentage}
                                            sx={{
                                                height: 12,
                                                borderRadius: 6,
                                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                                "& .MuiLinearProgress-bar": {
                                                    backgroundColor: "#67e8c3",
                                                    borderRadius: 6,
                                                },
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Section>

            {/* HOW IT CREATES IMPACT */}
            <Section sx={{ background: "#fff" }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
                        <SectionBadge>Platform Features</SectionBadge>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                color: "#003554",
                                mt: 2,
                                mb: 2,
                                fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" }
                            }}
                        >
                            How WaveGuard Creates Impact
                        </Typography>
                        <Typography
                            sx={{
                                color: "#004b63",
                                maxWidth: "700px",
                                margin: "0 auto",
                                fontSize: { xs: "1rem", md: "1.125rem" },
                                px: 2
                            }}
                        >
                            Combining technology, community, and science to make every cleanup count.
                        </Typography>
                    </Box>

                    <FeatureGrid>
                        {features.map((feature, i) => (
                            <FeatureCard key={i} elevation={0}>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    width: "100%",
                                    textAlign: "center"
                                }}>
                                    <Typography sx={{ fontSize: { xs: "2.5rem", md: "3rem" }, mb: 2 }}>
                                        {feature.emoji}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: "#0077b6",
                                            fontWeight: 700,
                                            mb: 1.5,
                                            fontSize: { xs: "1.125rem", md: "1.25rem" },
                                            textAlign: "center"
                                        }}
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: "#004b63",
                                            fontSize: { xs: "0.9375rem", md: "1rem" },
                                            lineHeight: 1.7,
                                            textAlign: "center"
                                        }}
                                    >
                                        {feature.desc}
                                    </Typography>
                                </Box>
                            </FeatureCard>
                        ))}
                    </FeatureGrid>

                    {/* Impact Numbers */}
                    <ImpactBox>
                        <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
                            {[
                                { number: "15,234", label: "Total Volunteers" },
                                { number: "2.4 Tons", label: "Waste Removed" },
                                { number: "187", label: "Beaches Cleaned" },
                                { number: "10 Provinces", label: "Active Coverage" }
                            ].map((stat, idx) => (
                                <Grid item xs={6} sm={3} key={idx}>
                                    <Box sx={{ textAlign: "center", px: 1 }}>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 700,
                                                color: "#0077b6",
                                                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                                                mb: 0.5
                                            }}
                                        >
                                            {stat.number}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: "#004b63",
                                                fontSize: { xs: "0.875rem", md: "1rem" },
                                                lineHeight: 1.3
                                            }}
                                        >
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </ImpactBox>
                </Container>
            </Section>

            {/* CALL TO ACTION */}
            <CTASection>
                <Container maxWidth="md">
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center"
                    }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                color: "#003554",
                                mb: 2.5,
                                fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
                                maxWidth: "700px"
                            }}
                        >
                            Ready to Make a Difference?
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: "#003554",
                                mb: 4,
                                opacity: 0.9,
                                fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                                maxWidth: "650px",
                                lineHeight: 1.6,
                                px: { xs: 2, sm: 3 }
                            }}
                        >
                            Join thousands of Canadians protecting our coastlines. Every piece of
                            trash removed makes a real impact on marine ecosystems.
                        </Typography>
                        <PrimaryButton
                            onClick={() => router.push('/signup')}
                            sx={{
                                background: "#003554 !important",
                                color: "#67e8c3 !important",
                                fontSize: { xs: "1rem", md: "1.125rem" },
                                padding: { xs: "14px 35px", md: "18px 50px" },
                                boxShadow: "0 4px 20px rgba(0, 53, 84, 0.3)",
                                mb: 2.5
                            }}
                        >
                            Get Started Today
                        </PrimaryButton>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#003554",
                                opacity: 0.8,
                                fontSize: { xs: "0.875rem", md: "1rem" },
                                maxWidth: "500px"
                            }}
                        >
                            Free to join • No credit card required • Start making impact immediately
                        </Typography>
                    </Box>
                </Container>
            </CTASection>
        </Box>
    );
}

export default Page;