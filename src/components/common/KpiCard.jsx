import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function KpiCard({ label, value, sub, tone }) {
  const { theme } = useTheme();

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      style={{
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: 10,
        padding: "16px 18px",
        flex: 1,
        minWidth: 0,
        boxShadow: theme.shadowCard,
        transition: "background-color 0.25s ease, border-color 0.25s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="text-xs tracking-wider uppercase font-semibold"
        style={{ color: theme.textMuted, fontSize: 11 }}
      >
        {label}
      </div>
      <div
        className="tabular-nums font-extrabold"
        style={{
          fontSize: 26,
          color: tone || theme.text,
          marginTop: 6,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      {sub && (
        <div className="text-xs" style={{ color: theme.textMuted, marginTop: 6 }}>
          {sub}
        </div>
      )}
    </motion.div>
  );
}
