// components/sections/CTASection.jsx
import React from "react";
import { Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AddIcon from "@mui/icons-material/Add";

const CTASection = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                mt: 8,
                mb: 4,
                p: { xs: 4, sm: 5, md: 6 },
                background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                borderRadius: "24px",
                textAlign: "center",
                color: "white",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(14, 165, 233, 0.3)",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                    pointerEvents: "none",
                },
            }}
        >
            <TrendingUpIcon
                sx={{
                    fontSize: { xs: 48, sm: 56, md: 64 },
                    mb: 2,
                    opacity: 0.9,
                    position: "relative",
                    zIndex: 1
                }}
            />

            <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{
                    fontWeight: 700,
                    mb: 2,
                    position: "relative",
                    zIndex: 1,
                }}
            >
                Can't Find a Local Challenge?
            </Typography>

            <Typography
                variant={isMobile ? "body2" : "body1"}
                sx={{
                    mb: 4,
                    opacity: 0.95,
                    maxWidth: "600px",
                    mx: "auto",
                    lineHeight: 1.6,
                    position: "relative",
                    zIndex: 1,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
            >
                Start your own cleanup initiative and invite your community to join.
                Track your impact and inspire others to take action.
            </Typography>

            <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                sx={{
                    backgroundColor: "white",
                    color: "#0ea5e9",
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontSize: { xs: '0.95rem', sm: '1rem' },
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    position: "relative",
                    zIndex: 1,
                    "&:hover": {
                        backgroundColor: "#f0f9ff",
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
                    },
                    transition: "all 0.3s ease",
                }}
            >
                Create Challenge
            </Button>
        </Box>
    );
};

export default CTASection;