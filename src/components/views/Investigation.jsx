import React from "react";
import { CheckCircle2, ArrowRight, Search } from "lucide-react";
import { motion } from "framer-motion";
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
          Payment Service Degradation · Correlation of logs, metrics, traces, git diffs & dependencies
        </div>
      </div>

      {/* Stepper Progress */}
      <Panel padded={true}>
        <StageProgress stage={stage} />
      </Panel>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Evidence Sources */}
        <Panel title="Telemetry Ingestion" eyebrow="Multi-Modal Signals">
          <div className="flex flex-col gap-3.5">
            {EVIDENCE_SOURCES.map((e) => {
              const Icon = e.icon;
              return (
                <div key={e.name} className="flex items-start gap-3">
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
                  <div style={{ minWidth: 0 }}>
                    <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color: theme.text }}>
                      <CheckCircle2 size={14} style={{ color: theme.success }} /> {e.name}
                    </div>
                    <div className="text-xs" style={{ color: theme.textMuted, marginTop: 2 }}>
                      {e.detail} · <span style={{ fontFamily: MONO }}>{e.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Autonomous Feed */}
        <Panel title="CloudDoctor Thought Stream" eyebrow="Autonomous Agent Actions">
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

          <Panel title="Investigation Status">
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
              View Root Cause Analysis <ArrowRight size={15} />
            </motion.button>
          </Panel>
        </div>
      </div>
    </motion.div>
  );
}
