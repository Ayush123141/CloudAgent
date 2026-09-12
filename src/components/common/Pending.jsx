import React from "react";
import { Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function Pending({ title, message, ctaLabel, onCta, icon: Icon = Clock }) {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center"
      style={{ padding: "72px 24px" }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: theme.surface2,
          border: `1px solid ${theme.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
          boxShadow: theme.shadowCard,
        }}
      >
        <Icon size={24} style={{ color: theme.accent }} />
      </div>
      <div className="text-base font-bold" style={{ color: theme.text, marginBottom: 6 }}>
        {title}
      </div>
      <div className="text-sm" style={{ color: theme.textMuted, maxWidth: 400, marginBottom: onCta ? 20 : 0 }}>
        {message}
      </div>
      {onCta && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCta}
          className="text-sm"
          style={{
            background: theme.accent,
            color: "#FFFFFF",
            border: "none",
            borderRadius: 6,
            padding: "9px 18px",
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            boxShadow: `0 2px 10px ${theme.accent}40`,
          }}
        >
          {ctaLabel} <ArrowRight size={14} />
        </motion.button>
      )}
    </motion.div>
  );
}
