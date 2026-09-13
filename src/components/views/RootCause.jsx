import React, { useState } from "react";
import { ChevronDown, ArrowRight, ShieldAlert, GitCommit, FileText, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import Badge from "../common/Badge";
import Panel from "../common/Panel";
import ConfidenceGauge from "../common/ConfidenceGauge";
import Pending from "../common/Pending";
import GitDiffModal from "./GitDiffModal";
import PostMortemModal from "./PostMortemModal";
import {
  STAGE_RANK, EVIDENCE_CHAIN, EVIDENCE_CHAIN_DETAIL, SUPPORTING_EVIDENCE, TIMELINE
} from "../../data/mockData";
import { MONO } from "../../styles/theme";

export default function RootCause({ stage, onViewRemediation }) {
  const { theme } = useTheme();
  const [openNode, setOpenNode] = useState(null);
  const [isDiffOpen, setIsDiffOpen] = useState(false);
  const [isPostMortemOpen, setIsPostMortemOpen] = useState(false);

  function typeColor(type) {
    if (type === "critical") return theme.critical;
    if (type === "resolved") return theme.success;
    if (type === "approve" || type === "signal") return theme.warning;
    return theme.accent;
  }

  if (STAGE_RANK[stage] < STAGE_RANK.diagnosed) {
    return (
      <div style={{ padding: 28, maxWidth: 1400, margin: "0 auto" }}>
        <Pending
          title="Root cause not yet available"
          message="CloudDoctor is still actively synthesizing telemetry evidence for this incident."
          icon={ShieldAlert}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3 }}
      style={{ padding: 28, display: "flex", flexDirection: "column", gap: 22, maxWidth: 1400, margin: "0 auto" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: theme.text }}>
            Root Cause Analysis (RCA) & Evidence Chain
          </h1>
          <div className="text-sm font-medium" style={{ color: theme.textMuted, marginTop: 2 }}>
            INC-1042 · Explainable multi-modal diagnosis derived from telemetry, commits, and query plans
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsDiffOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-md cursor-pointer"
            style={{
              background: theme.surface2,
              border: `1px solid ${theme.borderStrong}`,
              color: theme.text,
            }}
          >
            <GitCommit size={14} style={{ color: theme.critical }} />
            Inspect Git Diff
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsPostMortemOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-md cursor-pointer"
            style={{
              background: theme.accentSoft,
              border: `1px solid ${theme.accentBorder}`,
              color: theme.accent,
            }}
          >
            <FileText size={14} />
            Post-Mortem Report
          </motion.button>
        </div>
      </div>

      {/* Main RCA Hypothesis Card (DRD Section 7) */}
      <Panel eyebrow="Identified Primary Root Cause">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
          <ConfidenceGauge value={89} color={theme.accent} />
          <div>
            <div className="text-xl font-bold" style={{ color: theme.text, lineHeight: 1.3 }}>
              Database query regression introduced in payment-service v1.8
            </div>
            <div className="text-sm font-medium mt-2" style={{ color: theme.textSecondary, maxWidth: 640 }}>
              v1.8 deployment dropped an essential index hint on the high-throughput order lookup query, causing full table scans, connection pool exhaustion, cascading timeouts, and 98% CPU saturation.
            </div>
            <div className="flex items-center gap-2.5 mt-4">
              <Badge tone="accent">89% Confidence</Badge>
              <Badge tone="neutral">High Certainty Hypothesis</Badge>
              <button
                onClick={() => setIsDiffOpen(true)}
                className="text-xs font-bold underline cursor-pointer"
                style={{ color: theme.accent, background: "transparent", border: "none" }}
              >
                View Commit Diff (9f4a1c2) →
              </button>
            </div>
          </div>
        </div>
      </Panel>

      {/* Evidence Chain Accordion (DRD Section 7: deployment -> code -> db latency/timeouts -> retries -> CPU/errors) */}
      <Panel title="Causal Step-by-Step Chain" eyebrow="Evidence Derivation">
        <div className="flex flex-col">
          {EVIDENCE_CHAIN.map((node, i) => {
            const open = openNode === i;
            return (
              <div key={i}>
                <motion.button
                  whileHover={{ backgroundColor: theme.surface2 }}
                  onClick={() => setOpenNode(open ? null : i)}
                  className="flex items-center gap-3.5 w-full text-left cursor-pointer"
                  style={{
                    padding: "12px 14px",
                    borderRadius: 8,
                    background: open ? theme.accentSoft : "transparent",
                    border: `1px solid ${open ? theme.accentBorder : "transparent"}`,
                    transition: "all 0.15s ease",
                  }}
                >
                  <span
                    className="text-xs tabular-nums font-bold"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: theme.surface2,
                      border: `1px solid ${theme.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: theme.text,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm font-bold" style={{ color: theme.text }}>
                    {node}
                  </span>
                  <ChevronDown
                    size={16}
                    style={{
                      color: theme.textMuted,
                      marginLeft: "auto",
                      transform: open ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </motion.button>
                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm overflow-hidden"
                      style={{ color: theme.textSecondary, padding: "8px 14px 14px 50px" }}
                    >
                      {EVIDENCE_CHAIN_DETAIL[i]}
                    </motion.div>
                  )}
                </AnimatePresence>
                {i < EVIDENCE_CHAIN.length - 1 && (
                  <div style={{ width: 2, height: 12, background: theme.border, marginLeft: 25, borderRadius: 999 }} />
                )}
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Supporting Evidence Breakdown */}
      <Panel title="Corroborating Telemetry Evidence">
        <div className="flex flex-col gap-3.5">
          {SUPPORTING_EVIDENCE.map((e, i) => {
            const Icon = e.icon;
            return (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: theme.surface2,
                    border: `1px solid ${theme.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={14} style={{ color: theme.textSecondary }} />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-bold mr-2" style={{ color: theme.textMuted }}>
                    {e.source}:
                  </span>
                  <span className="text-sm font-medium" style={{ color: theme.text }}>
                    {e.finding}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: 90,
                      height: 6,
                      borderRadius: 999,
                      background: theme.surface2,
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ width: `${e.relevance}%`, height: "100%", background: theme.accent }} />
                  </div>
                  <span className="text-xs tabular-nums font-bold" style={{ color: theme.textMuted, width: 34, textAlign: "right" }}>
                    {e.relevance}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* DRD Section 7: Integrated Incident Timeline below the diagnosis */}
      <Panel title="Incident Progression Timeline" eyebrow="Chronological Milestone Correlation">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 pt-2">
          {TIMELINE.slice(0, 6).map((t, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: typeColor(t.type),
                  flexShrink: 0,
                  marginTop: 5,
                }}
              />
              <div>
                <span className="text-xs font-mono font-semibold" style={{ color: theme.textMuted, fontFamily: MONO }}>
                  {t.time}
                </span>
                <div className="text-xs font-bold" style={{ color: theme.text }}>
                  {t.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewRemediation}
          className="text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
          style={{
            background: theme.accent,
            color: "#FFFFFF",
            border: "none",
            borderRadius: 6,
            padding: "11px 20px",
            boxShadow: `0 2px 10px ${theme.accent}40`,
          }}
        >
          Proceed to Remediation &amp; Simulation <ArrowRight size={15} />
        </motion.button>
      </div>

      {/* Modals */}
      <GitDiffModal isOpen={isDiffOpen} onClose={() => setIsDiffOpen(false)} />
      <PostMortemModal isOpen={isPostMortemOpen} onClose={() => setIsPostMortemOpen(false)} />
    </motion.div>
  );
}
