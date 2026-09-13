import React from "react";
import { motion } from "framer-motion";
import { GitCommit, GitBranch, X, FileCode, CheckCircle2, AlertTriangle } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { MONO } from "../../styles/theme";

export default function GitDiffModal({ isOpen, onClose }) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  const diffLines = [
    { type: "normal", oldNum: 41, newNum: 41, text: " -- payment-service / src / repositories / order_lookup.sql" },
    { type: "normal", oldNum: 42, newNum: 42, text: " SELECT id, account_id, amount, status, created_at" },
    { type: "normal", oldNum: 43, newNum: 43, text: " FROM transaction_records" },
    { type: "delete", oldNum: 44, newNum: null, text: "- /*! USE INDEX (idx_tx_account_status_created) */" },
    { type: "add", oldNum: null, newNum: 44, text: "+ -- Refactored query optimizer hint for v1.8 generic database connector" },
    { type: "normal", oldNum: 45, newNum: 45, text: " WHERE account_id = :accountId" },
    { type: "normal", oldNum: 46, newNum: 46, text: "   AND status IN ('PENDING', 'PROCESSING')" },
    { type: "normal", oldNum: 47, newNum: 47, text: " ORDER BY created_at DESC" },
    { type: "normal", oldNum: 48, newNum: 48, text: " LIMIT :batchLimit;" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.25 }}
        style={{
          width: "100%",
          maxWidth: 780,
          background: theme.surface,
          border: `1px solid ${theme.borderStrong}`,
          borderRadius: 12,
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${theme.border}`,
            background: theme.surface2,
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: theme.criticalSoft,
                border: `1px solid ${theme.criticalBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GitCommit size={17} style={{ color: theme.critical }} />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2" style={{ color: theme.text }}>
                <span>payment-service: commit <code style={{ fontFamily: MONO, color: theme.accent }}>9f4a1c2</code></span>
                <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: theme.criticalSoft, color: theme.critical }}>
                  Regression Point
                </span>
              </div>
              <div className="text-xs" style={{ color: theme.textMuted, marginTop: 2 }}>
                Deployed at 10:18 AM · Author: backend-team · Branch: <span style={{ fontFamily: MONO }}>release/v1.8</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: theme.textMuted,
              cursor: "pointer",
              padding: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* RCA Explanation alert */}
        <div
          style={{
            padding: "12px 20px",
            background: theme.criticalSoft,
            borderBottom: `1px solid ${theme.criticalBorder}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <AlertTriangle size={16} style={{ color: theme.critical, flexShrink: 0 }} />
          <div className="text-xs font-medium" style={{ color: theme.text }}>
            <strong>Autonomous RCA Finding:</strong> Dropping index hint forced PostgreSQL query engine into full table scans on 18M records, triggering connection queue saturation.
          </div>
        </div>

        {/* File Header */}
        <div
          className="flex items-center justify-between text-xs"
          style={{
            padding: "10px 18px",
            background: theme.surface3,
            color: theme.textSecondary,
            fontFamily: MONO,
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <div className="flex items-center gap-2">
            <FileCode size={14} style={{ color: theme.accent }} />
            <span>src/repositories/order_lookup.sql</span>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ color: theme.critical }}>-1 line</span>
            <span style={{ color: theme.success }}>+1 line</span>
          </div>
        </div>

        {/* Code Diff Display */}
        <div
          style={{
            maxHeight: 380,
            overflowY: "auto",
            fontFamily: MONO,
            fontSize: 12,
            lineHeight: 1.6,
            background: theme.name === "dark" ? "#0E1012" : "#F8FAFC",
          }}
        >
          {diffLines.map((line, idx) => {
            const isAdd = line.type === "add";
            const isDelete = line.type === "delete";

            return (
              <div
                key={idx}
                className="flex items-center"
                style={{
                  background: isAdd
                    ? "rgba(34, 197, 94, 0.12)"
                    : isDelete
                    ? "rgba(239, 68, 68, 0.15)"
                    : "transparent",
                  color: isAdd
                    ? theme.success
                    : isDelete
                    ? theme.critical
                    : theme.textSecondary,
                }}
              >
                <div
                  style={{
                    width: 44,
                    padding: "2px 8px",
                    textAlign: "right",
                    userSelect: "none",
                    color: theme.textMuted,
                    borderRight: `1px solid ${theme.border}`,
                    fontSize: 11,
                  }}
                >
                  {line.oldNum || ""}
                </div>
                <div
                  style={{
                    width: 44,
                    padding: "2px 8px",
                    textAlign: "right",
                    userSelect: "none",
                    color: theme.textMuted,
                    borderRight: `1px solid ${theme.border}`,
                    fontSize: 11,
                  }}
                >
                  {line.newNum || ""}
                </div>
                <div style={{ padding: "2px 14px", flex: 1, whiteSpace: "pre" }}>
                  {line.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "14px 20px",
            borderTop: `1px solid ${theme.border}`,
            background: theme.surface2,
          }}
        >
          <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: theme.success }}>
            <CheckCircle2 size={14} /> Correlated with 10:18 AM deployment signal
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold px-4 py-2 rounded-md cursor-pointer"
            style={{
              background: theme.surface,
              border: `1px solid ${theme.borderStrong}`,
              color: theme.text,
            }}
          >
            Close Diff Inspector
          </button>
        </div>
      </motion.div>
    </div>
  );
}
