import "./globals.css";
import { Inter } from "next/font/google";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";
import { AuthProvider } from "@/context/AuthContext";
import { JoinedChallengesProvider } from "@/context/JoinedChallengesContext";

const inter = Inter({ subsets: ["latin"] });

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
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
        <body className={inter.className}>
        <AuthProvider>
            <JoinedChallengesProvider>
                <AppLayoutWrapper>{children}</AppLayoutWrapper>
            </JoinedChallengesProvider>
        </AuthProvider>
        </body>
        </html>
    );
}
