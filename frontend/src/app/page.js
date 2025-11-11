"use client";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

const FACTS = [
  "Every year, 8 million tons of plastic enter our oceans.",
  "Ocean cleanup volunteers remove up to 500kg of waste daily.",
  "Coastal cleanups improve marine biodiversity by 40%.",
  "Join 2,800+ volunteers making a real environmental impact.",
];

export default function HomePage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const currentFact = FACTS[factIndex];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex < currentFact.length) {
        setDisplayedText(currentFact.substring(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setDisplayedText("");
          setFactIndex((prev) => (prev + 1) % FACTS.length);
        }, 3000);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [factIndex]);

  const handleClick = () => {
    router.push("/landing");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundImage: "url('/images/login.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "#fff",
        p: 2,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 1,
        },
      }}
    >
      {/* Content container */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          animation: isLoaded ? "fadeInScale 0.8s ease-out" : "none",
          "@keyframes fadeInScale": {
            "0%": {
              opacity: 0,
              transform: "scale(0.9) translateY(20px)",
            },
            "100%": {
              opacity: 1,
              transform: "scale(1) translateY(0)",
            },
          },
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src="/images/logowhite.png"
          alt="WaveGuard Logo"
          sx={{
            height: "100px",
            marginBottom: 3,
            animation: isLoaded ? "slideInDown 0.8s ease-out both" : "none",
            "@keyframes slideInDown": {
              "0%": {
                opacity: 0,
                transform: "translateY(-30px)",
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        />

        {/* Title with staggered animation */}
        <Typography
          variant="h3"
          fontWeight={700}
          mb={2}
          sx={{
            animation: isLoaded
              ? "slideInDown 0.8s ease-out 0.2s both"
              : "none",
            background:
              "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.95) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "0.5px",
            "@keyframes slideInDown": {
              "0%": {
                opacity: 0,
                transform: "translateY(-30px)",
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          Welcome to WaveGuard
        </Typography>

        {/* Subtitle with fade-in animation */}
        <Typography
          variant="h6"
          mb={4}
          sx={{
            opacity: 0.85,
            animation: isLoaded ? "fadeIn 1s ease-out 0.4s both" : "none",
            "@keyframes fadeIn": {
              "0%": { opacity: 0 },
              "100%": { opacity: 0.85 },
            },
          }}
        >
          Join 2,800+ volunteers making a real environmental impact.
        </Typography>

        {/* Button with hover animation */}
        <Button
          onClick={handleClick}
          variant="contained"
          sx={{
            backgroundColor: "#fff",
            color: "#0891b2",
            fontWeight: 700,
            px: 5,
            py: 1.5,
            borderRadius: "12px",
            textTransform: "none",
            boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            animation: isLoaded ? "slideInUp 0.8s ease-out 0.6s both" : "none",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 0,
              height: 0,
              borderRadius: "50%",
              backgroundColor: "rgba(8, 145, 178, 0.1)",
              transform: "translate(-50%, -50%)",
              transition: "width 0.6s, height 0.6s",
            },
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.9)",
              transform: "translateY(-3px)",
              boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
              "&::before": {
                width: "300px",
                height: "300px",
              },
            },
            "&:active": {
              transform: "translateY(-1px)",
            },
            "@keyframes slideInUp": {
              "0%": {
                opacity: 0,
                transform: "translateY(30px)",
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          Get Started
        </Button>

        {/* Typing Animation Facts */}
        <Box
          sx={{
            mt: 5,
            animation: isLoaded ? "slideInUp 0.8s ease-out 1.4s both" : "none",
            maxWidth: 500,
            px: 3,
            "@keyframes slideInUp": {
              "0%": {
                opacity: 0,
                transform: "translateY(30px)",
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          <Typography
            sx={{
              fontSize: "1.1rem",
              fontWeight: 600,
              opacity: 0.95,
              textAlign: "center",
              fontStyle: "italic",
              lineHeight: 1.6,
              color: "#fff",
              minHeight: 40,
              letterSpacing: "0.3px",
            }}
          >
            {displayedText}
            {displayedText.length < FACTS[factIndex].length && (
              <span
                style={{
                  marginLeft: "2px",
                  animation: "blink 0.7s infinite",
                }}
              >
                |
              </span>
            )}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
