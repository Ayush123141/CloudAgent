import React from "react";
import { CheckCircle2, Circle, Loader2, ShieldCheck, ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import Badge from "../common/Badge";
import Panel from "../common/Panel";
import Pending from "../common/Pending";
import { STAGE_RANK } from "../../data/mockData";
import { MONO } from "../../styles/theme";

export default function Recovery({ stage, execStep }) {
  const { theme } = useTheme();

  if (STAGE_RANK[stage] < STAGE_RANK.executing) {
    return (
      <div style={{ padding: 28, maxWidth: 1400, margin: "0 auto" }}>
        <Pending
          title="Awaiting Remediation Approval"
          message="Recovery begins once the rollback action is approved on the Remediation screen."
          icon={Clock}
        />
      </div>
    );
  }

  const steps = [
    "SRE Approval signature verified",
    "Canary traffic shifting & isolation",
    "Rolling deployment downgrade (v1.8 → v1.7)",
    "Synthetic health checks & error rate monitoring",
    "Final telemetry stabilization verification",
  ];
  const resolved = stage === "resolved";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3 }}
      style={{ padding: 28, display: "flex", flexDirection: "column", gap: 22, maxWidth: 840, margin: "0 auto" }}
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: theme.text }}>
          Remediation Execution & Recovery
        </h1>
        <div className="text-sm font-medium" style={{ color: theme.textMuted, marginTop: 2 }}>
          INC-1042 · Live Rollback execution on payment-service
        </div>
      </div>

      {/* Execution Stepper */}
      <Panel title="Automated Rollback Sequence">
        <div className="flex flex-col gap-4">
          {steps.map((s, i) => {
            const n = i + 1;
            const done = execStep >= n || resolved;
            const inProgress = execStep === n - 1 && !done && stage === "executing";

            return (
              <div key={s} className="flex items-center gap-3.5">
                {done ? (
                  <CheckCircle2 size={18} style={{ color: theme.success }} />
                ) : inProgress ? (
                  <Loader2 size={18} className="animate-spin" style={{ color: theme.accent }} />
                ) : (
                  <Circle size={18} style={{ color: theme.textMuted }} />
                )}
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: done ? theme.text : inProgress ? theme.accent : theme.textMuted,
                  }}
                >
                  {s}
                </span>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Resolved State Confirmation */}
      {resolved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-5"
        >
          <div
            style={{
              background: theme.successSoft,
              border: `1px solid ${theme.successBorder}`,
              borderRadius: 10,
              padding: 22,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={20} style={{ color: theme.success }} />
              <span className="text-base font-bold" style={{ color: theme.success }}>
                Incident Successfully Resolved
              </span>
            </div>
            <div className="text-xs font-medium" style={{ color: theme.textSecondary }}>
              Telemetry restored to baseline SLA. All health checks passing.
            </div>
          </div>

          <Panel title="Before vs After Recovery Metrics">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "CPU Saturation", from: "98%", to: "54%" },
                { label: "Error Rate", from: "42%", to: "3%" },
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
          </Panel>

          <Panel>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.textMuted, fontSize: 10 }}>
                  Total MTTR
                </span>
                <div className="font-bold mt-0.5" style={{ color: theme.text }}>
                  11m 24s
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.textMuted, fontSize: 10 }}>
                  Automated Verification
                </span>
                <div className="mt-0.5">
                  <Badge tone="success">100% Passed</Badge>
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.textMuted, fontSize: 10 }}>
                  Root Cause
                </span>
                <div className="font-bold mt-0.5" style={{ color: theme.text }}>
                  Database query regression (v1.8)
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.textMuted, fontSize: 10 }}>
                  Applied Remediation
                </span>
                <div className="font-bold font-mono mt-0.5" style={{ color: theme.text, fontFamily: MONO }}>
                  Rollback v1.8 → v1.7
                </div>
              </div>
            </div>
          </Panel>
        </motion.div>
      )}
    </motion.div>
  );
}
