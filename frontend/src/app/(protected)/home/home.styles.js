"use client";
import { styled } from "@mui/material/styles";
import { Box, Button } from "@mui/material";

/* HERO SECTION */
export const HeroSection = styled(Box)(() => ({
    position: "relative",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    overflow: "hidden",
    "@media (max-width: 768px)": {
        minHeight: "calc(100vh - 56px)",
        height: "auto",
        paddingTop: "20px",
        paddingBottom: "40px",
    },
    "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        background: 'url("/images/hero1.jpg") center center / cover no-repeat',
        filter: "blur(1px) brightness(1.0)",
        transform: "scale(1.05)",
        zIndex: 0,
    },
    "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        background:
            "linear-gradient(to right, rgba(8,145,178,0.85) 25%, rgba(103,232,195,0.6) 90%)",
        zIndex: 1,
    },
}));

export const HeroOverlay = styled(Box)(() => ({
    position: "relative",
    zIndex: 2,
    maxWidth: 800,
    color: "#fff",
    padding: "0 20px",
    "@media (max-width: 768px)": {
        padding: "0 16px",
        maxWidth: "100%",
    },
}));

export const HeroTag = styled("p")(() => ({
    fontSize: 14,
    letterSpacing: 1,
    background: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    padding: "6px 16px",
    display: "inline-block",
    marginBottom: 18,
    color: "#e3f9ff",
    "@media (max-width: 768px)": {
        fontSize: 12,
        padding: "5px 14px",
        marginBottom: 14,
    },
}));

export const HeroTitle = styled("h1")(() => ({
    fontSize: 52,
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: 16,
    "@media (max-width: 768px)": {
        fontSize: 32,
        lineHeight: 1.25,
        marginBottom: 12,
        wordWrap: "break-word",
        hyphens: "auto",
    },
    "@media (max-width: 480px)": {
        fontSize: 28,
    },
}));

export const HeroDesc = styled("p")(() => ({
    fontSize: 18,
    color: "#d9f3f8",
    marginBottom: 40,
    lineHeight: 1.6,
    "@media (max-width: 768px)": {
        fontSize: 14,
        lineHeight: 1.5,
        marginBottom: 30,
        padding: "0 8px",
    },
}));

export const HeroButtons = styled(Box)(() => ({
    display: "flex",
    justifyContent: "center",
    gap: 16,
    marginBottom: 60,
    "@media (max-width: 768px)": {
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        marginBottom: 40,
        width: "100%",
        padding: "0 20px",
    },
}));

export const PrimaryButton = styled(Button)(() => ({
    background: "#0891b2",
    color: "#fff",
    padding: "12px 28px",
    borderRadius: 6,
    fontSize: 15,
    "&:hover": { background: "#067b96" },
    "@media (max-width: 768px)": {
        width: "100%",
        maxWidth: "280px",
        padding: "11px 24px",
        fontSize: 14,
    },
}));

export const OutlineButton = styled(Button)(() => ({
    border: "1.5px solid #fff",
    background: "transparent",
    color: "#fff",
    padding: "12px 28px",
    borderRadius: 6,
    fontSize: 15,
    "&:hover": { background: "rgba(255,255,255,0.1)" },
    "@media (max-width: 768px)": {
        width: "100%",
        maxWidth: "280px",
        padding: "11px 24px",
        fontSize: 14,
    },
}));

export const StatsBox = styled(Box)(() => ({
    display: "flex",
    justifyContent: "center",
    gap: 60,
    flexWrap: "wrap",
    marginTop: 40,
    "@media (max-width: 768px)": {
        gap: 24,
        marginTop: 30,
        padding: "0 12px",
        "& > div": {
            minWidth: "90px",
            "& .MuiTypography-h5": {
                fontSize: "1.3rem",
                fontWeight: 700,
            },
            "& .MuiTypography-root:not(.MuiTypography-h5)": {
                fontSize: "0.75rem",
            },
        },
    },
}));

/* WORK SECTION */
export const WorkSection = styled(Box)(() => ({
    background: "#f8fafb",
    padding: "96px 32px",
    textAlign: "center",
    "@media (max-width: 768px)": {
        padding: "50px 16px",
        "& .MuiTypography-h4": {
            fontSize: "1.5rem",
            lineHeight: 1.3,
            marginBottom: "8px !important",
        },
        "& > .MuiTypography-root:not(.MuiTypography-h4)": {
            fontSize: "0.875rem",
            padding: "0 8px",
            marginBottom: "40px !important",
        },
    },
}));

export const WorkBadge = styled("span")(() => ({
    display: "inline-block",
    background: "#e0f7fa",
    color: "#0077b6",
    fontSize: 13,
    fontWeight: 500,
    padding: "6px 14px",
    borderRadius: 50,
    marginBottom: 14,
    "@media (max-width: 768px)": {
        fontSize: 11,
        padding: "5px 12px",
        marginBottom: 10,
    },
}));

export const WorkGrid = styled("div")(() => ({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 32,
    justifyItems: "center",
    "@media (max-width: 768px)": {
        gridTemplateColumns: "1fr",
        gap: 20,
        maxWidth: "400px",
        margin: "0 auto",
    },
}));

