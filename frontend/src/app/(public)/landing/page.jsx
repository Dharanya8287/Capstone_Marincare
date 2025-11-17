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
            desc: "The world's longest coastline spanning three oceans - Pacific, Atlantic, and Arctic",
            color: "#0077b6"
        },
        {
            number: "8-11 Million",
            label: "Tons of Plastic",
            desc: "Enter oceans globally every year, threatening marine ecosystems worldwide",
            color: "#ff6b6b"
        },
        {
            number: "800+",
            label: "Marine Species",
            desc: "Worldwide affected by ocean plastic pollution, including species in Canadian waters",
            color: "#51cf66"
        },
        {
            number: "90%",
            label: "Of Seabirds",
            desc: "Globally have ingested plastic, including species in Canadian waters",
            color: "#ffa500"
        },
    ];

    const canadianPollutionData = [
        { label: "Cigarette Butts", count: "19%", percentage: 85, desc: "Most common item in Canadian beach cleanups (Great Canadian Shoreline Cleanup)" },
        { label: "Plastic Bottles & Caps", count: "15-18%", percentage: 75, desc: "Common debris on Canadian beaches and coastlines" },
        { label: "Fishing Gear (Ghost Nets)", count: "10%", percentage: 65, desc: "Of all ocean plastic globally - deadly to marine mammals and turtles" },
        { label: "Food Wrappers", count: "12%", percentage: 60, desc: "Frequently found in Canadian coastal cleanup efforts" },
    ];

    const whyWaveGuard = [
        {
            emoji: "🌊",
            title: "Combat Marine Pollution",
            desc: "Join the fight against ocean plastic that's choking Canada's coastlines and threatening over 800 marine species globally.",
        },
        {
            emoji: "🐋",
            title: "Protect Wildlife",
            desc: "Save endangered species like North Atlantic right whales and sea turtles from ghost fishing gear and debris.",
        },
        {
            emoji: "📍",
            title: "Local Impact, National Scale",
            desc: "Connect with cleanup efforts across all 10 provinces and 3 territories, from Pacific to Atlantic to Arctic.",
        },
        {
            emoji: "🔬",
            title: "Contribute to Science",
            desc: "Your data helps researchers understand pollution patterns and develop evidence-based conservation strategies.",
        },
        {
            emoji: "🤝",
            title: "Build Community",
            desc: "Join thousands of Canadians united in protecting our waters for future generations.",
        },
        {
            emoji: "📱",
            title: "Make it Easy",
            desc: "Advanced AI technology makes tracking your environmental impact as simple as taking a photo.",
        },
    ];

    return (
        <Box sx={{ width: "100%", overflowX: "hidden" }}>
            {/* HERO SECTION */}
            <HeroSection>
                <HeroOverlay>
                    <HeroTag>Canada's Ocean Guardian Platform</HeroTag>
                    <HeroTitle>
                        Save Canada's Oceans,
                        <br />
                        <span style={{ color: "#67e8c3" }}>One Cleanup at a Time</span>
                    </HeroTitle>
                    <HeroDesc>
                        Every piece of plastic you remove helps protect endangered marine life across Canada's 
                        <span style={{ color: "#67e8c3", fontWeight: 700 }}> 243,042 km</span> coastline. 
                        Join a movement powered by AI, community, and science to combat ocean pollution that threatens 88 species at risk.
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
                                88
                            </Typography>
                            <Typography sx={{ color: "#d0eaf0", fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                                Marine Species at Risk (COSEWIC)
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700, mb: 0.5 }}>
                                3 Oceans
                            </Typography>
                            <Typography sx={{ color: "#d0eaf0", fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                                Pacific, Atlantic & Arctic
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700, mb: 0.5 }}>
                                ~356
                            </Typography>
                            <Typography sx={{ color: "#d0eaf0", fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                                N. Atlantic Right Whales Remaining
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
                            The Ecosystem Crisis
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
                            Canada's Ocean Emergency
                        </Typography>
                        <Typography
                            sx={{
                                color: "#004b63",
                                maxWidth: "800px",
                                margin: "0 auto",
                                fontSize: { xs: "1rem", md: "1.125rem" },
                                px: 2,
                                lineHeight: 1.7
                            }}
                        >
                            Our ocean ecosystems are under threat. From the Pacific to the Atlantic to the Arctic,
                            plastic pollution is devastating marine habitats and endangering species that have thrived
                            in Canadian waters for millennia.
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
                                    The Threat is Real
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
                                    Endangered Canadian Waters
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
                                    Every year, <strong style={{ color: "#67e8c3" }}>8-11 million tons</strong> of
                                    plastic flood our oceans. In Canada, this debris directly threatens the 
                                    <strong style={{ color: "#67e8c3" }}> North Atlantic right whale</strong> (approximately 356 remain), 
                                    leatherback sea turtles, and 88 other marine species officially listed as at-risk by COSEWIC.
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
                                    Ghost fishing gear accounts for <strong style={{ color: "#67e8c3" }}>10% of all ocean plastic</strong>,
                                    continuing to trap and kill marine life for decades. Microplastics have infiltrated 
                                    the entire food chain, from plankton to the fish on Canadian dinner tables.
                                </Typography>
                                <Box sx={{ mt: { xs: 2, md: 0 } }}>
                                    {["Prevent species extinction", "Protect ocean food chains", "Preserve coastal ecosystems"].map((text, idx) => (
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
                                    Types of Ocean Pollution in Canada
                                </Typography>
                                {canadianPollutionData.map((item, index) => (
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
                                                {item.count}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: "rgba(255,255,255,0.8)",
                                                fontSize: { xs: "0.8125rem", md: "0.875rem" },
                                                display: "block",
                                                mb: 1
                                            }}
                                        >
                                            {item.desc}
                                        </Typography>
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
                        <SectionBadge>Why WaveGuard?</SectionBadge>
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
                            Why This Application Matters
                        </Typography>
                        <Typography
                            sx={{
                                color: "#004b63",
                                maxWidth: "800px",
                                margin: "0 auto",
                                fontSize: { xs: "1rem", md: "1.125rem" },
                                px: 2,
                                lineHeight: 1.7,
                                mb: 1
                            }}
                        >
                            Individual actions alone can't solve the ocean plastic crisis - but organized, 
                            data-driven collective action can. WaveGuard transforms scattered cleanup efforts into 
                            a coordinated movement with measurable impact.
                        </Typography>
                    </Box>

                    <FeatureGrid>
                        {whyWaveGuard.map((feature, i) => (
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

                    {/* Purpose Statement */}
                    <ImpactBox>
                        <Box sx={{ textAlign: "center", maxWidth: "900px", margin: "0 auto" }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: "#0077b6",
                                    mb: 3,
                                    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" }
                                }}
                            >
                                Our Purpose: Unite Canadians for Ocean Conservation
                            </Typography>
                            <Typography
                                sx={{
                                    color: "#003554",
                                    fontSize: { xs: "1rem", md: "1.125rem" },
                                    lineHeight: 1.8,
                                    mb: 3
                                }}
                            >
                                WaveGuard exists to bridge the gap between individual concern and collective action. 
                                We provide the tools, community, and data infrastructure needed to turn beach cleanups 
                                into a powerful force for environmental change across Canada.
                            </Typography>
                            <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center" sx={{ mt: 2 }}>
                                {[
                                    { number: "AI-Powered", label: "Waste Classification" },
                                    { number: "Real-Time", label: "Impact Dashboard" },
                                    { number: "Coast to Coast", label: "Community Network" },
                                    { number: "Scientific", label: "Data Contribution" }
                                ].map((stat, idx) => (
                                    <Grid item xs={6} sm={3} key={idx}>
                                        <Box sx={{ textAlign: "center", px: 1 }}>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: "#0077b6",
                                                    fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
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
                        </Box>
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
                            Be Part of the Solution
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
                            Every cleanup starts with a single step. Join the movement to protect Canada's oceans, 
                            beaches, and marine life. Your contribution - no matter how small - creates real, 
                            measurable change for our environment.
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
                            Start Making an Impact
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
                            100% Free • Join in 60 seconds • Make a difference today
                        </Typography>
                    </Box>
                </Container>
            </CTASection>
        </Box>
    );
}

export default Page;