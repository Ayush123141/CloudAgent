import React from "react";
import { PlayCircle, Loader2, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import StatusDot from "../common/StatusDot";
import { BREADCRUMBS } from "../../data/mockData";
import { MONO } from "../../styles/theme";

export default function TopBar({ page, stage, onDemo, demoRunning }) {
  const { mode, theme, toggleTheme } = useTheme();

  return (
    <div
      className="flex items-center justify-between z-10"
      style={{
        height: 56,
        padding: "0 24px",
        borderBottom: `1px solid ${theme.border}`,
        background: theme.surface,
        flexShrink: 0,
        transition: "background-color 0.25s ease, border-color 0.25s ease",
      }}
    >
      <div className="text-sm font-semibold" style={{ color: theme.textSecondary }}>
        {BREADCRUMBS[page] || "Operations"}
      </div>

      <div className="flex items-center gap-4">
        {/* Run Simulation CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDemo}
          disabled={demoRunning}
          className="flex items-center gap-2 text-xs font-bold"
          style={{
            background: theme.accentSoft,
            border: `1px solid ${theme.accentBorder}`,
            color: theme.accent,
            padding: "7px 14px",
            borderRadius: 6,
            cursor: demoRunning ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {demoRunning ? <Loader2 size={14} className="animate-spin" /> : <PlayCircle size={14} />}
          {demoRunning ? "Running simulation…" : "Run Incident Simulation"}
        </motion.button>

        {/* Theme Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleTheme}
          title={`Switch to ${mode === "dark" ? "Light" : "Dark"} Mode`}
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: theme.surface2,
            border: `1px solid ${theme.borderStrong}`,
            color: theme.text,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {mode === "dark" ? (
            <Sun size={16} style={{ color: "#F59E0B" }} />
          ) : (
            <Moon size={16} style={{ color: "#6366F1" }} />
          )}
        </motion.button>

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono" style={{ color: theme.textMuted, fontFamily: MONO }}>
          Updated {stage === "resolved" ? "10:31:04" : "10:25:19"}
        </div>

        <div className="flex items-center gap-2 text-xs font-medium" style={{ color: theme.textSecondary }}>
          <StatusDot status="healthy" pulse />
          <span className="hidden md:inline">CloudDoctor Active</span>
        </div>
      </div>
    </div>
  );
}
