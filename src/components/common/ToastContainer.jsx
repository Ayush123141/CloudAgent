import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, ShieldCheck, Activity, Info, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ToastContainer({ toasts = [], onDismiss }) {
  const { theme } = useTheme();

  const getIcon = (type) => {
    switch (type) {
      case "critical":
        return <AlertTriangle size={16} style={{ color: theme.critical }} />;
      case "success":
        return <CheckCircle2 size={16} style={{ color: theme.success }} />;
      case "shield":
        return <ShieldCheck size={16} style={{ color: theme.accent }} />;
      case "signal":
        return <Activity size={16} style={{ color: theme.warning }} />;
      default:
        return <Info size={16} style={{ color: theme.accent }} />;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 68,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        pointerEvents: "none",
        maxWidth: 380,
      }}
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            style={{
              pointerEvents: "auto",
              background: theme.surface,
              border: `1px solid ${theme.borderStrong}`,
              borderLeft: `4px solid ${
                toast.type === "critical"
                  ? theme.critical
                  : toast.type === "success"
                  ? theme.success
                  : toast.type === "signal"
                  ? theme.warning
                  : theme.accent
              }`,
              borderRadius: 8,
              padding: "12px 14px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <div style={{ marginTop: 2, flexShrink: 0 }}>{getIcon(toast.type)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="text-xs font-bold" style={{ color: theme.text }}>
                {toast.title}
              </div>
              <div className="text-xs mt-0.5" style={{ color: theme.textSecondary, lineHeight: 1.3 }}>
                {toast.message}
              </div>
            </div>
            {onDismiss && (
              <button
                onClick={() => onDismiss(toast.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: theme.textMuted,
                  padding: 2,
                  display: "flex",
                }}
              >
                <X size={13} />
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
