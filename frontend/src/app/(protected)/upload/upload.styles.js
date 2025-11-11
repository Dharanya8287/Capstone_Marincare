export const PageContainerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f8fafb",
    pb: 4,
};

export const MainContainerStyle = {
    pt: { xs: 2, sm: 3, md: 4 },
};

export const HeaderBoxStyle = {
    textAlign: "center",
    mb: { xs: 3, sm: 4, md: 5 },
};

export const HeaderTitleStyle = {
    fontWeight: 700,
    color: "#0d1b2a",
    mb: 1.5,
    fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
};

export const HeaderSubtitleStyle = {
    color: "#64748b",
    maxWidth: 600,
    mx: "auto",
    fontSize: { xs: "0.95rem", sm: "1rem" },
    px: 2,
};

export const UploadZoneStyle = {
    p: { xs: 3, sm: 4, md: 5 },
    mb: 4,
    borderRadius: "16px",
    transition: "all 0.3s ease",
    textAlign: "center",
};

export const UploadIconContainerStyle = {
    width: 80,
    height: 80,
    borderRadius: "50%",
    backgroundColor: "#e0f2fe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mb: 1,
};

export const ChooseFileButtonStyle = {
    backgroundColor: "#0891b2",
    color: "#fff",
    px: 3,
    py: 1.2,
    borderRadius: "10px",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "1rem",
    "&:hover": {
        backgroundColor: "#0e7490",
    },
};

export const TakePhotoButtonStyle = {
    borderColor: "#0891b2",
    color: "#0891b2",
    px: 3,
    py: 1.2,
    borderRadius: "10px",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "1rem",
    "&:hover": {
        borderColor: "#0e7490",
        backgroundColor: "#f0f9ff",
    },
};

export const PreviewCardStyle = {
    p: 3,
    mb: 4,
    borderRadius: "16px",
    backgroundColor: "#fff",
};

export const PreviewImageContainerStyle = {
    position: "relative",
    paddingTop: "100%",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
};

export const PreviewImageStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
};

export const RemoveFileButtonStyle = {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#fff",
    width: 28,
    height: 28,
    "&:hover": {
        backgroundColor: "rgba(0,0,0,0.8)",
    },
};

export const InfoCardStyle = {
    p: { xs: 3, sm: 4 },
    mb: 4,
    borderRadius: "16px",
    backgroundColor: "#f0f9ff",
    border: "1px solid #e0f2fe",
};

export const StepIconStyle = {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "#0891b2",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "1.25rem",
    flexShrink: 0,
};

export const WasteTypesContainerStyle = {
    p: { xs: 2.5, sm: 4 },
    borderRadius: "18px",
    background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(240,249,255,0.85) 100%)",
    backdropFilter: "blur(10px)",
    boxShadow: {
        xs: "0 4px 20px rgba(0,0,0,0.05)",
        sm: "none",
    },
    border: { xs: "1px solid rgba(14,116,144,0.1)", sm: "1px solid #e2e8f0" },
};

export const WasteTypeCardStyle = {
    p: { xs: 2, sm: 2.5 },
    borderRadius: "16px",
    background: "linear-gradient(145deg, #f9fafb 0%, #f0f9ff 100%)",
    border: "1px solid rgba(8,145,178,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    transition: "all 0.25s ease",
    cursor: "pointer",
    boxShadow: "0 3px 10px rgba(0,0,0,0.04)",
    "&:active": {
        transform: "scale(0.96)",
    },
    "&:hover": {
        background: "linear-gradient(145deg, #ecfeff 0%, #e0f7ff 100%)",
        boxShadow: "0 6px 18px rgba(8,145,178,0.15)",
    },
};

export const WasteTypeIconContainerStyle = {
    fontSize: "2rem",
    width: 52,
    height: 52,
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
    mb: 0.5,
    boxShadow: "inset 0 1px 2px rgba(255,255,255,0.5)",
};