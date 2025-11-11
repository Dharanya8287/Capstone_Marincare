import { styled } from "@mui/material/styles";
import { Box, Button, Card } from "@mui/material";

export const HeroSection = styled(Box)(({ theme }) => ({
    minHeight: "100vh",
    background: "linear-gradient(135deg, #003554 0%, #006494 50%, #0077b6 100%)",
    position: "relative",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    width: "100%",
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "url('/images/ocean-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.15,
    },
    [theme.breakpoints.down('sm')]: {
        minHeight: "auto",
        paddingTop: "60px",
        paddingBottom: "60px",
    },
}));

export const HeroOverlay = styled(Box)(({ theme }) => ({
    position: "relative",
    zIndex: 2,
    maxWidth: "1200px",
    width: "100%",
    margin: "0 auto",
    padding: "80px 24px",
    textAlign: "center",
    color: "#fff",
    [theme.breakpoints.down('md')]: {
        padding: "60px 20px",
    },
    [theme.breakpoints.down('sm')]: {
        padding: "40px 16px",
    },
}));

export const HeroTag = styled(Box)(({ theme }) => ({
    display: "inline-block",
    padding: "10px 24px",
    background: "rgba(103, 232, 195, 0.2)",
    border: "1px solid #67e8c3",
    borderRadius: "24px",
    color: "#67e8c3",
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "24px",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    [theme.breakpoints.down('sm')]: {
        fontSize: "12px",
        padding: "8px 16px",
        marginBottom: "16px",
    },
}));

export const HeroTitle = styled("h1")(({ theme }) => ({
    fontSize: "3.5rem",
    fontWeight: 800,
    marginBottom: "24px",
    lineHeight: 1.2,
    margin: "0 auto 24px",
    maxWidth: "900px",
    [theme.breakpoints.down('md')]: {
        fontSize: "2.5rem",
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: "1.75rem",
        marginBottom: "16px",
    },
}));

export const HeroDesc = styled("p")(({ theme }) => ({
    fontSize: "1.25rem",
    marginBottom: "40px",
    maxWidth: "800px",
    margin: "0 auto 40px",
    lineHeight: 1.7,
    color: "rgba(255, 255, 255, 0.95)",
    [theme.breakpoints.down('md')]: {
        fontSize: "1.125rem",
        marginBottom: "32px",
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: "1rem",
        marginBottom: "24px",
        lineHeight: 1.6,
    },
}));

export const HeroButtons = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "60px",
    [theme.breakpoints.down('sm')]: {
        marginBottom: "40px",
        gap: "12px",
    },
}));

export const PrimaryButton = styled(Button)(({ theme }) => ({
    padding: "16px 40px",
    background: "#67e8c3",
    color: "#003554",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    textTransform: "none",
    boxShadow: "0 4px 12px rgba(103, 232, 195, 0.3)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
        background: "#5dd4af",
        transform: "translateY(-2px)",
        boxShadow: "0 8px 24px rgba(103, 232, 195, 0.4)",
    },
    "&:active": {
        transform: "translateY(0)",
    },
    [theme.breakpoints.down('sm')]: {
        padding: "14px 32px",
        fontSize: "15px",
        width: "100%",
        maxWidth: "300px",
    },
}));

export const OutlineButton = styled(Button)(({ theme }) => ({
    padding: "16px 40px",
    background: "transparent",
    color: "#fff",
    border: "2px solid #fff",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    textTransform: "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
        background: "rgba(255, 255, 255, 0.15)",
        borderColor: "#67e8c3",
        color: "#67e8c3",
        transform: "translateY(-2px)",
    },
    "&:active": {
        transform: "translateY(0)",
    },
    [theme.breakpoints.down('sm')]: {
        padding: "14px 32px",
        fontSize: "15px",
        width: "100%",
        maxWidth: "300px",
    },
}));

export const StatsBox = styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "40px",
    marginTop: "60px",
    maxWidth: "900px",
    margin: "60px auto 0",
    padding: "0 20px",
    [theme.breakpoints.down('md')]: {
        gap: "30px",
        marginTop: "40px",
        gridTemplateColumns: "repeat(2, 1fr)",
    },
    [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: "1fr",
        gap: "20px",
        marginTop: "32px",
        padding: "0 16px",
    },
}));

export const Section = styled(Box)(({ theme }) => ({
    padding: "80px 24px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down('md')]: {
        padding: "60px 20px",
    },
    [theme.breakpoints.down('sm')]: {
        padding: "40px 16px",
    },
}));

export const SectionBadge = styled(Box)(({ theme }) => ({
    display: "inline-block",
    padding: "10px 24px",
    background: "rgba(0, 119, 182, 0.1)",
    border: "1px solid #0077b6",
    borderRadius: "24px",
    color: "#0077b6",
    fontSize: "14px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    [theme.breakpoints.down('sm')]: {
        fontSize: "12px",
        padding: "8px 16px",
    },
}));

export const FeatureGrid = styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "32px",
    marginTop: "48px",
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "24px",
    },
    [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: "1fr",
        gap: "20px",
    },
}));

export const FeatureCard = styled(Card)(({ theme }) => ({
    padding: "32px 24px",
    background: "#fff",
    borderRadius: "20px",
    border: "1px solid #e3f2fd",
    textAlign: "center",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: "0 20px 40px rgba(0, 119, 182, 0.15)",
        borderColor: "#0077b6",
    },
    [theme.breakpoints.down('sm')]: {
        padding: "24px 20px",
    },
}));

export const StatCard = styled(Card)(({ theme }) => ({
    height: "100%",
    borderRadius: "20px",
    border: "2px solid #e3f2fd",
    textAlign: "center",
    padding: "32px 24px",
    background: "#fff",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: "0 20px 40px rgba(0, 119, 182, 0.15)",
        borderColor: "#0077b6",
    },
    "& .MuiCardContent-root": {
        padding: "0 !important",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    [theme.breakpoints.down('sm')]: {
        padding: "28px 20px",
    },
}));

export const ImpactBox = styled(Box)(({ theme }) => ({
    marginTop: "48px",
    padding: "48px 40px",
    background: "#f0f9ff",
    borderRadius: "20px",
    border: "2px solid #b3e0ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down('md')]: {
        padding: "40px 32px",
    },
    [theme.breakpoints.down('sm')]: {
        marginTop: "32px",
        padding: "32px 20px",
    },
}));

export const CTASection = styled(Box)(({ theme }) => ({
    background: "linear-gradient(135deg, #67e8c3 0%, #48c9a8 100%)",
    padding: "100px 24px",
    textAlign: "center",
    width: "100%",
    [theme.breakpoints.down('md')]: {
        padding: "80px 20px",
    },
    [theme.breakpoints.down('sm')]: {
        padding: "60px 16px",
    },
}));

// Legacy exports for backward compatibility
export const WorkSection = Section;
export const WorkBadge = SectionBadge;
export const WorkGrid = FeatureGrid;
export const WorkCard = FeatureCard;