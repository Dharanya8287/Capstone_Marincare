"use client";

import { useState } from "react";
import { Box, Typography, IconButton, Menu, MenuItem, Divider, Avatar } from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function MobileHeader() {
    const [anchorEl, setAnchorEl] = useState(null);
    const router = useRouter();
    const { logout } = useAuth();

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleProfile = () => {
        router.push("/profile");
        handleMenuClose();
    };

    const handleLogout = async () => {
        await logout();
        router.push("/login");
        handleMenuClose();
    };

    return (
        <Box
            component="header"
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1200,
                height: 56,
                bgcolor: "#fff",
                borderBottom: "1px solid rgba(0,0,0,0.07)",
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1,
                boxShadow: "0 1px 6px rgba(0,0,0,0.03)",
            }}
        >
            <Box display="flex" alignItems="center">
                <Box
                    component="img"
                    src="/images/logoblue.png"
                    alt="WaveGuard"
                    sx={{
                        height: 32,
                        width: 32,
                        borderRadius: "50%",
                        mr: 1.2,
                    }}
                />
                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                        fontSize: { xs: 18, sm: 20 },
                        letterSpacing: 0.2,
                        color: "#0891b2",
                    }}
                >
                    WaveGuard
                </Typography>
            </Box>

            <IconButton
                size="large"
                aria-label="profile menu"
                onClick={handleMenuOpen}
                sx={{
                    ml: 1,
                    p: 0.5,
                }}
            >
                <Avatar
                    sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "#0891b2",
                        fontSize: 16,
                        fontWeight: 600,
                    }}
                >
                    <AccountCircleRoundedIcon sx={{ fontSize: 24 }} />
                </Avatar>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                sx={{
                    zIndex: 1300,
                    mt: 1,
                }}
                PaperProps={{
                    sx: {
                        minWidth: 180,
                        borderRadius: 2,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }
                }}
            >
                <MenuItem
                    onClick={handleProfile}
                    sx={{
                        py: 1.5,
                        px: 2,
                        gap: 1.5,
                        "&:hover": {
                            bgcolor: "rgba(8, 145, 178, 0.08)",
                        }
                    }}
                >
                    <AccountCircleRoundedIcon sx={{ fontSize: 22, color: "#0891b2" }} />
                    <Typography variant="body2" fontWeight={500}>
                        Profile
                    </Typography>
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem
                    onClick={handleLogout}
                    sx={{
                        py: 1.5,
                        px: 2,
                        gap: 1.5,
                        color: "#ef4444",
                        "&:hover": {
                            bgcolor: "rgba(239, 68, 68, 0.08)",
                        }
                    }}
                >
                    <LogoutRoundedIcon sx={{ fontSize: 22 }} />
                    <Typography variant="body2" fontWeight={500}>
                        Logout
                    </Typography>
                </MenuItem>
            </Menu>
        </Box>
    );
}