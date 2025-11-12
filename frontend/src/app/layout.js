import "./globals.css";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";
import { AuthProvider } from "@/context/AuthContext";
import { JoinedChallengesProvider } from "@/context/JoinedChallengesContext";

export const metadata = {
    title: "WaveGuard - Ocean Conservation Platform",
    description: "Join Canada's ocean conservation movement. Track cleanup efforts, classify waste with AI, and protect our coastlines.",
    keywords: "ocean conservation, beach cleanup, marine debris, Canada coastline, environmental impact, AI waste classification",
    manifest: "/manifest.json",
    themeColor: "#0077b6",
    viewport: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "WaveGuard"
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/favicon.ico",
    },
};
export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
        <head>
            <link rel="preload" as="image" href="/images/login-mobile.webp" media="(max-width: 900px)" />
            <link rel="preload" as="image" href="/images/login-optimized.webp" media="(min-width: 901px)" />
            <link rel="preload" as="image" href="/images/logowhite-optimized.webp" />
        </head>
        <body style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        <AuthProvider>
            <JoinedChallengesProvider>
                <AppLayoutWrapper>{children}</AppLayoutWrapper>
            </JoinedChallengesProvider>
        </AuthProvider>
        </body>
        </html>
    );
}
