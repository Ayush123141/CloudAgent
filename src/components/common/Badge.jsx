import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function Badge({ children, tone = "neutral", size = "sm" }) {
  const { theme } = useTheme();

  const map = {
    critical: { bg: theme.criticalSoft, border: theme.criticalBorder, color: theme.critical },
    warning: { bg: theme.warningSoft, border: theme.warningBorder, color: theme.warning },
    success: { bg: theme.successSoft, border: theme.successBorder, color: theme.success },
    accent: { bg: theme.accentSoft, border: theme.accentBorder, color: theme.accent },
    neutral: { bg: theme.surface3, border: theme.border, color: theme.textSecondary },
  };

  const t = map[tone] || map.neutral;

  return (
    <motion.span
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={size === "sm" ? "text-xs" : "text-sm"}
      style={{
        background: t.bg,
        border: `1px solid ${t.border}`,
        color: t.color,
        padding: size === "sm" ? "3px 8px" : "5px 12px",
        borderRadius: 6,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        whiteSpace: "nowrap",
        letterSpacing: "0.01em",
        backdropFilter: "blur(4px)",
      }}
    >
      {children}
    </motion.span>
  );
}
