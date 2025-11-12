import { styled } from "@mui/material/styles";
import { Card, TextField } from "@mui/material";

// 🔹 Glass Effect Container
export const GlassCard = styled(Card)(({ theme }) => ({
    backdropFilter: "blur(20px)",
    backgroundColor: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "20px",
    padding: theme.spacing(4),
    width: "100%",
    [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(3),
        borderRadius: "16px",
    },
}));

// 🔹 TextField with glass border + glowing focus
export const StyledTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: "10px",
        transition: "border-color 0.3s ease",
        "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
        "&:hover fieldset": { borderColor: "rgba(255,255,255,0.35)" },
        "&.Mui-focused fieldset": { borderColor: "#0891b2" },
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

// 🔹 Stats section (bottom metrics)
export const StatsBox = {
    display: "flex",
    justifyContent: "space-around",
    mt: 3,
    pt: 2,
    borderTop: "1px solid rgba(255,255,255,0.1)",
    textAlign: "center",
};

// 🔹 Background (Ocean gradient + blur overlay)
export const BackgroundStyle = {
    minHeight: "100vh",
    width: "100%",
    backgroundImage: {
        xs: `linear-gradient(rgba(0,40,80,0.7), rgba(0,90,150,0.7)), url('/images/login-2-mobile.webp')`,
        md: `linear-gradient(rgba(0,40,80,0.55), rgba(0,90,150,0.55)), url('/images/login-2-optimized.webp')`,
    },
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: { xs: "scroll", md: "fixed" },
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflowY: "auto",
};

// 🔹 Button style (white primary CTA)
export const PrimaryButtonStyle = {
    background: "#fff",
    color: "#0891b2",
    fontWeight: 700,
    py: 1.3,
    borderRadius: "10px",
    textTransform: "none",
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
    "&:hover": { background: "rgba(255,255,255,0.95)" },
    "&:disabled": {
        background: "rgba(255,255,255,0.5)",
        color: "rgba(8,145,178,0.5)",
    },
};
