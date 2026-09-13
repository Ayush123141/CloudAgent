import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Copy, Check, X, ShieldCheck, Download } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Badge from "../common/Badge";
import { MONO } from "../../styles/theme";

export default function PostMortemModal({ isOpen, onClose }) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const markdownContent = `# INC-1042: Payment Service Degradation Post-Mortem Report

**Date:** September 12, 2026  
**Status:** Resolved  
**Severity:** SEV-1 (Critical)  
**Total MTTR:** 11m 24s  
**Remediation Action:** Automated Rollback (payment-service v1.8 -> v1.7)  

---

## Executive Summary
At 10:24 AM, the CloudDoctor autonomous SRE agent detected a severe degradation on \`payment-service\` characterized by 98% CPU saturation, a 42% error rate, and P99 latency spiking to 4.2s. Through autonomous telemetry correlation, CloudDoctor identified a database query regression introduced in deployment v1.8 (commit \`9f4a1c2\`), where an index hint was omitted. Following sandbox validation and engineer authorization, an automated rollback to v1.7 was executed at 10:29 AM, achieving full recovery by 10:31 AM.

---

## Key Metrics Impact
- **Peak CPU Saturation:** 98% (Normal: 44%)
- **Peak Error Rate:** 42% (Normal: 1.2%)
- **Peak P99 Latency:** 4,200ms (Normal: 120ms)
- **Time to Detect (TTD):** 42 seconds
- **Time to Root Cause (TTRC):** 1m 20s
- **Time to Remediate (MTTR):** 11m 24s

---

## Incident Timeline
- **10:18 AM** - payment-service v1.8 deployed to production.
- **10:20 AM** - Primary database latency begins rising (40ms -> 640ms).
- **10:24 AM** - CloudDoctor detects CPU threshold breach (>90%) and creates INC-1042.
- **10:25 AM** - Autonomous RCA Engine correlates logs, git diffs, and query plans (89% confidence).
- **10:26 AM** - Digital twin sandbox predicts 93% error rate reduction upon rollback to v1.7.
- **10:28 AM** - Human-in-the-loop SRE authorization granted.
- **10:29 AM** - Rollback execution commences with automated canary traffic shift.
- **10:31 AM** - Verification suite passes; incident marked resolved.

---

## Root Cause Analysis
Deployment v1.8 refactored the SQL order lookup query in \`src/repositories/order_lookup.sql\`, inadvertently removing \`/*! USE INDEX (idx_tx_account_status_created) */\`. This caused PostgreSQL execution planners to perform sequential table scans on an 18-million row partition under peak traffic, exhausting the database connection pool and triggering cascading retry storms.

---

## Preventative Action Items
1. **[CI/CD Guardrail]** Add automated SQL execution plan verification step in pull request pipelines.
2. **[Resilience]** Implement exponential backoff and jitter on downstream payment retry policies to avoid retry amplification.
3. **[Observability]** Integrate query planner telemetry directly into staging canary validation gates.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          maxWidth: 820,
          maxHeight: "90vh",
          background: theme.surface,
          border: `1px solid ${theme.borderStrong}`,
          borderRadius: 12,
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "16px 22px",
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
                background: theme.accentSoft,
                border: `1px solid ${theme.accentBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText size={17} style={{ color: theme.accent }} />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2" style={{ color: theme.text }}>
                <span>Executive Post-Mortem Report</span>
                <Badge tone="success">Generated by CloudDoctor</Badge>
              </div>
              <div className="text-xs" style={{ color: theme.textMuted, marginTop: 2 }}>
                Incident INC-1042 · Exportable SRE Documentation
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded cursor-pointer"
              style={{
                background: copied ? theme.successSoft : theme.accentSoft,
                border: `1px solid ${copied ? theme.successBorder : theme.accentBorder}`,
                color: copied ? theme.success : theme.accent,
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied Markdown!" : "Copy Markdown"}
            </button>
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
        </div>

        {/* Post-Mortem Report Body */}
        <div
          style={{
            padding: "24px 28px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* Executive Overview Banner */}
          <div
            style={{
              padding: 16,
              background: theme.surface2,
              borderRadius: 8,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>
                  Target Resolution Performance
                </div>
                <div className="text-xl font-bold mt-1" style={{ color: theme.text }}>
                  Total MTTR: <span style={{ color: theme.accent }}>11m 24s</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>
                  Remediation Action
                </div>
                <div className="text-sm font-bold font-mono mt-1" style={{ color: theme.text, fontFamily: MONO }}>
                  Rollback v1.8 → v1.7
                </div>
              </div>
            </div>
          </div>

          {/* Section: Executive Summary */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: theme.accent }}>
              1. Executive Summary
            </h3>
            <p className="text-xs font-medium" style={{ color: theme.textSecondary, lineHeight: 1.6 }}>
              At 10:24 AM, CloudDoctor detected critical degradation on <code>payment-service</code>. Through autonomous multi-modal telemetry correlation, the engine identified a database query regression in release v1.8 where an index hint was omitted. After digital twin simulation and engineer authorization, automated rollback to v1.7 resolved the incident with 0 permanent data loss.
            </p>
          </div>

          {/* Section: Metrics Comparison Table */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: theme.accent }}>
              2. Incident Blast Radius & Metrics Impact
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Peak CPU Saturation", before: "98%", after: "54%", status: "Recovered" },
                { label: "Error Rate", before: "42%", after: "3%", status: "Recovered" },
                { label: "P99 Latency", before: "4,200ms", after: "180ms", status: "Recovered" },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{
                    padding: 12,
                    background: theme.surface2,
                    borderRadius: 6,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <div className="text-xs font-semibold" style={{ color: theme.textMuted }}>
                    {m.label}
                  </div>
                  <div className="text-sm font-bold mt-1" style={{ color: theme.text }}>
                    <span style={{ color: theme.critical }}>{m.before}</span> → <span style={{ color: theme.success }}>{m.after}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Preventative Action Items */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: theme.accent }}>
              3. Preventative Action Items
            </h3>
            <ul className="text-xs font-medium flex flex-col gap-2" style={{ color: theme.textSecondary }}>
              <li className="flex items-start gap-2">
                <ShieldCheck size={14} style={{ color: theme.success, flexShrink: 0, marginTop: 2 }} />
                <span><strong>[CI/CD Guardrail]</strong> Add automated SQL execution plan verification in pull request pipelines.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck size={14} style={{ color: theme.success, flexShrink: 0, marginTop: 2 }} />
                <span><strong>[Resilience]</strong> Implement exponential backoff and jitter on downstream payment retry policies.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck size={14} style={{ color: theme.success, flexShrink: 0, marginTop: 2 }} />
                <span><strong>[Observability]</strong> Integrate query planner telemetry directly into staging canary validation gates.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "14px 22px",
            borderTop: `1px solid ${theme.border}`,
            background: theme.surface2,
          }}
        >
          <div className="text-xs" style={{ color: theme.textMuted }}>
            Cryptographically signed by CloudDoctor Autonomous Engine
          </div>
          <button
            onClick={handleCopy}
            className="text-xs font-bold px-4 py-2 rounded-md cursor-pointer"
            style={{
              background: theme.accent,
              color: "#FFFFFF",
              border: "none",
            }}
          >
            {copied ? "Copied!" : "Export Post-Mortem"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
