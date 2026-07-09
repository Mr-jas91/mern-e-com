import React from "react";
import { Chip } from "@mui/material";

export const StatusChip = ({ status }) => {
  const getStatusColor = (val) => {
    switch (val?.toUpperCase()) {
      case "DELIVERED":
      case "PAID":
        return { bg: "#e8f5e9", text: "#2e7d32" };
      case "SHIPPED":
      case "PROCESSING":
      case "ACCEPTED":
        return { bg: "#e3f2fd", text: "#1565c0" };
      case "PENDING":
        return { bg: "#fff3e0", text: "#ef6c00" };
      case "CANCELLED":
      case "FAILED":
        return { bg: "#ffebee", text: "#c62828" };
      default:
        return { bg: "#f5f5f5", text: "#616161" };
    }
  };

  const styles = getStatusColor(status);
  return (
    <Chip
      label={status || "PENDING"}
      size="small"
      sx={{
        backgroundColor: styles.bg,
        color: styles.text,
        fontWeight: "bold",
        fontSize: "0.75rem",
        borderRadius: "6px"
      }}
    />
  );
};