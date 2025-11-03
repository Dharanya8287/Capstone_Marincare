import "./globals.css";
import { Inter } from "next/font/google";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";
import { AuthProvider } from "@/context/AuthContext";
import { JoinedChallengesProvider } from "@/context/JoinedChallengesContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "WaveGuard",
    description: "Protect Canada's Shorelines Together",
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
