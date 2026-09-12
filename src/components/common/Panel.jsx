import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function Panel({ title, eyebrow, right, children, className = "", padded = true, style = {} }) {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={className}
      style={{
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: 10,
        boxShadow: theme.shadowCard,
        transition: "background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
        overflow: "hidden",
        ...style,
      }}
    >
      {(title || right || eyebrow) && (
        <div
          className="flex items-center justify-between"
          style={{
            padding: "14px 18px",
            borderBottom: `1px solid ${theme.border}`,
            background: theme.name === "light" ? "rgba(248, 250, 252, 0.6)" : "rgba(255, 255, 255, 0.01)",
          }}
        >
          <div>
            {eyebrow && (
              <div
                className="text-xs tracking-wider uppercase"
                style={{ color: theme.textMuted, fontWeight: 700, marginBottom: 2, fontSize: 11 }}
              >
                {eyebrow}
              </div>
            )}
            {title && (
              <div className="text-sm" style={{ color: theme.text, fontWeight: 700, letterSpacing: "-0.01em" }}>
                {title}
              </div>
            )}
          </div>
          {right}
        </div>
      )}
      <div style={padded ? { padding: 18 } : undefined}>{children}</div>
    </motion.div>
  );
}
