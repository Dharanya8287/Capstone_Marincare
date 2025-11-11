"use client";
import {
    CssBaseline,
    ThemeProvider,
    createTheme,
    Box,
} from "@mui/material";
import MobileHeader from "@/components/common/MobileHeader";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import SmoothPageTransition from "@/components/PageTransition";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useAuthContext } from "@/context/AuthContext"; // Import the custom hook

const MobileBottomNav = dynamic(
    () => import("@/components/common/MobileBottomNav"),
    { ssr: false }
);

const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#0891b2" },
        background: { default: "#ffffff", paper: "#ffffff" },
        text: { primary: "#0a0a0a", secondary: "rgba(0,0,0,0.6)" },
    },
    typography: { fontFamily: "Inter, sans-serif" },
    shape: { borderRadius: 12 },
});

export default function AppLayoutWrapper({ children }) {
    const pathname = usePathname();
    // Get the reliable authentication state from the central context
    const { isAuthenticated } = useAuthContext();

    // Define which pages are considered "public" or "auth" pages
    const isPublicPage = pathname === "/" || pathname === "/landing" || pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password";

    // Show the layout ONLY if the user is authenticated .
    const showLayout = isAuthenticated && !isPublicPage;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            {/* Mobile header and Navbar only render when showLayout is true */}
            {showLayout && <MobileHeader />}
            {showLayout && <Navbar />}

            <Box
                component="main"
                sx={{
                    minHeight: "100dvh",
                    pb: showLayout ? { xs: "calc(64px + env(safe-area-inset-bottom))", md: 0 } : 0,
                    pt: showLayout ? { xs: "56px", md: 0 } : 0,
                }}
            >
                <SmoothPageTransition>{children}</SmoothPageTransition>
            </Box>

            {showLayout && <Footer />}
            {showLayout && <MobileBottomNav />}
        </ThemeProvider>
    );
}