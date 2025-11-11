import React from "react";

const LeaderboardRow = ({ row }) => {
  return (
    <tr
      style={{
        transition: "background 0.25s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#e0f7fa")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <td style={{ padding: "14px 20px", color: "#1e293b" }}>{row.rank}</td>
      <td style={{ padding: "14px 20px", color: "#334155" }}>{row.name}</td>
      <td style={{ padding: "14px 20px", color: "#334155" }}>{row.items}</td>
      <td style={{ padding: "14px 20px", color: "#0077b6", fontWeight: 600 }}>
        {row.points}
      </td>
    </tr>
  );
};

export default LeaderboardRow;
