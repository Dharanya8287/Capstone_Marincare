"use client";
import React, { useState, useRef, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useAuthContext } from "@/context/AuthContext"; // Import context hook
import {
    Box,
    Typography,
    Button,
    InputAdornment,
    IconButton,
    FormControlLabel,
    Checkbox,
    Grid,
    Divider,
    Container,
} from "@mui/material";
import {
    Visibility,
    VisibilityOff,
    Email,
    Lock,
    Person,
    CheckCircle,
    Google as GoogleIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
    GlassCard,
    StyledTextField,
    BackgroundStyle,
    PrimaryButtonStyle,
    FeatureBoxStyle,
} from "./signup.styles";

export default function SignupPage() {
    const { signup, googleLogin } = useAuth();
    const { isAuthenticated } = useAuthContext(); // Get auth state from context
    const router = useRouter();

    const [isLoaded, setIsLoaded] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmPassword: false });
    const [formErrors, setFormErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [emailStatus, setEmailStatus] = useState({ checking: false, exists: false, message: "" });
    const debounceRef = useRef(null);

    // This effect redirects the user away from the signup page if they are already logged in.
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/landing"); // Or your desired authenticated page
        }
    }, [isAuthenticated, router]);

    // This useEffect is for the initial fade-in animation.
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // All complex redirect-handling useEffect logic has been removed from this file.

    // All your form validation and handler functions remain the same.
    const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    const isValidPassword = (password) => password && password.length >= 6 && /[a-zA-Z]/.test(password);
    const toggleShowPassword = () => setShowPassword((p) => !p);
    const checkEmailAvailability = (email) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!email || !isValidEmail(email)) {
            setEmailStatus({ checking: false, exists: false, message: "" });
            return;
        }
        debounceRef.current = setTimeout(async () => {
            try {
                setEmailStatus({ checking: true, exists: false, message: "" });
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-email`, { params: { email } });
                const exists = res.data.exists;
                setEmailStatus({ checking: false, exists, message: exists ? " This email is already registered." : " Email available for registration." });
            } catch {
                setEmailStatus({ checking: false, exists: false, message: "" });
            }
        }, 600);
    };
    const validateField = (name, value) => {
        switch (name) {
            case "name":
                if (!value.trim()) return "Full name is required";
                if (value.trim().length < 2) return "Name must be at least 2 characters";
                if (!/^[A-Za-z\s]+$/.test(value)) return "Please enter a valid name";
                return "";
            case "email":
                if (!value.trim()) return "Email is required";
                if (!isValidEmail(value)) return "Enter a valid email address";
                if (emailStatus.exists) return "This email is already registered.";
                return "";
            case "password":
                if (!value) return "Password is required";
                if (!isValidPassword(value)) return "Password must be at least 6 characters long";
                return "";
            case "confirmPassword":
                if (!value) return "Please confirm your password";
                if (value !== form.password) return "Passwords do not match";
                return "";
            default: return "";
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (name === "email") checkEmailAvailability(value);
        if (touched[name]) {
            const error = validateField(name, value);
            setFormErrors((prev) => ({ ...prev, [name]: error || undefined }));
        }
    };
    const handleBlur = (name) => {
        setTouched((prev) => ({ ...prev, [name]: true }));
        const error = validateField(name, form[name]);
        if (error) setFormErrors((prev) => ({ ...prev, [name]: error }));
    };
    const validateForm = () => {
        const errors = {};
        Object.keys(form).forEach((field) => {
            const error = validateField(field, form[field]);
            if (error) errors[field] = error;
        });
        if (!agree) errors.agree = "You must agree to the Terms of Service and Privacy Policy to continue";
        return errors;
    };

    // Signup Handlers
    const handleSignup = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        try {
            setLoading(true);
            await signup(form.email, form.password);
            // On success, the AuthProvider will detect the new user and the useEffect will redirect.
        } catch (err) {
            setFormErrors({ global: err.message || "Signup failed. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setGoogleLoading(true);
        try {
            // This just starts the redirect. The AuthProvider handles the result.
            await googleLogin();
        } catch (err) {
            setGoogleLoading(false);
            setFormErrors({ global: err.message || "Could not start Google sign-in." });
        }
    };

    if (isAuthenticated) {
        return null;
    }
    return (
        <Box
            sx={{
                ...BackgroundStyle,
                opacity: isLoaded ? 1 : 0,
                transition: "opacity 0.8s ease-in-out",
            }}
        >
            <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4, md: 6 } }}>
                <Grid
                    container
                    spacing={{ xs: 3, sm: 4, md: 6 }}
                    alignItems="center"
                    justifyContent="center"
                >
                    {/* LEFT PANEL – Branding */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        lg={5}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: { xs: "center", md: "flex-end" },
                            textAlign: { xs: "center", md: "right" },
                            color: "#fff",
                            animation: isLoaded ? "slideInLeft 0.8s ease-out" : "none",
                            "@keyframes slideInLeft": {
                                "0%": {
                                    opacity: 0,
                                    transform: "translateX(-50px)",
                                },
                                "100%": {
                                    opacity: 1,
                                    transform: "translateX(0)",
                                },
                            },
                        }}
                    >
                        {/* Logo + Title */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: { xs: "center", md: "flex-end" },
                                mb: { xs: 2, sm: 3, md: 4 },
                                gap: { xs: 1.5, sm: 2 },
                            }}
                        >
                            <Box
                                sx={{
                                    width: { xs: 44, sm: 48, md: 52 },
                                    height: { xs: 44, sm: 48, md: 52 },
                                    borderRadius: { xs: "10px", md: "12px" },
                                    backgroundColor: "rgba(255,255,255,0.9)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                }}
                            >
                                {/* LOGO PATH */}
                                <img
                                    src="/images/logoblue.png"
                                    alt="WaveGuard Logo"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                        padding: "8px"
                                    }}
                                />
                            </Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    letterSpacing: "0.5px",
                                    fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
                                }}
                            >
                                WaveGuard
                            </Typography>
                        </Box>

                        {/* Tagline */}
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 400,
                                mb: { xs: 3, sm: 4, md: 5 },
                                opacity: 0.9,
                                maxWidth: { xs: "100%", sm: 500, md: 420 },
                                lineHeight: 1.4,
                                fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
                                px: { xs: 2, sm: 0 },
                            }}
                        >
                            Start your impact journey today. Join our global community of
                            eco-volunteers creating cleaner coasts and a sustainable future.
                        </Typography>

                        {/* Features */}
                        <Box sx={FeatureBoxStyle}>
                            {[
                                "AI-powered waste classification",
                                "Track your environmental impact",
                                "Join community challenges",
                                "Earn badges and achievements",
                            ].map((f, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: i < 3 ? { xs: 1.5, md: 2 } : 0,
                                    }}
                                >
                                    <CheckCircle
                                        sx={{
                                            color: "#0891b2",
                                            fontSize: { xs: 18, md: 20 },
                                            mr: { xs: 1.5, md: 2 },
                                            opacity: 0.9,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            opacity: 0.95,
                                            fontSize: { xs: "0.9rem", md: "1rem" },
                                        }}
                                    >
                                        {f}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    {/* RIGHT PANEL – Form */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        lg={5}
                        sx={{
                            animation: isLoaded ? "slideInRight 0.8s ease-out" : "none",
                            "@keyframes slideInRight": {
                                "0%": {
                                    opacity: 0,
                                    transform: "translateX(50px)",
                                },
                                "100%": {
                                    opacity: 1,
                                    transform: "translateX(0)",
                                },
                            },
                        }}
                    >
                        <GlassCard
                            sx={{ width: "100%", maxWidth: { xs: "100%", sm: 480, md: 440 } }}
                        >
                            {/* Header */}
                            <Typography
                                variant="h5"
                                align="center"
                                fontWeight={700}
                                color="#fff"
                                mb={0.5}
                            >
                                Create Your Account
                            </Typography>
                            <Typography
                                variant="body2"
                                align="center"
                                color="rgba(255,255,255,0.7)"
                                mb={3}
                            >
                                Join 2,800+ volunteers making a real difference
                            </Typography>

                            {/* Messages */}
                            {successMessage && (
                                <Typography
                                    align="center"
                                    sx={{
                                        color: "#10b981",
                                        backgroundColor: "rgba(16,185,129,0.1)",
                                        p: 1,
                                        borderRadius: "8px",
                                        mb: 2,
                                        fontWeight: 500,
                                    }}
                                >
                                    {successMessage}
                                </Typography>
                            )}

                            {formErrors.global && (
                                <Typography
                                    align="center"
                                    sx={{
                                        color: "#ef4444",
                                        backgroundColor: "rgba(239,68,68,0.1)",
                                        p: 1,
                                        borderRadius: "8px",
                                        mb: 2,
                                        fontWeight: 500,
                                    }}
                                >
                                    {formErrors.global}
                                </Typography>
                            )}

                            {/* Google Button */}
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleGoogleSignup}
                                disabled={googleLoading}
                                startIcon={<GoogleIcon />}
                                sx={{
                                    mb: 2,
                                    py: 1.2,
                                    borderColor: "rgba(255,255,255,0.2)",
                                    color: "#fff",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    "&:hover": { background: "rgba(255,255,255,0.1)" },
                                }}
                            >
                                {googleLoading
                                    ? "Signing in with Google..."
                                    : "Continue with Google"}
                            </Button>

                            {/* OR Divider */}
                            <Box sx={{ position: "relative", my: 2.5 }}>
                                <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
                                <Typography
                                    sx={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        px: 2,
                                        color: "rgba(255,255,255,0.6)",
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                    }}
                                >
                                    OR
                                </Typography>
                            </Box>

                            {/* SIGNUP FORM */}
                            <form onSubmit={handleSignup}>
                                {/* Name */}
                                <Box sx={{ mb: 2.5 }}>
                                    <StyledTextField
                                        name="name"
                                        placeholder="Full Name"
                                        fullWidth
                                        value={form.name}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("name")}
                                        error={touched.name && !!formErrors.name}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Person sx={{ color: "rgba(255,255,255,0.6)" }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {touched.name && formErrors.name && (
                                        <Typography
                                            sx={{
                                                color: "#ef4444",
                                                fontSize: "0.8rem",
                                                mt: 0.5,
                                                ml: 0.5,
                                            }}
                                        >
                                            {formErrors.name}
                                        </Typography>
                                    )}
                                </Box>

                                {/* Email */}
                                <Box sx={{ mb: 2.5 }}>
                                    <StyledTextField
                                        name="email"
                                        placeholder="Email"
                                        fullWidth
                                        value={form.email}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("email")}
                                        error={touched.email && !!formErrors.email}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email sx={{ color: "rgba(255,255,255,0.6)" }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {emailStatus.checking ? (
                                        <Typography
                                            sx={{
                                                color: "#facc15",
                                                fontSize: "0.8rem",
                                                mt: 0.5,
                                                ml: 0.5,
                                            }}
                                        >
                                            Checking email...
                                        </Typography>
                                    ) : emailStatus.message ? (
                                        <Typography
                                            sx={{
                                                color: emailStatus.exists ? "#ef4444" : "#10b981",
                                                fontSize: "0.8rem",
                                                mt: 0.5,
                                                ml: 0.5,
                                            }}
                                        >
                                            {emailStatus.message}
                                        </Typography>
                                    ) : touched.email && formErrors.email ? (
                                        <Typography
                                            sx={{
                                                color: "#ef4444",
                                                fontSize: "0.8rem",
                                                mt: 0.5,
                                                ml: 0.5,
                                            }}
                                        >
                                            {formErrors.email}
                                        </Typography>
                                    ) : null}
                                </Box>

                                {/* Password */}
                                <Box sx={{ mb: 2.5 }}>
                                    <StyledTextField
                                        name="password"
                                        placeholder="Password"
                                        type={showPassword ? "text" : "password"}
                                        fullWidth
                                        value={form.password}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("password")}
                                        error={touched.password && !!formErrors.password}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock sx={{ color: "rgba(255,255,255,0.6)" }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={toggleShowPassword}
                                                        sx={{ color: "rgba(255,255,255,0.6)" }}
                                                    >
                                                        {showPassword ? (
                                                            <VisibilityOff fontSize="small" />
                                                        ) : (
                                                            <Visibility fontSize="small" />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {touched.password && formErrors.password && (
                                        <Typography
                                            sx={{
                                                color: "#ef4444",
                                                fontSize: "0.8rem",
                                                mt: 0.5,
                                                ml: 0.5,
                                            }}
                                        >
                                            {formErrors.password}
                                        </Typography>
                                    )}
                                </Box>

                                {/* Confirm Password */}
                                <Box sx={{ mb: 2.5 }}>
                                    <StyledTextField
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        type={showPassword ? "text" : "password"}
                                        fullWidth
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("confirmPassword")}
                                        error={touched.confirmPassword && !!formErrors.confirmPassword}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock sx={{ color: "rgba(255,255,255,0.6)" }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {touched.confirmPassword && formErrors.confirmPassword && (
                                        <Typography
                                            sx={{
                                                color: "#ef4444",
                                                fontSize: "0.8rem",
                                                mt: 0.5,
                                                ml: 0.5,
                                            }}
                                        >
                                            {formErrors.confirmPassword}
                                        </Typography>
                                    )}
                                </Box>

                                {/* Terms */}
                                <Box sx={{ mb: 2 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={agree}
                                                onChange={(e) => setAgree(e.target.checked)}
                                                sx={{
                                                    color: "rgba(255,255,255,0.6)",
                                                    "&.Mui-checked": { color: "#0891b2" },
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography
                                                variant="body2"
                                                color="rgba(255,255,255,0.8)"
                                            >
                                                I agree to the{" "}
                                                <span
                                                    style={{
                                                        color: "#0891b2",
                                                        textDecoration: "underline",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Terms of Service
                                                </span>{" "}
                                                and{" "}
                                                <span
                                                    style={{
                                                        color: "#0891b2",
                                                        textDecoration: "underline",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Privacy Policy
                                                </span>
                                            </Typography>
                                        }
                                    />
                                    {formErrors.agree && (
                                        <Typography
                                            sx={{
                                                color: "#ef4444",
                                                fontSize: "0.8rem",
                                                mt: 0.5,
                                                ml: 0.5,
                                            }}
                                        >
                                            {formErrors.agree}
                                        </Typography>
                                    )}
                                </Box>

                                {/* Submit */}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    sx={PrimaryButtonStyle}
                                >
                                    {loading ? "Creating Account..." : "Create Account"}
                                </Button>

                                <Divider
                                    sx={{
                                        my: { xs: 1.5, sm: 2 },
                                        borderColor: "rgba(255,255,255,0.1)",
                                    }}
                                />

                                {/* Redirects */}
                                <Typography
                                    variant="body2"
                                    align="center"
                                    color="rgba(255,255,255,0.8)"
                                    sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" }, mb: 1 }}
                                >
                                    Already have an account?{" "}
                                    <span
                                        style={{
                                            color: "#fff",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                        }}
                                        onClick={() => router.push("/login")}
                                    >
                                        Sign in
                                    </span>
                                </Typography>

                                <Typography
                                    variant="body2"
                                    align="center"
                                    color="rgba(255,255,255,0.7)"
                                    sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem" } }}
                                >
                                    <span
                                        style={{
                                            color: "#0891b2",
                                            textDecoration: "underline",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => router.push("/forgot-password")}
                                    >
                                        Forgot your password?
                                    </span>
                                </Typography>
                            </form>
                        </GlassCard>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}