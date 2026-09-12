import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { TIMELINE } from "../../data/mockData";
import { MONO } from "../../styles/theme";

export default function TimelinePage() {
  const { theme } = useTheme();

  function typeColor(type) {
    if (type === "critical") return theme.critical;
    if (type === "resolved") return theme.success;
    if (type === "approve" || type === "signal") return theme.warning;
    return theme.accent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3 }}
      style={{ padding: 28, maxWidth: 840, margin: "0 auto" }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight" style={{ color: theme.text }}>
          Incident Timeline
        </h1>
        <div className="text-sm font-medium" style={{ color: theme.textMuted, marginTop: 2 }}>
          INC-1042 · Chronological telemetry and remediation milestone log
        </div>
      </div>

      <div className="flex flex-col">
        {TIMELINE.map((t, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: typeColor(t.type),
                  boxShadow: `0 0 8px ${typeColor(t.type)}50`,
                  flexShrink: 0,
                  marginTop: 4,
                }}
              />
              {i < TIMELINE.length - 1 && (
                <div
                  style={{
                    width: 2,
                    flex: 1,
                    background: theme.border,
                    minHeight: 28,
                    borderRadius: 999,
                  }}
                />
              )}
            </div>
            <div style={{ paddingBottom: 20 }}>
              <span className="text-xs font-mono font-semibold" style={{ color: theme.textMuted, fontFamily: MONO }}>
                {t.time}
              </span>
              <div className="text-sm font-bold mt-1" style={{ color: theme.text }}>
                {t.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
