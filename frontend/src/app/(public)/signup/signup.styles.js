import { styled } from "@mui/material/styles";
import { Card, TextField } from "@mui/material";

// 🔹 Glass Effect Card
export const GlassCard = styled(Card)(({ theme }) => ({
    backdropFilter: "blur(20px)",
    backgroundColor: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "20px",
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(3),
        borderRadius: "16px",
    },
    [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(2.5),
    },
}));

// 🔹 Styled Input Fields
export const StyledTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: "10px",
        "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
        "&:hover fieldset": { borderColor: "rgba(255,255,255,0.35)" },
        "&.Mui-focused fieldset": { borderColor: "rgba(255,255,255,0.5)" },
    },
    "& .MuiInputBase-input": {
        color: "#fff",
        fontSize: "15px",
        [theme.breakpoints.down("sm")]: {
            fontSize: "14px",
            padding: "14px",
        },
    },
    "& .MuiInputLabel-root": {
        color: "rgba(255,255,255,0.7)",
    },
}));

// 🔹 Page Background (ocean gradient)
export const BackgroundStyle = {
    minHeight: "100vh",
    width: "100%",
    backgroundImage: {
        xs: `linear-gradient(rgba(0,60,110,0.75), rgba(0,120,180,0.75)), url('/images/login-mobile.webp')`,
        md: `linear-gradient(rgba(0,60,110,0.55), rgba(0,120,180,0.55)), url('/images/login-optimized.webp')`,
    },
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: { xs: "scroll", md: "fixed" },
    overflowY: "auto",
    display: "flex",
    alignItems: "center",
};

// 🔹 Primary Button Style
export const PrimaryButtonStyle = {
    mt: { xs: 1.5, sm: 2 },
    mb: { xs: 1.5, sm: 2 },
    background: "#fff",
    color: "#0891b2",
    py: { xs: 1.1, sm: 1.3 },
    fontWeight: 700,
    fontSize: { xs: "0.9rem", sm: "0.9375rem" },
    borderRadius: "10px",
    textTransform: "none",
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
    "&:hover": { background: "rgba(255,255,255,0.95)" },
    "&:disabled": {
        background: "rgba(255,255,255,0.5)",
        color: "rgba(8,145,178,0.5)",
    },
};

// 🔹 Left Feature Box Style
export const FeatureBoxStyle = {
    backdropFilter: "blur(20px)",
    backgroundColor: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: { xs: "12px", md: "16px" },
    p: { xs: 2, sm: 2.5, md: 3 },
    width: "100%",
    maxWidth: { xs: "100%", sm: 500, md: 420 },
    display: { xs: "none", sm: "block" },
};
