export const styles = {
  container: {
    padding: { xs: "20px", md: "40px" },
    maxWidth: "1400px",
    margin: "0 auto",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
  },

  // Header
  header: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
  },

  // Main Content Layout
  mainContent: {
    display: "flex",
    gap: "24px",
    flexDirection: { xs: "column", md: "row" },
  },

  // Left Sidebar
  sidebar: {
    width: { xs: "100%", md: "280px" },
    flexShrink: 0,
  },

  // Avatar Section
  avatarSection: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "32px 24px",
    textAlign: "center",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    marginBottom: "16px",
  },
  avatar: {
    width: "100px",
    height: "100px",
    margin: "0 auto 16px",
    backgroundColor: "#14b8a6",
  },
  avatarIcon: {
    fontSize: "50px",
    color: "#ffffff",
  },
  userName: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: "4px",
  },
  userLocation: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "12px",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#cffafe",
    color: "#0e7490",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "16px",
  },
  userBio: {
    fontSize: "13px",
    color: "#4b5563",
    lineHeight: 1.6,
    textAlign: "left",
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },

  // User Info
  userInfo: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    marginBottom: "16px",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
    "&:last-child": {
      marginBottom: 0,
    },
  },
  infoIcon: {
    fontSize: "18px",
    color: "#6b7280",
  },
  infoText: {
    fontSize: "13px",
    color: "#4b5563",
  },

  // Sign Out Button
  signOutButton: {
    width: "100%",
    backgroundColor: "#ffffff",
    color: "#6b7280",
    padding: "12px",
    borderRadius: "8px",
    textTransform: "none",
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "16px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    justifyContent: "flex-start",
    gap: "10px",
    "&:hover": {
      backgroundColor: "#f9fafb",
    },
  },
  signOutIcon: {
    fontSize: "18px",
  },

  // Quick Stats
  quickStats: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  quickStatsTitle: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "16px",
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
    "&:last-child": {
      marginBottom: 0,
    },
  },
  statIcon: {
    fontSize: "20px",
  },
  statLabel: {
    fontSize: "13px",
    color: "#6b7280",
    flex: 1,
  },
  statValue: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#1a1a1a",
  },

  // Right Content
  rightContent: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },

  // Tabs
  tabs: {
    display: "flex",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
  },
  tab: {
    flex: 1,
    padding: "16px 24px",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: 500,
    color: "#6b7280",
    cursor: "pointer",
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: "#f3f4f6",
    },
  },
  activeTab: {
    color: "#0ea5e9",
    backgroundColor: "#ffffff",
    borderBottom: "2px solid #0ea5e9",
  },

  // Tab Content
  tabContent: {
    padding: "32px",
  },

  // Section
  section: {
    marginBottom: "32px",
    "&:last-child": {
      marginBottom: 0,
    },
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "24px",
  },

  // Edit Button
  editButton: {
    color: "#6b7280",
    textTransform: "none",
    fontSize: "14px",
    fontWeight: 500,
    gap: "6px",
    padding: "8px 16px",
    "&:hover": {
      backgroundColor: "#f9fafb",
    },
  },
  editIcon: {
    fontSize: "18px",
  },

  // Form
  formGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
  },
  value: {
    fontSize: "14px",
    color: "#6b7280",
    padding: "10px 0",
  },
  bioValue: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: 1.6,
    padding: "10px 0",
  },
  input: {
    "& .MuiOutlinedInput-root": {
      fontSize: "14px",
      backgroundColor: "#f9fafb",
      "& fieldset": {
        borderColor: "#e5e7eb",
      },
      "&:hover fieldset": {
        borderColor: "#d1d5db",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#0ea5e9",
      },
    },
  },

  // Buttons
  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
    justifyContent: "flex-end",
  },
  cancelButton: {
    padding: "10px 24px",
    textTransform: "none",
    fontSize: "14px",
    fontWeight: 500,
    color: "#6b7280",
    border: "1px solid #e5e7eb",
    "&:hover": {
      backgroundColor: "#f9fafb",
    },
  },
  saveButton: {
    padding: "10px 24px",
    textTransform: "none",
    fontSize: "14px",
    fontWeight: 500,
    backgroundColor: "#0ea5e9",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#0284c7",
    },
  },

  // Achievements
  achievementsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "20px",
  },
  achievementItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  achievementLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  achievementIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  achievementIconSvg: {
    fontSize: "28px",
    color: "#0ea5e9",
  },
  achievementName: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "4px",
  },
  achievementDate: {
    fontSize: "13px",
    color: "#6b7280",
  },
  rarityBadge: {
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
  },

  // View All Button
  viewAllButton: {
    width: "100%",
    padding: "12px",
    textTransform: "none",
    fontSize: "14px",
    fontWeight: 500,
    color: "#6b7280",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#f9fafb",
    },
  },

  // Settings
  settingsGroup: {
    marginBottom: "32px",
    "&:last-child": {
      marginBottom: 0,
    },
  },
  settingsGroupTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "16px",
    marginTop: "8px",
  },
  settingItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    marginBottom: "12px",
    border: "1px solid #e5e7eb",
    gap: "20px",
  },
  settingLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "4px",
  },
  settingDescription: {
    fontSize: "13px",
    color: "#6b7280",
    lineHeight: 1.4,
  },
  switch: {
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "#10b981",
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#10b981",
    },
  },
  changePasswordButton: {
    width: "100%",
    padding: "12px",
    textTransform: "none",
    fontSize: "14px",
    fontWeight: 500,
    color: "#0ea5e9",
    border: "1px solid #0ea5e9",
    borderRadius: "8px",
    marginBottom: "12px",
    "&:hover": {
      backgroundColor: "#f0f9ff",
    },
  },
  deleteAccountButton: {
    width: "100%",
    padding: "12px",
    textTransform: "none",
    fontSize: "14px",
    fontWeight: 500,
    color: "#ef4444",
    border: "1px solid #ef4444",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#fef2f2",
    },
  },
};
