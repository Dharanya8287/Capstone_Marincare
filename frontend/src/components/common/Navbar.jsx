"use client";

import { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Stack, Avatar } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { navItems } from "./navConfig";
import PersonOutline from "@mui/icons-material/PersonOutline";
import { apiCall } from "@/utils/api";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [profileImage, setProfileImage] = useState('');
    const isActive = (path) => (path === "/" ? pathname === "/" : pathname?.startsWith(path));

    // Fetch user profile to get profile image
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await apiCall('get', `${process.env.NEXT_PUBLIC_API_URL}/api/profile`);
                if (res?.data?.profileImage) {
                    // Ensure profile image URL is properly formatted
                    const imageUrl = res.data.profileImage.startsWith('http') 
                        ? res.data.profileImage 
                        : `${process.env.NEXT_PUBLIC_API_URL}${res.data.profileImage}`;
                    setProfileImage(imageUrl);
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                // Keep default empty string on error
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <AppBar
            position="sticky"
            elevation={0}
            color="transparent"
            sx={{
                top: 0,
                display: { xs: "none", md: "block" },
                backgroundColor: "#ffffff",
                borderBottom: "1px solid #e5e7eb",
                backdropFilter: "blur(8px)",
            }}
        >
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1.75,
                    px: { md: 4, lg: 6 },
                    minHeight: { md: 70 }
                }}
            >
                {/* Left: Logo + Brand Name */}
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{
                        cursor: "pointer",
                        transition: "transform 0.2s ease",
                        "&:hover": {
                            transform: "scale(1.02)"
                        }
                    }}
                    onClick={() => router.push("/")}
                >
                    <Box
                        component="img"
                        src="/images/logoblue.png"
                        alt="WaveGuard"
                        sx={{
                            height: 44,
                            width: 44,
                            borderRadius: "50%",
                            boxShadow: "0 2px 8px rgba(8, 145, 178, 0.2)",
                        }}
                    />
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            fontSize: "1.25rem",
                            color: "#0f172a",
                            letterSpacing: "-0.02em",
                            display: { xs: "none", lg: "block" }
                        }}
                    >
                        WaveGuard
                    </Typography>
                </Stack>

                {/* Right: nav items + profile */}
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                >
                    {/* Nav items */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        sx={{
                            bgcolor: "#f8fafc",
                            borderRadius: 4,
                            p: 0.75,
                            border: "1px solid #e2e8f0"
                        }}
                    >
                        {navItems.map(({ label, path, icon: Icon }) => (
                            <Button
                                key={path}
                                onClick={() => router.push(path)}
                                startIcon={<Icon sx={{ fontSize: 20 }} />}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: isActive(path) ? 600 : 500,
                                    fontSize: "0.9375rem",
                                    color: isActive(path) ? "#ffffff" : "#64748b",
                                    px: 2.5,
                                    py: 1.1,
                                    borderRadius: 3,
                                    bgcolor: isActive(path) ? "#0891b2" : "transparent",
                                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                    position: "relative",
                                    overflow: "hidden",
                                    boxShadow: isActive(path) ? "0 2px 8px rgba(8, 145, 178, 0.3)" : "none",
                                    "&:hover": {
                                        bgcolor: isActive(path) ? "#0e7490" : "#ffffff",
                                        color: isActive(path) ? "#ffffff" : "#0f172a",
                                        transform: "translateY(-1px)",
                                        boxShadow: isActive(path)
                                            ? "0 4px 12px rgba(8, 145, 178, 0.4)"
                                            : "0 2px 6px rgba(0, 0, 0, 0.08)",
                                    },
                                    "& .MuiButton-startIcon": {
                                        marginRight: 0.75,
                                    }
                                }}
                            >
                                {label}
                            </Button>
                        ))}
                    </Stack>

                    {/* Profile button */}
                    <IconButton
                        size="medium"
                        onClick={() => router.push("/profile")}
                        sx={{
                            bgcolor: "#f1f5f9",
                            border: "1px solid #e2e8f0",
                            width: 44,
                            height: 44,
                            p: 0,
                            transition: "all 0.2s ease",
                            "&:hover": {
                                bgcolor: "#0891b2",
                                borderColor: "#0891b2",
                                transform: "scale(1.05)",
                                boxShadow: "0 4px 12px rgba(8, 145, 178, 0.3)",
                                "& .MuiAvatar-root": {
                                    bgcolor: "#0e7490",
                                }
                            },
                        }}
                    >
                        <Avatar
                            src={profileImage || undefined}
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: "#0891b2",
                                fontSize: 16,
                                fontWeight: 600,
                            }}
                        >
                            {!profileImage && <PersonOutline sx={{ fontSize: 22, color: "#ffffff" }} />}
                        </Avatar>
                    </IconButton>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}