import React, { useState } from "react";
import { CheckCircle2, ArrowRight, Search, ChevronRight, Terminal, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import Badge from "../common/Badge";
import Panel from "../common/Panel";
import Metric from "../common/Metric";
import StageProgress from "../common/StageProgress";
import Pending from "../common/Pending";
import {
  STAGE_RANK, EVIDENCE_SOURCES, INVESTIGATION_FEED
} from "../../data/mockData";
import { MONO } from "../../styles/theme";

export default function Investigation({ stage, onViewRootCause }) {
  const { theme } = useTheme();
  const [selectedSource, setSelectedSource] = useState(0);

  if (STAGE_RANK[stage] < STAGE_RANK.investigating) {
    return (
      <div style={{ padding: 28, maxWidth: 1400, margin: "0 auto" }}>
        <Pending
          title="No active investigation"
          message="Incidents are investigated automatically once detected. Open the Overview to see current status."
          icon={Search}
        />
      </div>
    );
  }

  const activeEvidence = EVIDENCE_SOURCES[selectedSource] || EVIDENCE_SOURCES[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3 }}
      style={{ padding: 28, display: "flex", flexDirection: "column", gap: 22, maxWidth: 1400, margin: "0 auto" }}
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge tone="critical">Critical Incident</Badge>
          <Badge tone="accent">{stage === "investigating" ? "Investigating" : "Diagnosed"}</Badge>
        </div>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: theme.text }}>
          Incident INC-1042: Autonomous Investigation
        </h1>
        <div className="text-sm font-medium" style={{ color: theme.textMuted, marginTop: 2 }}>
          Payment Service Degradation · Correlation of metrics, logs, traces, deployment history, Git changes & dependencies
        </div>
      </div>

      {/* Stepper Progress */}
      <Panel padded={true}>
        <StageProgress stage={stage} />
      </Panel>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Evidence Sources (DRD Section 6: Clickable / Inspectable categories) */}
        <Panel title="Telemetry Ingestion" eyebrow="Inspect Evidence Categories">
          <div className="flex flex-col gap-2.5">
            {EVIDENCE_SOURCES.map((e, idx) => {
              const Icon = e.icon;
              const isSelected = selectedSource === idx;
              return (
                <motion.button
                  key={e.name}
                  whileHover={{ x: 2 }}
                  onClick={() => setSelectedSource(idx)}
                  className="flex items-start justify-between gap-3 text-left w-full cursor-pointer p-2.5 rounded-lg"
                  style={{
                    background: isSelected ? theme.accentSoft : "transparent",
                    border: `1px solid ${isSelected ? theme.accentBorder : theme.border}`,
                    transition: "all 0.15s ease",
                  }}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 6,
                        background: theme.surface2,
                        border: `1px solid ${theme.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={13} style={{ color: isSelected ? theme.accent : theme.textSecondary }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: theme.text }}>
                        <CheckCircle2 size={13} style={{ color: theme.success }} /> {e.name}
                      </div>
                      <div className="text-xs truncate" style={{ color: theme.textMuted, marginTop: 1, fontSize: 11 }}>
                        {e.detail} · <span style={{ fontFamily: MONO }}>{e.time}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: isSelected ? theme.accent : theme.textMuted, flexShrink: 0, marginTop: 6 }} />
                </motion.button>
              );
            })}
          </div>

          {/* Evidence Category Snippet Inspector */}
          <div
            className="mt-4 p-3 rounded-lg"
            style={{
              background: theme.surface2,
              border: `1px solid ${theme.border}`,
              fontFamily: MONO,
              fontSize: 11,
            }}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1.5" style={{ color: theme.accent }}>
              <span>Raw Signal: {activeEvidence.name}</span>
              <span style={{ color: theme.textMuted }}>{activeEvidence.time}</span>
            </div>
            <div style={{ color: theme.textSecondary, lineHeight: 1.4, wordBreak: "break-word" }}>
              {activeEvidence.snippet}
            </div>
          </div>
        </Panel>

        {/* Autonomous Feed */}
        <Panel title="CloudDoctor Investigation Stream" eyebrow="Autonomous Reasoning & Actions">
          <div className="flex flex-col">
            {INVESTIGATION_FEED.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="flex gap-3 relative"
                  style={{ paddingBottom: i < INVESTIGATION_FEED.length - 1 ? 16 : 0 }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: theme.accentSoft,
                        border: `1px solid ${theme.accentBorder}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={12} style={{ color: theme.accent }} />
                    </div>
                    {i < INVESTIGATION_FEED.length - 1 && (
                      <div style={{ width: 2, flex: 1, background: theme.border, marginTop: 4, borderRadius: 999 }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: 4 }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold" style={{ color: theme.textMuted, fontFamily: MONO }}>
                        {f.time}
                      </span>
                      <span className="text-sm font-bold" style={{ color: theme.text }}>
                        {f.title}
                      </span>
                    </div>
                    <div className="text-xs font-medium" style={{ color: theme.textSecondary, marginTop: 2 }}>
                      {f.detail}
                    </div>
                    <div className="mt-1.5">
                      <Badge tone="neutral">{f.ref}</Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Real-time signals & Next Action */}
        <div className="flex flex-col gap-4">
          <Panel title="Correlated Incident Telemetry">
            <div className="flex flex-col gap-3.5">
              <Metric label="CPU Saturation" value="98%" direction="up" tone={theme.critical} />
              <Metric label="Error Rate" value="42%" direction="up" tone={theme.critical} />
              <Metric label="P99 Latency" value="4.2s" direction="up" tone={theme.critical} />
              <Metric label="Deployment Impact" value="v1.8" />
              <Metric label="Database Health" value="Degraded (4.1x latency)" tone={theme.warning} />
            </div>
          </Panel>

          <Panel title="Investigation Progress">
            <div className="text-sm font-bold mb-2" style={{ color: theme.text }}>
              7 / 7 telemetry streams analyzed
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 999,
                background: theme.surface2,
                overflow: "hidden",
                marginBottom: 16,
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ height: "100%", background: theme.success }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onViewRootCause}
              className="w-full text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
              style={{
                background: theme.accent,
                color: "#FFFFFF",
                border: "none",
                borderRadius: 6,
                padding: "11px 18px",
                boxShadow: `0 2px 10px ${theme.accent}40`,
              }}
            >
              View Root Cause Diagnosis <ArrowRight size={15} />
            </motion.button>
          </Panel>
        </div>
      </div>
    </motion.div>
  );
}