export const WorkCard = styled("div")(() => ({
    background: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    padding: "32px 24px",
    maxWidth: 280,
    width: "100%",
    transition: "all 0.3s ease",
    textAlign: "center",
    "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
    },
    "@media (max-width: 768px)": {
        padding: "24px 20px",
        maxWidth: "100%",
        "& img": {
            width: "56px !important",
            height: "56px !important",
        },
        "& .MuiTypography-h6": {
            fontSize: "1.05rem",
            marginTop: "8px !important",
        },
        "& .MuiTypography-root:not(.MuiTypography-h6)": {
            fontSize: "0.85rem",
            lineHeight: 1.5,
        },
    },
}));

/* CLEANUP SECTION */
export const CleanSection = styled(Box)(() => ({
    backgroundColor: "#e0f7fa",
    padding: "96px 32px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "@media (max-width: 768px)": {
        padding: "50px 16px",
    },
}));

export const CleanBox = styled(Box)(() => ({
    display: "flex",
    alignItems: "center",
    gap: 50,
    maxWidth: 1100,
    flexWrap: "wrap",
    justifyContent: "center",
    "@media (max-width: 900px)": {
        flexDirection: "column",
        textAlign: "center",
        gap: 24,
        "& > div:first-of-type img": {
            width: "100% !important",
            height: "auto !important",
            maxWidth: "400px",
        },
    },
}));

export const CleanText = styled(Box)(() => ({
    maxWidth: 500,
    color: "#004b63",
    "@media (max-width: 900px)": {
        maxWidth: "100%",
        padding: "0 8px",
    },
    "& .badge": {
        display: "inline-block",
        background: "#fff",
        color: "#0077b6",
        fontSize: 13,
        fontWeight: 500,
        padding: "6px 14px",
        borderRadius: 50,
        marginBottom: 14,
        "@media (max-width: 768px)": {
            fontSize: 11,
            padding: "5px 12px",
            marginBottom: 10,
        },
    },
    "& h3": {
        color: "#003554",
        fontSize: 28,
        fontWeight: 700,
        marginBottom: 14,
        "@media (max-width: 768px)": {
            fontSize: 22,
            lineHeight: 1.3,
            marginBottom: 10,
        },
    },
    "& p": {
        fontSize: 15,
        marginBottom: 18,
        lineHeight: 1.6,
        "@media (max-width: 768px)": {
            fontSize: 14,
            marginBottom: 14,
            lineHeight: 1.5,
        },
    },
    "& ul": {
        listStyle: "none",
        padding: 0,
        fontSize: 15,
        lineHeight: 1.8,
        "@media (max-width: 768px)": {
            fontSize: 14,
            lineHeight: 1.7,
            textAlign: "left",
            maxWidth: "320px",
            margin: "0 auto",
        },
    },
    "& li": {
        position: "relative",
        paddingLeft: 28,
        marginBottom: 10,
        "@media (max-width: 768px)": {
            paddingLeft: 24,
            marginBottom: 8,
        },
    },
    "& li::before": {
        content: "'✔'",
        position: "absolute",
        left: 0,
        top: 0,
        color: "#00a6d6",
        fontWeight: "bold",
    },
}));

/* MISSION SECTION */
export const MissionSection = styled(Box)(() => ({
    position: "relative",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    overflow: "hidden",
    "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        background: 'url("/images/coast.jpg") center center / cover no-repeat',
        filter: "brightness(1.05)",
        transform: "scale(1.05)",
        zIndex: 0,
    },
    "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        background:
            "linear-gradient(to right, rgba(8,145,178,0.85) 25%, rgba(103,232,195,0.6) 90%)",
        zIndex: 1,
    },
    "@media (max-width: 768px)": {
        height: "auto",
        minHeight: "80vh",
        padding: "60px 16px",
    },
}));

export const MissionContent = styled(Box)(() => ({
    position: "relative",
    zIndex: 2,
    maxWidth: 800,
    color: "#ffffff",
    padding: "0 20px",
    "& .badge": {
        display: "inline-block",
        background: "rgba(255,255,255,0.15)",
        color: "#e3f9ff",
        fontSize: 13,
        fontWeight: 500,
        padding: "6px 14px",
        borderRadius: 50,
        marginBottom: 14,
        letterSpacing: 1,
        "@media (max-width: 768px)": {
            fontSize: 11,
            padding: "5px 12px",
            marginBottom: 10,
        },
    },
    "& h3": {
        fontSize: 52,
        fontWeight: 700,
        lineHeight: 1.2,
        marginBottom: 16,
        "@media (max-width: 768px)": {
            fontSize: 28,
            lineHeight: 1.25,
            marginBottom: 12,
            wordWrap: "break-word",
            hyphens: "auto",
        },
        "@media (max-width: 480px)": {
            fontSize: 24,
        },
    },
    "& p": {
        fontSize: 18,
        color: "#d9f3f8",
        marginBottom: 40,
        lineHeight: 1.6,
        "@media (max-width: 768px)": {
            fontSize: 14,
            lineHeight: 1.5,
            marginBottom: 30,
            padding: "0 8px",
        },
    },
    "@media (max-width: 768px)": {
        padding: "0 16px",
        maxWidth: "100%",
    },
}));

export const MissionButton = styled(Button)(() => ({
    padding: "12px 28px",
    fontSize: 15,
    borderRadius: 6,
    background: "#fff",
    color: "#0077b6",
    fontWeight: 600,
    "&:hover": { background: "#e0f7fa", color: "#005c85" },
    "@media (max-width: 768px)": {
        width: "100%",
        maxWidth: "280px",
        padding: "11px 24px",
        fontSize: 14,
    },
}));