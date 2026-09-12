import React from "react";
import { ArrowRight, CheckCircle2, ShieldAlert, ShieldCheck, XCircle, FlaskConical } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import Badge from "../common/Badge";
import Panel from "../common/Panel";
import Metric from "../common/Metric";
import Pending from "../common/Pending";
import {
  STAGE_RANK, ALTERNATIVES, SAFETY_CHECKS
} from "../../data/mockData";
import { MONO } from "../../styles/theme";

export default function Remediation({ stage, onSimulate, onRequestApproval, onApprove, onReject }) {
  const { theme } = useTheme();

  if (STAGE_RANK[stage] < STAGE_RANK.remediation) {
    return (
      <div style={{ padding: 28, maxWidth: 1400, margin: "0 auto" }}>
        <Pending
          title="No remediation planned yet"
          message="A remediation plan is generated once root cause analysis completes."
          icon={FlaskConical}
        />
      </div>
    );
  }

  const simulated = STAGE_RANK[stage] >= STAGE_RANK.simulated;
  const approvalStage = stage === "approval";
  const rejected = stage === "rejected";
  const executedOrLater = STAGE_RANK[stage] >= STAGE_RANK.executing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3 }}
      style={{ padding: 28, display: "flex", flexDirection: "column", gap: 22, maxWidth: 1400, margin: "0 auto" }}
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: theme.text }}>
          Remediation Strategy & Safety Gate
        </h1>
        <div className="text-sm font-medium" style={{ color: theme.textMuted, marginTop: 2 }}>
          INC-1042 · Autonomous Action Plan with Human-in-the-Loop Safeguards
        </div>
      </div>

      {/* Main Recommendation */}
      <Panel>
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div>
            <Badge tone="accent">Recommended Autonomous Action</Badge>
            <div className="text-xl font-bold mt-3" style={{ color: theme.text }}>
              Instant Rollback: payment-service
            </div>
            <div className="text-2xl font-black mt-1" style={{ color: theme.accent, fontFamily: MONO }}>
              v1.8 → v1.7
            </div>
            <div className="text-sm font-medium mt-3" style={{ color: theme.textSecondary, maxWidth: 520 }}>
              Deployment v1.8 is strongly correlated with index regressions and connection pool starvation. Rolling back restores the known-good v1.7 build instantly.
            </div>
          </div>
          <div className="flex items-center gap-8 self-start sm:self-center">
            <Metric label="Confidence" value="89%" tone={theme.accent} />
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold" style={{ color: theme.textMuted, fontSize: 11 }}>
                Action Risk
              </div>
              <div style={{ marginTop: 6 }}>
                <Badge tone="success">Low Risk</Badge>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* Alternative Strategies Considered */}
      <Panel title="Alternative Actions Evaluated">
        <div className="flex flex-col gap-3">
          {ALTERNATIVES.map((a, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg"
              style={{
                background: theme.surface2,
                border: `1px solid ${theme.border}`,
              }}
            >
              <div>
                <div className="text-sm font-bold" style={{ color: theme.text }}>
                  {a.action}
                </div>
                <div className="text-xs" style={{ color: theme.textMuted, marginTop: 2 }}>
                  {a.note}
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-xs" style={{ color: theme.textMuted }}>
                  Confidence: <span className="font-bold" style={{ color: theme.text }}>{a.confidence}%</span>
                </span>
                <Badge tone="warning">{a.risk} risk</Badge>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Sandbox Simulation */}
      <Panel
        title="Sandbox Digital Twin Simulation"
        right={
          !simulated && !executedOrLater ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onSimulate}
              className="text-xs font-bold px-4 py-2 rounded-md cursor-pointer"
              style={{
                background: theme.accent,
                color: "#FFFFFF",
                border: "none",
                boxShadow: `0 2px 8px ${theme.accent}30`,
              }}
            >
              Simulate Fix Impact
            </motion.button>
          ) : null
        }
      >
        {simulated ? (
          <div>
            <Badge tone="accent">Predicted Telemetry Recovery</Badge>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              {[
                { label: "Error Rate", from: "42%", to: "3%" },
                { label: "CPU Saturation", from: "98%", to: "54%" },
                { label: "P99 Latency", from: "4.2s", to: "180ms" },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{
                    background: theme.surface2,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 8,
                    padding: 14,
                  }}
                >
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textMuted, fontSize: 11 }}>
                    {m.label}
                  </div>
                  <div className="flex items-center gap-2.5 tabular-nums mt-2" style={{ fontSize: 18, fontWeight: 800 }}>
                    <span style={{ color: theme.textMuted }}>{m.from}</span>
                    <ArrowRight size={14} style={{ color: theme.textMuted }} />
                    <span style={{ color: theme.success }}>{m.to}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs font-medium mt-3" style={{ color: theme.textMuted }}>
              Simulated in ephemeral staging sandbox with mirrored production traffic.
            </div>
          </div>
        ) : (
          <div className="text-sm font-medium" style={{ color: theme.textMuted }}>
            Run an isolated sandbox simulation to preview predicted telemetry stabilization before touching production traffic.
          </div>
        )}
      </Panel>

      {/* Safety Gate & Human Approval */}
      {simulated && (
        <Panel title="Safety Policy Verification & Approvals">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            style={{ marginBottom: approvalStage || executedOrLater || rejected ? 20 : 0 }}
          >
            {SAFETY_CHECKS.map((c) => (
              <div key={c} className="flex items-center gap-2 text-sm font-medium" style={{ color: theme.textSecondary }}>
                <CheckCircle2 size={16} style={{ color: theme.success }} /> {c}
              </div>
            ))}
          </div>

          {!approvalStage && !executedOrLater && !rejected && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRequestApproval}
              className="text-sm font-bold px-5 py-2.5 rounded-md cursor-pointer inline-flex items-center gap-2"
              style={{
                background: theme.accent,
                color: "#FFFFFF",
                border: "none",
                boxShadow: `0 2px 10px ${theme.accent}40`,
              }}
            >
              Request SRE Approval
            </motion.button>
          )}

          {approvalStage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                background: theme.warningSoft,
                border: `1px solid ${theme.warningBorder}`,
                borderRadius: 8,
                padding: 18,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert size={18} style={{ color: theme.warning }} />
                <span className="text-sm font-bold" style={{ color: theme.warning }}>
                  Production Human-In-The-Loop Approval Required
                </span>
              </div>
              <div className="text-xs font-medium mb-4" style={{ color: theme.textSecondary }}>
                Executing this rollback will re-route production traffic to payment-service v1.7.
              </div>
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onApprove}
                  className="text-xs font-bold inline-flex items-center gap-1.5 px-4 py-2 rounded-md cursor-pointer"
                  style={{
                    background: theme.accent,
                    color: "#FFFFFF",
                    border: "none",
                  }}
                >
                  <ShieldCheck size={14} /> Approve & Execute Rollback
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onReject}
                  className="text-xs font-bold inline-flex items-center gap-1.5 px-4 py-2 rounded-md cursor-pointer"
                  style={{
                    background: theme.surface,
                    border: `1px solid ${theme.borderStrong}`,
                    color: theme.critical,
                  }}
                >
                  <XCircle size={14} /> Reject Action
                </motion.button>
              </div>
            </motion.div>
          )}

          {rejected && (
            <div style={{ background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 16 }}>
              <div className="text-sm font-bold mb-1" style={{ color: theme.text }}>
                Rollback action rejected
              </div>
              <div className="text-xs font-medium mb-3" style={{ color: theme.textMuted }}>
                The incident remains active. SRE team can re-evaluate or request approval again.
              </div>
              <button
                onClick={onRequestApproval}
                className="text-xs font-bold px-3 py-1.5 rounded cursor-pointer"
                style={{ background: theme.surface, border: `1px solid ${theme.borderStrong}`, color: theme.text }}
              >
                Request Approval Again
              </button>
            </div>
          )}

          {executedOrLater && (
            <div className="flex items-center gap-2 text-sm font-bold" style={{ color: theme.success }}>
              <CheckCircle2 size={16} /> Rollback approved & running — proceed to Recovery view.
            </div>
          )}
        </Panel>
      )}
    </motion.div>
  );
}
