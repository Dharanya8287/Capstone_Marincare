"use client";
import React from "react";
import Image from "next/image";
import withAuth from '@/components/auth/withAuth';
import { Box, Typography } from "@mui/material";
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
} from "./landing.styles";

function LandingPage() {
    return (
        <>

            {/* HERO SECTION */}
            <HeroSection>
                <HeroOverlay>
                    <HeroTag>Eco-System</HeroTag>
                    <HeroTitle>
                        Protect Canada’s <br />
                        <span style={{ color: "#67e8c3" }}>Shorelines Together</span>
                    </HeroTitle>
                    <HeroDesc>
                        Turn your cleanup efforts into measurable impact. WaveGuard uses AI
                        to classify waste, track progress, and connect volunteers across
                        Canada’s <span style={{ color: "#67e8c3" }}>243,042 km</span> of
                        coastline.
                    </HeroDesc>
                    <HeroButtons>
                        <PrimaryButton>Join a Challenge</PrimaryButton>
                        <OutlineButton>Know More</OutlineButton>
                    </HeroButtons>

                    <StatsBox>
                        <Box>
                            <Typography variant="h5" color="#fff">
                                12,547
                            </Typography>
                            <Typography color="#d0eaf0">Items Collected</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h5" color="#fff">
                                2,891
                            </Typography>
                            <Typography color="#d0eaf0">Active Volunteers</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h5" color="#fff">
                                47
                            </Typography>
                            <Typography color="#d0eaf0">Active Challenges</Typography>
                        </Box>
                    </StatsBox>
                </HeroOverlay>
            </HeroSection>

            {/* HOW WAVEGUARD WORKS */}
            <WorkSection>
                <WorkBadge>Platform Features</WorkBadge>
                <Typography variant="h4" fontWeight={700} color="#003554" mb={1}>
                    How WaveGuard Works
                </Typography>
                <Typography color="#004b63" mb={6}>
                    Making cleanup efforts measurable, engaging, and impactful through
                    technology and community.
                </Typography>

                <WorkGrid>
                    {[
                        {
                            img: "/images/ai-detection.png",
                            title: "AI Trash Detection",
                            desc: "Instantly identifies waste types from photos using advanced AI technology.",
                        },
                        {
                            img: "/images/challenges.png",
                            title: "Local Challenges",
                            desc: "Join cleanup events in your community and make a real impact.",
                        },
                        {
                            img: "/images/track.png",
                            title: "Track Your Impact",
                            desc: "View personal stats and see how your efforts contribute to the bigger picture.",
                        },
                        {
                            img: "/images/community.png",
                            title: "Community Driven",
                            desc: "Connect with volunteers across Canada and compete on leaderboards.",
                        },
                    ].map((card, i) => (
                        <WorkCard key={i}>
                            <Image src={card.img} alt={card.title} width={64} height={64} />
                            <Typography variant="h6" color="#0077b6" mt={1}>
                                {card.title}
                            </Typography>
                            <Typography color="#004b63" fontSize="14px">
                                {card.desc}
                            </Typography>
                        </WorkCard>
                    ))}
                </WorkGrid>
            </WorkSection>

            {/* EVERY CLEANUP COUNTS */}
            <CleanSection>
                <CleanBox>
                    <Box>
                        <Image
                            src="/images/cleanup.jpg"
                            alt="Ocean Cleanup"
                            width={500}
                            height={320}
                            style={{ borderRadius: 12 }}
                        />
                    </Box>
                    <CleanText>
                        <span className="badge">Platform Benefits</span>
                        <h3>Every Cleanup Counts</h3>
                        <p>
                            Join thousands of Canadians making a measurable difference in
                            protecting our coastlines and marine ecosystems.
                        </p>
                        <ul>
                            <li>Real-time AI waste classification</li>
                            <li>Personal impact tracking & analytics</li>
                            <li>Connect with local volunteers</li>
                            <li>Earn badges and achievements</li>
                        </ul>
                    </CleanText>
                </CleanBox>
            </CleanSection>

            {/* MISSION SECTION */}
            <MissionSection>
                <MissionContent>
                    <span className="badge">Our Mission</span>
                    <h3>Protecting the World’s Longest Coastline</h3>
                    <p>
                        Canada’s 243,042 km coastline faces increasing plastic pollution
                        threatening marine life and local ecosystems. WaveGuard coordinates
                        volunteers, tracks meaningful data, and motivates ongoing
                        participation to protect our shores for future generations.
                    </p>
                    <MissionButton>Get Started Today</MissionButton>
                </MissionContent>
            </MissionSection>
        </>
    );
}
export default withAuth(LandingPage);