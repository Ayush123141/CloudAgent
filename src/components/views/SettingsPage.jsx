import React, { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import Badge from "../common/Badge";
import Panel from "../common/Panel";

export default function SettingsPage() {
  const { mode, theme, toggleTheme } = useTheme();
  const [approvalRequired, setApprovalRequired] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3 }}
      style={{ padding: 28, maxWidth: 680, margin: "0 auto" }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight" style={{ color: theme.text }}>
          System & Safety Settings
        </h1>
        <div className="text-sm font-medium" style={{ color: theme.textMuted, marginTop: 2 }}>
          Configure environment preferences, AI autonomy thresholds, and visual appearance
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/* Appearance Settings */}
        <Panel title="Appearance & Theme">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold" style={{ color: theme.text }}>
                Color Theme
              </div>
              <div className="text-xs font-medium" style={{ color: theme.textMuted, marginTop: 2 }}>
                Toggle between dark mode and clean light mode
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer"
              style={{
                background: theme.surface2,
                border: `1px solid ${theme.borderStrong}`,
                color: theme.text,
              }}
            >
              {mode === "dark" ? (
                <>
                  <Sun size={15} style={{ color: "#F59E0B" }} /> Switch to Light Mode
                </>
              ) : (
                <>
                  <Moon size={15} style={{ color: "#6366F1" }} /> Switch to Dark Mode
                </>
              )}
            </motion.button>
          </div>
        </Panel>

        {/* Environment */}
        <Panel title="Deployment Environment">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium" style={{ color: theme.textSecondary }}>Active cluster target</span>
            <Badge tone="accent">Production (AWS us-east-1)</Badge>
          </div>
        </Panel>

        {/* Safety Policy */}
        <Panel title="Autonomous Safety Guardrails">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-sm font-bold" style={{ color: theme.text }}>
                Require human approval for high-impact actions
              </div>
              <div className="text-xs font-medium" style={{ color: theme.textMuted, marginTop: 2 }}>
                Rollbacks, cluster autoscaling, and traffic shifts require human sign-off.
              </div>
            </div>
            <button
              onClick={() => setApprovalRequired((v) => !v)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 999,
                background: approvalRequired ? theme.accent : theme.surface2,
                border: `1px solid ${approvalRequired ? theme.accentBorder : theme.border}`,
                position: "relative",
                cursor: "pointer",
                flexShrink: 0,
                transition: "background-color 0.2s ease",
              }}
            >
              <motion.span
                animate={{ left: approvalRequired ? 22 : 3 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{
                  position: "absolute",
                  top: 2,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#FFFFFF",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                }}
              />
            </button>
          </div>
          <div className="text-xs font-medium pt-3" style={{ borderTop: `1px solid ${theme.border}`, color: theme.textSecondary }}>
            Confidence threshold for autonomous remediation proposals:{" "}
            <span className="font-bold" style={{ color: theme.text }}>80%</span>
          </div>
        </Panel>
      </div>
    </motion.div>
  );
}
