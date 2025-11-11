import React from "react";
import { Card, CardContent, Typography, Box, LinearProgress } from "@mui/material";

const AchievementCard = ({ achievement }) => {
  const { title, description, status, progress, emoji } = achievement;

  const getProgressColor = () => {
    if (progress >= 80) return "#10b981";
    if (progress >= 50) return "#0ea5e9";
    return "#f59e0b";
  };

  return (
    <Card
      sx={{
        height: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: "12px",
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={700} color="#1e293b">
          {emoji} {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "#475569", mb: 1 }}>
          {description}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "inline-block",
            backgroundColor: "#e0f7fa",
            color: "#0077b6",
            borderRadius: "8px",
            px: 1,
            py: 0.5,
            fontWeight: 600,
          }}
        >
          {status}
        </Typography>
        <Box mt={2}>
          <Typography fontSize="13px" color="#64748b" mb={0.5}>
            Progress: {progress}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: "#e5e7eb",
              "& .MuiLinearProgress-bar": {
                backgroundColor: getProgressColor(),
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default AchievementCard;
