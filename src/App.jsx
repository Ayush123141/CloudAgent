import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import {
  Activity, AlertTriangle, ArrowRight, CheckCircle2, Circle, Clock, Database,
  FileText, GitBranch, Layers, LayoutGrid, ListChecks, PlayCircle, Search,
  Server, Settings as SettingsIcon, ShieldCheck, ShieldAlert, XCircle,
  ChevronDown, ChevronRight, TrendingUp, TrendingDown, History, FlaskConical,
  Loader2, HeartPulse, Boxes,
} from "lucide-react";

/* =============================================================================
   DESIGN TOKENS
============================================================================= */
const C = {
  bg: "#080B10",
  surface: "#0D1219",
  surface2: "#111821",
  surface3: "#151D28",
  border: "#202936",
  borderStrong: "#2B3646",
  text: "#F4F7FA",
  textSecondary: "#8D99A8",
  textMuted: "#5F6B78",
  accent: "#3E9EFF",
  accentSoft: "rgba(62,158,255,0.12)",
  accentBorder: "rgba(62,158,255,0.35)",
  success: "#2FB67C",
  successSoft: "rgba(47,182,124,0.13)",
  successBorder: "rgba(47,182,124,0.35)",
  warning: "#D6A537",
  warningSoft: "rgba(214,165,55,0.13)",
  warningBorder: "rgba(214,165,55,0.35)",
  critical: "#E5484D",
  criticalSoft: "rgba(229,72,77,0.14)",
  criticalBorder: "rgba(229,72,77,0.4)",
};

const FONT = "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/* =============================================================================
   MOCK DATA — canonical incident: payment-service v1.8 rollback
============================================================================= */
const TIME_POINTS = ["10:00","10:03","10:06","10:09","10:12","10:15","10:18","10:20","10:22","10:24","10:26","10:28","10:29","10:31","10:33","10:36","10:39","10:42","10:45","10:48","10:50"];
const CPU_SERIES     = [44,46,45,45,46,45,45,52,75,98,98,98,85,58,54,54,54,54,54,54,54];
const ERROR_SERIES   = [1.1,1.3,1.2,1.2,1.3,1.2,1.2,2,18,42,42,42,25,5,3,3,3,3,3,3,3];
const LATENCY_SERIES = [118,122,120,119,121,120,120,300,1800,4200,4200,4200,2500,300,180,180,180,180,180,180,180];
const DEPLOY_IDX = 6;   // 10:18
const INCIDENT_IDX = 9; // 10:24

const SERVICES_STATIC = [
  { id: "order-service", status: "healthy", cpu: 42, error: 0.8, latency: 132, version: "v2.4" },
  { id: "user-service", status: "healthy", cpu: 38, error: 0.4, latency: 98, version: "v3.1" },
  { id: "notification-service", status: "warning", cpu: 67, error: 3.2, latency: 410, version: "v1.9" },
];

const EVIDENCE_SOURCES = [
  { name: "Metrics", detail: "142 signals collected", time: "10:24:31", icon: Activity },
  { name: "Logs", detail: "1,284 events collected", time: "10:24:47", icon: FileText },
  { name: "Traces", detail: "96 spans collected", time: "10:24:52", icon: Layers },
  { name: "Deployment History", detail: "v1.8 detected", time: "10:24:47", icon: Boxes },
  { name: "Git Changes", detail: "7 files changed", time: "10:25:02", icon: GitBranch },
  { name: "Dependency Health", detail: "Database anomaly found", time: "10:25:19", icon: Database },
];

const INVESTIGATION_FEED = [
  { time: "10:24:12", title: "Incident detected", detail: "CPU threshold exceeded on payment-service", ref: "Metrics", icon: AlertTriangle },
  { time: "10:24:18", title: "Correlating metrics", detail: "Error rate increased 31% after deployment", ref: "Metrics", icon: TrendingUp },
  { time: "10:24:31", title: "Analyzing logs", detail: "Detected timeout + retry pattern", ref: "Logs", icon: FileText },
  { time: "10:24:47", title: "Inspecting deployment", detail: "payment-service v1.8 deployed 2m before incident", ref: "Deployment", icon: Boxes },
  { time: "10:25:02", title: "Analyzing code changes", detail: "Database query modified in v1.8", ref: "Git", icon: GitBranch },
  { time: "10:25:19", title: "Correlating dependency health", detail: "Database latency increased 4.1×", ref: "Dependencies", icon: Database },
  { time: "10:25:32", title: "RCA generated", detail: "Root cause identified with 89% confidence", ref: "RCA Engine", icon: ShieldCheck },
];

const EVIDENCE_CHAIN = [
  "Deployment v1.8",
  "Database query changed",
  "Database latency increased",
  "Timeouts increased",
  "Retries increased",
  "CPU reached 98%",
  "Error rate reached 42%",
];
const EVIDENCE_CHAIN_DETAIL = [
  "payment-service v1.8 deployed at 10:18, two minutes before symptoms began.",
  "Git diff shows the order-lookup query in v1.8 dropped an index hint used in v1.7.",
  "Median query latency to the primary database rose from 40ms to 640ms within 4 minutes.",
  "Downstream calls began exceeding their 1.5s timeout budget as queries slowed.",
  "The service's retry policy re-issued failed requests, compounding load on the database.",
  "Compute saturated as retries and slow queries queued faster than they could drain.",
  "Client-facing requests began failing once CPU saturation caused request queuing.",
];

const SUPPORTING_EVIDENCE = [
  { source: "Deployment", finding: "v1.8 deployed 2m before incident", relevance: 92, icon: Boxes },
  { source: "Logs", finding: "Timeout/retry pattern increased 8.4×", relevance: 88, icon: FileText },
  { source: "Database", finding: "Query latency increased 3.7×", relevance: 90, icon: Database },
  { source: "Metrics", finding: "CPU spike follows error-rate increase", relevance: 81, icon: Activity },
  { source: "Git", finding: "Query optimization change introduced in v1.8", relevance: 85, icon: GitBranch },
];

const ALTERNATIVES = [
  { action: "Scale payment-service horizontally", risk: "Medium", confidence: 61, note: "Adds compute but does not address the underlying query regression." },
  { action: "Restart affected pods", risk: "Medium", confidence: 44, note: "Provides brief relief; incident recurs once query load returns." },
];

const SAFETY_CHECKS = [
  "Rollback available",
  "Sandbox simulation passed",
  "Confidence threshold met",
  "No database mutation",
  "Previous version healthy",
];

const TIMELINE = [
  { time: "10:18", label: "Deployment v1.8", type: "deploy" },
  { time: "10:20", label: "Database latency begins rising", type: "signal" },
  { time: "10:24", label: "Incident detected", type: "critical" },
  { time: "10:24", label: "CPU reaches 98%", type: "critical" },
  { time: "10:25", label: "CloudDoctor begins investigation", type: "investigate" },
  { time: "10:25", label: "Root cause identified", type: "diagnose" },
  { time: "10:26", label: "Rollback recommended", type: "remediate" },
  { time: "10:27", label: "Simulation completed", type: "simulate" },
  { time: "10:28", label: "Rollback approved", type: "approve" },
  { time: "10:29", label: "Rollback executed", type: "execute" },
  { time: "10:31", label: "Recovery verified", type: "resolved" },
];

const ACTION_LOG_BASE = [
  { time: "10:24", actor: "CloudDoctor", action: "Create incident INC-1042", approval: "Automatic", result: "Success" },
  { time: "10:25", actor: "CloudDoctor", action: "Generate root cause analysis", approval: "Automatic", result: "Success" },
];
const ACTION_LOG_APPROVAL = [
  { time: "10:28", actor: "Engineer", action: "Approve rollback v1.8 → v1.7", approval: "Approved", result: "Success" },
  { time: "10:29", actor: "CloudDoctor", action: "Execute rollback v1.8 → v1.7", approval: "Approved", result: "Success" },
  { time: "10:31", actor: "CloudDoctor", action: "Verify recovery", approval: "Automatic", result: "Passed" },
];

const STAGE_STEPS = [
  { key: "detected", label: "Detected" },
  { key: "investigating", label: "Investigating" },
  { key: "diagnosed", label: "Diagnosed" },
  { key: "remediation", label: "Remediation" },
  { key: "verifying", label: "Verifying" },
  { key: "resolved", label: "Resolved" },
];
const STAGE_RANK = {
  healthy: 0, detected: 1, investigating: 2, diagnosed: 3,
  remediation: 4, simulated: 5, approval: 6, rejected: 6, executing: 7, resolved: 8,
};
function stageStepIndex(stage) {
  if (stage === "healthy") return -1;
  if (stage === "detected") return 0;
  if (stage === "investigating") return 1;
  if (stage === "diagnosed") return 2;
  if (["remediation", "simulated", "approval", "rejected"].includes(stage)) return 3;
  if (stage === "executing") return 4;
  if (stage === "resolved") return 5;
  return -1;
}
function chartCutoff(stage) {
  if (stage === "healthy") return DEPLOY_IDX;
  if (stage === "detected") return INCIDENT_IDX;
  if (stage === "executing") return 13;
  if (stage === "resolved") return TIME_POINTS.length - 1;
  return 11; // investigating / diagnosed / remediation / simulated / approval / rejected
}

const NAV_GROUPS = [
  [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "incidents", label: "Incidents", icon: AlertTriangle },
    { id: "investigation", label: "Investigations", icon: Search },
  ],
  [
    { id: "services", label: "Services", icon: Server },
    { id: "timeline", label: "Timeline", icon: History },
    { id: "actionlog", label: "Action Logs", icon: ListChecks },
  ],
  [{ id: "remediation", label: "Simulation", icon: FlaskConical }],
  [{ id: "settings", label: "Settings", icon: SettingsIcon }],
];

const BREADCRUMBS = {
  overview: "Operations / Overview",
  incidents: "Operations / Incidents",
  investigation: "Operations / Incident INC-1042 / Investigation",
  rootcause: "Operations / Incident INC-1042 / Root Cause",
  remediation: "Operations / Incident INC-1042 / Remediation",
  recovery: "Operations / Incident INC-1042 / Recovery",
  timeline: "Operations / Timeline",
  actionlog: "Operations / Action Logs",
  services: "Operations / Services",
  settings: "Settings",
};

/* =============================================================================
   PRIMITIVES
============================================================================= */
function statusColor(status) {
  if (status === "critical") return C.critical;
  if (status === "warning") return C.warning;
  if (status === "healthy" || status === "resolved") return C.success;
  if (status === "info") return C.accent;
  return C.textMuted;
}

function StatusDot({ status, pulse }) {
  const color = statusColor(status);
  return (
    <span
      className={pulse ? "animate-pulse" : ""}
      style={{ width: 7, height: 7, borderRadius: 999, background: color, display: "inline-block", flexShrink: 0 }}
    />
  );
}

function Badge({ children, tone = "neutral", size = "sm" }) {
  const map = {
    critical: { bg: C.criticalSoft, border: C.criticalBorder, color: C.critical },
    warning: { bg: C.warningSoft, border: C.warningBorder, color: C.warning },
    success: { bg: C.successSoft, border: C.successBorder, color: C.success },
    accent: { bg: C.accentSoft, border: C.accentBorder, color: C.accent },
    neutral: { bg: C.surface3, border: C.border, color: C.textSecondary },
  };
  const t = map[tone] || map.neutral;
  return (
    <span
      className={size === "sm" ? "text-xs" : "text-sm"}
      style={{
        background: t.bg, border: `1px solid ${t.border}`, color: t.color,
        padding: size === "sm" ? "2px 8px" : "4px 10px", borderRadius: 4,
        fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
        display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function Panel({ title, eyebrow, right, children, className = "", padded = true }) {
  return (
    <div className={className} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }}>
      {(title || right) && (
        <div className="flex items-center justify-between" style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}` }}>
          <div>
            {eyebrow && (
              <div className="text-xs" style={{ color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 2 }}>
                {eyebrow}
              </div>
            )}
            {title && <div className="text-sm" style={{ color: C.text, fontWeight: 600 }}>{title}</div>}
          </div>
          {right}
        </div>
      )}
      <div style={padded ? { padding: 18 } : undefined}>{children}</div>
    </div>
  );
}

function KpiCard({ label, value, sub, tone }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 16px", flex: 1, minWidth: 0 }}>
      <div className="text-xs" style={{ color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{label}</div>
      <div className="tabular-nums" style={{ fontSize: 26, fontWeight: 700, color: tone || C.text, marginTop: 6, lineHeight: 1 }}>{value}</div>
      {sub && <div className="text-xs" style={{ color: C.textMuted, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function Metric({ label, value, direction, tone }) {
  return (
    <div>
      <div className="text-xs" style={{ color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{label}</div>
      <div className="flex items-center gap-1 tabular-nums" style={{ fontSize: 20, fontWeight: 700, color: tone || C.text, marginTop: 4 }}>
        {value}
        {direction === "up" && <TrendingUp size={15} style={{ color: C.critical }} />}
        {direction === "down" && <TrendingDown size={15} style={{ color: C.success }} />}
      </div>
    </div>
  );
}

function StageProgress({ stage }) {
  const idx = stageStepIndex(stage);
  return (
    <div className="flex items-center" style={{ width: "100%" }}>
      {STAGE_STEPS.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        const color = active ? C.accent : done ? C.success : C.textMuted;
        return (
          <React.Fragment key={s.key}>
            <div className="flex items-center gap-2" style={{ minWidth: 0 }}>
              <span
                style={{
                  width: 9, height: 9, borderRadius: 999, flexShrink: 0,
                  background: active || done ? color : "transparent",
                  border: `2px solid ${color}`,
                }}
              />
              <span
                className="text-xs"
                style={{ color, fontWeight: active ? 700 : 600, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.04em" }}
              >
                {s.label}
              </span>
            </div>
            {i < STAGE_STEPS.length - 1 && (
              <div style={{ flex: 1, height: 1, background: done ? C.success : C.border, margin: "0 12px", opacity: done ? 0.6 : 1 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ConfidenceGauge({ value, size = 128, color }) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={C.border} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={color || C.accent} strokeWidth={stroke} fill="none"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="flex flex-col items-center justify-center" style={{ position: "absolute", inset: 0 }}>
        <span className="tabular-nums" style={{ fontSize: 30, fontWeight: 800, color: C.text }}>{value}%</span>
        <span className="text-xs" style={{ color: C.textMuted }}>confidence</span>
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label, unit }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: C.surface2, border: `1px solid ${C.borderStrong}`, borderRadius: 6, padding: "8px 10px" }}>
      <div className="text-xs" style={{ color: C.textMuted, fontFamily: MONO }}>{label}</div>
      <div className="tabular-nums text-sm" style={{ color: C.text, fontWeight: 700, fontFamily: MONO }}>
        {payload[0].value}{unit}
      </div>
    </div>
  );
}

function MetricChart({ title, data, unit, color, cutoffIdx, height = 150 }) {
  const trimmed = data.map((d, i) => (i <= cutoffIdx ? d : { ...d, v: null }));
  return (
    <Panel title={title} padded={false}>
      <div style={{ padding: "12px 14px 6px" }}>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={trimmed} margin={{ top: 6, right: 10, left: -18, bottom: 0 }}>
            <CartesianGrid stroke={C.border} strokeDasharray="3 5" vertical={false} />
            <XAxis dataKey="t" stroke={C.textMuted} tick={{ fontSize: 10, fill: C.textMuted }} tickLine={false} axisLine={{ stroke: C.border }} minTickGap={24} />
            <YAxis stroke={C.textMuted} tick={{ fontSize: 10, fill: C.textMuted }} tickLine={false} axisLine={false} width={34} />
            <Tooltip content={<ChartTooltip unit={unit} />} />
            <ReferenceLine x={TIME_POINTS[DEPLOY_IDX]} stroke={C.accent} strokeDasharray="4 3" label={{ value: "v1.8", fill: C.accent, fontSize: 10, position: "insideTopLeft" }} />
            <ReferenceLine x={TIME_POINTS[INCIDENT_IDX]} stroke={C.critical} strokeDasharray="4 3" label={{ value: "Incident", fill: C.critical, fontSize: 10, position: "insideTopRight" }} />
            <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function Pending({ title, message, ctaLabel, onCta, icon: Icon = Clock }) {
  return (
    <div className="flex flex-col items-center justify-center text-center" style={{ padding: "72px 24px" }}>
      <div style={{ width: 44, height: 44, borderRadius: 999, background: C.surface2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <Icon size={20} style={{ color: C.textMuted }} />
      </div>
      <div className="text-sm" style={{ color: C.text, fontWeight: 600, marginBottom: 6 }}>{title}</div>
      <div className="text-sm" style={{ color: C.textMuted, maxWidth: 380, marginBottom: onCta ? 18 : 0 }}>{message}</div>
      {onCta && (
        <button onClick={onCta} className="text-sm" style={btnPrimary}>
          {ctaLabel} <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}

const btnPrimary = {
  background: C.accent, color: "#04101F", border: "none", borderRadius: 6,
  padding: "9px 16px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
};
const btnGhost = {
  background: "transparent", color: C.text, border: `1px solid ${C.borderStrong}`, borderRadius: 6,
  padding: "9px 16px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
};
const btnDanger = {
  background: "transparent", color: C.textSecondary, border: `1px solid ${C.borderStrong}`, borderRadius: 6,
  padding: "9px 16px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
};

/* =============================================================================
   SIDEBAR + TOPBAR
============================================================================= */
function Sidebar({ page, setPage }) {
  return (
    <div className="flex flex-col" style={{ width: 220, flexShrink: 0, background: C.surface, borderRight: `1px solid ${C.border}`, height: "100%" }}>
      <div className="flex items-center gap-2" style={{ padding: "18px 18px 16px" }}>
        <div style={{ width: 26, height: 26, borderRadius: 6, background: C.accentSoft, border: `1px solid ${C.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <HeartPulse size={14} style={{ color: C.accent }} />
        </div>
        <div className="text-sm" style={{ fontWeight: 700, color: C.text, letterSpacing: "-0.01em" }}>
          Cloud<span style={{ color: C.accent }}>Doctor</span>
        </div>
      </div>

      <div className="flex-1" style={{ padding: "6px 10px", overflowY: "auto" }}>
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: gi < NAV_GROUPS.length - 1 ? `1px solid ${C.border}` : "none" }}>
            {group.map((item) => {
              const Icon = item.icon;
              const active = page === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className="flex items-center gap-2.5 text-sm w-full"
                  style={{
                    padding: "8px 10px", borderRadius: 6, marginBottom: 2, border: "none", cursor: "pointer",
                    background: active ? C.accentSoft : "transparent",
                    color: active ? C.accent : C.textSecondary, fontWeight: active ? 600 : 500, textAlign: "left",
                  }}
                >
                  <Icon size={15} />
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ padding: "14px 16px", borderTop: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between text-xs" style={{ color: C.textSecondary, marginBottom: 10 }}>
          <span>Environment</span>
          <span className="flex items-center gap-1" style={{ color: C.text, fontWeight: 600 }}>
            Production <ChevronDown size={12} />
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: C.textSecondary }}>
          <StatusDot status="healthy" pulse />
          Agent Operational
        </div>
      </div>
    </div>
  );
}

function TopBar({ page, stage, onDemo, demoRunning }) {
  return (
    <div className="flex items-center justify-between" style={{ height: 52, padding: "0 20px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
      <div className="text-sm" style={{ color: C.textSecondary }}>
        {BREADCRUMBS[page] || "Operations"}
      </div>
      <div className="flex items-center gap-5">
        <button onClick={onDemo} className="flex items-center gap-2 text-xs" style={{ ...btnGhost, padding: "6px 12px" }} disabled={demoRunning}>
          {demoRunning ? <Loader2 size={13} className="animate-spin" /> : <PlayCircle size={13} />}
          {demoRunning ? "Running demo…" : "Run Incident Simulation"}
        </button>
        <div className="flex items-center gap-2 text-xs" style={{ color: C.textSecondary }}>
          <span style={{ color: C.text, fontWeight: 600 }}>Production</span>
        </div>
        <div className="text-xs" style={{ color: C.textMuted, fontFamily: MONO }}>
          Updated {stage === "resolved" ? "10:31:04" : "10:25:19"}
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: C.textSecondary }}>
          <StatusDot status="healthy" pulse /> CloudDoctor Agent Active
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   OVERVIEW
============================================================================= */
function Overview({ stage, onOpenIncident }) {
  const resolved = stage === "resolved";
  const active = stage !== "healthy" && !resolved;
  const cpuData = useMemo(() => TIME_POINTS.map((t, i) => ({ t, v: CPU_SERIES[i] })), []);
  const errData = useMemo(() => TIME_POINTS.map((t, i) => ({ t, v: ERROR_SERIES[i] })), []);
  const latData = useMemo(() => TIME_POINTS.map((t, i) => ({ t, v: LATENCY_SERIES[i] })), []);
  const cutoff = chartCutoff(stage);

  const paymentRow = resolved
    ? { id: "payment-service", status: "healthy", cpu: 54, error: 3, latency: 180, version: "v1.7" }
    : { id: "payment-service", status: "critical", cpu: 98, error: 42, latency: 4200, version: "v1.8" };
  const services = [paymentRow, ...SERVICES_STATIC];

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <div className="text-xl" style={{ fontWeight: 700, color: C.text }}>Overview</div>
        <div className="text-sm" style={{ color: C.textMuted, marginTop: 2 }}>Production environment</div>
        <div className="flex items-center gap-2 text-sm" style={{ marginTop: 10, color: active ? C.critical : C.success }}>
          <StatusDot status={active ? "critical" : "healthy"} pulse={active} />
          {active ? "Degraded — 1 active incident" : "Operational — all systems normal"}
        </div>
      </div>

      <div className="flex gap-3">
        <KpiCard label="System Health" value="98.2%" />
        <KpiCard label="Active Incidents" value={active ? "1" : "0"} tone={active ? C.critical : C.success} />
        <KpiCard label="Critical Services" value={active ? "1" : "0"} tone={active ? C.critical : C.success} />
        <KpiCard label="MTTR" value="18m" />
        <KpiCard label="AI Confidence" value={stage === "healthy" || stage === "detected" ? "—" : "89%"} tone={C.accent} />
      </div>

      {active ? (
        <div
          style={{ background: C.surface, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.critical}`, borderRadius: 8, padding: 20 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                <Badge tone="critical">Critical</Badge>
                <span className="text-sm" style={{ color: C.textMuted, fontFamily: MONO }}>INC-1042</span>
              </div>
              <div className="text-lg" style={{ fontWeight: 700, color: C.text }}>Payment Service Degradation</div>
              <div className="text-sm" style={{ color: C.textMuted, marginTop: 4 }}>
                payment-service · Production · Started 10:24 AM · Duration 08m 42s
              </div>
            </div>
            <button onClick={onOpenIncident} style={btnPrimary}>
              Open Investigation <ArrowRight size={14} />
            </button>
          </div>
          <div className="flex gap-8" style={{ marginTop: 20 }}>
            <Metric label="CPU" value="98%" direction="up" tone={C.critical} />
            <Metric label="Error Rate" value="42%" direction="up" tone={C.critical} />
            <Metric label="Latency" value="4.2s" direction="up" tone={C.critical} />
            <div>
              <div className="text-xs" style={{ color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Status</div>
              <div className="text-sm" style={{ color: C.accent, fontWeight: 700, marginTop: 4 }}>
                {stage === "detected" ? "Detected" : stage === "investigating" ? "Investigating" : stage === "diagnosed" ? "Diagnosed" : "Remediation in progress"}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.success}`, borderRadius: 8, padding: 20 }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
            <Badge tone="success">Resolved</Badge>
            <span className="text-sm" style={{ color: C.textMuted, fontFamily: MONO }}>INC-1042</span>
          </div>
          <div className="text-base" style={{ fontWeight: 700, color: C.text }}>Payment Service Degradation — recovery verified</div>
          <div className="text-sm" style={{ color: C.textMuted, marginTop: 4 }}>
            Rolled back payment-service v1.8 → v1.7 · Resolved in 11m 24s
          </div>
        </div>
      )}

      <Panel title="Service Health" padded={false}>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Service", "Status", "CPU", "Error Rate", "Latency", "Version"].map((h) => (
                <th key={h} className="text-xs" style={{ textAlign: "left", padding: "10px 18px", color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "11px 18px", color: C.text, fontWeight: 600 }}>{s.id}</td>
                <td style={{ padding: "11px 18px" }}>
                  <span className="flex items-center gap-2" style={{ color: statusColor(s.status), fontWeight: 600, textTransform: "capitalize" }}>
                    <StatusDot status={s.status} /> {s.status}
                  </span>
                </td>
                <td className="tabular-nums" style={{ padding: "11px 18px", color: C.textSecondary }}>{s.cpu}%</td>
                <td className="tabular-nums" style={{ padding: "11px 18px", color: C.textSecondary }}>{s.error}%</td>
                <td className="tabular-nums" style={{ padding: "11px 18px", color: C.textSecondary }}>{s.latency >= 1000 ? (s.latency / 1000).toFixed(1) + "s" : s.latency + "ms"}</td>
                <td style={{ padding: "11px 18px", color: C.textMuted, fontFamily: MONO }}>{s.version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <div className="text-sm" style={{ color: C.textMuted, fontWeight: 600 }}>Observability</div>
      <div className="grid grid-cols-2 gap-4">
        <MetricChart title="Error Rate" data={errData} unit="%" color={C.critical} cutoffIdx={cutoff} />
        <MetricChart title="CPU Usage" data={cpuData} unit="%" color={C.accent} cutoffIdx={cutoff} />
      </div>
      <MetricChart title="Latency" data={latData} unit="ms" color={C.warning} cutoffIdx={cutoff} height={140} />
    </div>
  );
}

/* =============================================================================
   INCIDENTS LIST
============================================================================= */
function IncidentsList({ stage, onOpenIncident }) {
  const resolved = stage === "resolved";
  const rows = [
    { id: "INC-1042", service: "payment-service", cause: "Bad deployment (v1.8)", status: resolved ? "resolved" : "critical", time: "10:24 AM", active: true },
    { id: "INC-1031", service: "user-service", cause: "Config issue", status: "resolved", time: "08:12 AM" },
    { id: "INC-1024", service: "order-service", cause: "High load", status: "resolved", time: "06:45 AM" },
  ];
  return (
    <div style={{ padding: 24 }}>
      <div className="text-xl" style={{ fontWeight: 700, color: C.text, marginBottom: 2 }}>Incidents</div>
      <div className="text-sm" style={{ color: C.textMuted, marginBottom: 18 }}>Production environment</div>
      <Panel padded={false}>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["ID", "Service", "Cause", "Status", "Started"].map((h) => (
                <th key={h} className="text-xs" style={{ textAlign: "left", padding: "10px 18px", color: C.textMuted, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "12px 18px", color: C.text, fontFamily: MONO }}>{r.id}</td>
                <td style={{ padding: "12px 18px", color: C.textSecondary }}>{r.service}</td>
                <td style={{ padding: "12px 18px", color: C.textSecondary }}>{r.cause}</td>
                <td style={{ padding: "12px 18px" }}>
                  <span className="flex items-center gap-2" style={{ color: statusColor(r.status), fontWeight: 600, textTransform: "capitalize" }}>
                    <StatusDot status={r.status} /> {r.status}
                  </span>
                </td>
                <td style={{ padding: "12px 18px", color: C.textMuted, fontFamily: MONO }}>{r.time}</td>
                <td style={{ padding: "12px 18px", textAlign: "right" }}>
                  {r.active && (
                    <button onClick={onOpenIncident} className="text-xs" style={{ ...btnGhost, padding: "6px 12px" }}>
                      Investigate <ChevronRight size={13} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

/* =============================================================================
   INVESTIGATION
============================================================================= */
function Investigation({ stage, onViewRootCause }) {
  if (STAGE_RANK[stage] < STAGE_RANK.investigating) {
    return <div style={{ padding: 24 }}><Pending title="No active investigation" message="Incidents are investigated automatically once detected. Open the Overview to see current status." icon={Search} /></div>;
  }
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
          <Badge tone="critical">Critical</Badge>
          <Badge tone="accent">{stage === "investigating" ? "Investigating" : "Diagnosed"}</Badge>
        </div>
        <div className="text-xl" style={{ fontWeight: 700, color: C.text }}>Incident INC-1042</div>
        <div className="text-sm" style={{ color: C.textMuted, marginTop: 2 }}>Payment Service Degradation</div>
      </div>

      <Panel padded={true}>
        <StageProgress stage={stage} />
      </Panel>

      <div className="grid grid-cols-3 gap-4" style={{ gridTemplateColumns: "1fr 1.6fr 1fr", display: "grid" }}>
        <Panel title="Evidence Sources">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {EVIDENCE_SOURCES.map((e) => {
              const Icon = e.icon;
              return (
                <div key={e.name} className="flex items-start gap-3">
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: C.surface2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={13} style={{ color: C.textSecondary }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="flex items-center gap-1.5 text-sm" style={{ color: C.text, fontWeight: 600 }}>
                      <CheckCircle2 size={13} style={{ color: C.success }} /> {e.name}
                    </div>
                    <div className="text-xs" style={{ color: C.textMuted, marginTop: 1 }}>{e.detail} · {e.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="CloudDoctor Investigation" eyebrow="Autonomous activity">
          <div style={{ display: "flex", flexDirection: "column" }}>
            {INVESTIGATION_FEED.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex gap-3" style={{ paddingBottom: i < INVESTIGATION_FEED.length - 1 ? 16 : 0, position: "relative" }}>
                  <div className="flex flex-col items-center">
                    <div style={{ width: 22, height: 22, borderRadius: 999, background: C.accentSoft, border: `1px solid ${C.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={11} style={{ color: C.accent }} />
                    </div>
                    {i < INVESTIGATION_FEED.length - 1 && <div style={{ width: 1, flex: 1, background: C.border, marginTop: 2 }} />}
                  </div>
                  <div style={{ paddingBottom: 4 }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: C.textMuted, fontFamily: MONO }}>{f.time}</span>
                      <span className="text-sm" style={{ color: C.text, fontWeight: 600 }}>{f.title}</span>
                    </div>
                    <div className="text-sm" style={{ color: C.textSecondary, marginTop: 2 }}>{f.detail}</div>
                    <Badge tone="neutral">{f.ref}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Panel title="Incident Signal">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Metric label="CPU" value="98%" direction="up" tone={C.critical} />
              <Metric label="Error Rate" value="42%" direction="up" tone={C.critical} />
              <Metric label="Latency" value="4.2s" direction="up" tone={C.critical} />
              <Metric label="Deployment" value="v1.8" />
              <Metric label="Database" value="Degraded" tone={C.warning} />
            </div>
          </Panel>
          <Panel title="Investigation Progress">
            <div className="text-sm" style={{ color: C.text, fontWeight: 600, marginBottom: 8 }}>7 / 7 evidence sources analyzed</div>
            <div style={{ height: 6, borderRadius: 999, background: C.surface2, overflow: "hidden", marginBottom: 16 }}>
              <div style={{ width: "100%", height: "100%", background: C.success }} />
            </div>
            <button onClick={onViewRootCause} style={{ ...btnPrimary, width: "100%", justifyContent: "center" }}>
              View Root Cause <ArrowRight size={14} />
            </button>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   ROOT CAUSE
============================================================================= */
function RootCause({ stage, onViewRemediation }) {
  const [openNode, setOpenNode] = useState(null);
  if (STAGE_RANK[stage] < STAGE_RANK.diagnosed) {
    return <div style={{ padding: 24 }}><Pending title="Root cause not yet available" message="CloudDoctor is still collecting evidence for this incident." icon={ShieldAlert} /></div>;
  }
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <div className="text-xl" style={{ fontWeight: 700, color: C.text }}>Root Cause Analysis</div>
        <div className="text-sm" style={{ color: C.textMuted, marginTop: 2 }}>INC-1042 · Payment Service</div>
      </div>

      <Panel eyebrow="Likely root cause">
        <div className="flex items-center gap-8">
          <ConfidenceGauge value={89} color={C.accent} />
          <div>
            <div className="text-lg" style={{ fontWeight: 700, color: C.text, lineHeight: 1.4 }}>
              Database query regression introduced in payment-service v1.8
            </div>
            <div className="flex items-center gap-2" style={{ marginTop: 10 }}>
              <Badge tone="accent">89% confidence</Badge>
              <Badge tone="neutral">Hypothesis</Badge>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Why CloudDoctor believes this" eyebrow="Evidence chain">
        <div style={{ display: "flex", flexDirection: "column" }}>
          {EVIDENCE_CHAIN.map((node, i) => {
            const open = openNode === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpenNode(open ? null : i)}
                  className="flex items-center gap-3 w-full text-left"
                  style={{ padding: "10px 12px", borderRadius: 6, background: open ? C.accentSoft : "transparent", border: `1px solid ${open ? C.accentBorder : "transparent"}`, cursor: "pointer" }}
                >
                  <span
                    className="text-xs tabular-nums"
                    style={{ width: 22, height: 22, borderRadius: 999, background: C.surface2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.textSecondary, flexShrink: 0 }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm" style={{ color: C.text, fontWeight: 600 }}>{node}</span>
                  <ChevronDown size={14} style={{ color: C.textMuted, marginLeft: "auto", transform: open ? "rotate(180deg)" : "none" }} />
                </button>
                {open && (
                  <div className="text-sm" style={{ color: C.textSecondary, padding: "4px 12px 12px 46px" }}>{EVIDENCE_CHAIN_DETAIL[i]}</div>
                )}
                {i < EVIDENCE_CHAIN.length - 1 && <div style={{ width: 1, height: 10, background: C.border, marginLeft: 22 }} />}
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title="Supporting Evidence">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SUPPORTING_EVIDENCE.map((e, i) => {
            const Icon = e.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <div style={{ width: 26, height: 26, borderRadius: 6, background: C.surface2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={13} style={{ color: C.textSecondary }} />
                </div>
                <div style={{ flex: 1 }}>
                  <span className="text-sm" style={{ color: C.textMuted, fontWeight: 600, marginRight: 6 }}>{e.source}:</span>
                  <span className="text-sm" style={{ color: C.text }}>{e.finding}</span>
                </div>
                <div style={{ width: 70, height: 5, borderRadius: 999, background: C.surface2, overflow: "hidden" }}>
                  <div style={{ width: `${e.relevance}%`, height: "100%", background: C.accent }} />
                </div>
                <span className="text-xs tabular-nums" style={{ color: C.textMuted, width: 30, textAlign: "right" }}>{e.relevance}%</span>
              </div>
            );
          })}
        </div>
      </Panel>

      <div>
        <button onClick={onViewRemediation} style={btnPrimary}>
          View Remediation <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* =============================================================================
   REMEDIATION (recommendation + simulation + safety gate + approval)
============================================================================= */
function Remediation({ stage, onSimulate, onRequestApproval, onApprove, onReject }) {
  if (STAGE_RANK[stage] < STAGE_RANK.remediation) {
    return <div style={{ padding: 24 }}><Pending title="No remediation planned yet" message="A remediation plan is generated once root cause analysis completes." icon={FlaskConical} /></div>;
  }
  const simulated = STAGE_RANK[stage] >= STAGE_RANK.simulated;
  const approvalStage = stage === "approval";
  const rejected = stage === "rejected";
  const executedOrLater = STAGE_RANK[stage] >= STAGE_RANK.executing;

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <div className="text-xl" style={{ fontWeight: 700, color: C.text }}>Recommended Remediation</div>
        <div className="text-sm" style={{ color: C.textMuted, marginTop: 2 }}>INC-1042 · Payment Service</div>
      </div>

      <Panel>
        <div className="flex items-start justify-between">
          <div>
            <Badge tone="accent">Recommended</Badge>
            <div className="text-lg" style={{ fontWeight: 700, color: C.text, marginTop: 10 }}>Rollback payment-service</div>
            <div className="text-2xl" style={{ fontWeight: 800, color: C.text, fontFamily: MONO, marginTop: 2 }}>v1.8 → v1.7</div>
            <div className="text-sm" style={{ color: C.textSecondary, marginTop: 10, maxWidth: 480 }}>
              Deployment v1.8 is strongly correlated with the incident. Rolling back restores the previously healthy version.
            </div>
          </div>
          <div className="flex gap-8">
            <Metric label="Confidence" value="89%" tone={C.accent} />
            <div>
              <div className="text-xs" style={{ color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Risk</div>
              <div style={{ marginTop: 4 }}><Badge tone="success">Low</Badge></div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Alternatives considered">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ALTERNATIVES.map((a, i) => (
            <div key={i} className="flex items-center justify-between" style={{ padding: "10px 12px", background: C.surface2, borderRadius: 6, border: `1px solid ${C.border}` }}>
              <div>
                <div className="text-sm" style={{ color: C.text, fontWeight: 600 }}>{a.action}</div>
                <div className="text-xs" style={{ color: C.textMuted, marginTop: 2 }}>{a.note}</div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0" style={{ marginLeft: 16 }}>
                <span className="text-xs" style={{ color: C.textMuted }}>Confidence <span style={{ color: C.textSecondary, fontWeight: 600 }}>{a.confidence}%</span></span>
                <Badge tone="warning">{a.risk} risk</Badge>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Sandbox Simulation" right={!simulated && !executedOrLater ? (
        <button onClick={onSimulate} style={{ ...btnPrimary, padding: "7px 14px" }}>Simulate Fix</button>
      ) : null}>
        {simulated ? (
          <div>
            <Badge tone="accent">Predicted after rollback</Badge>
            <div className="grid grid-cols-3 gap-4" style={{ marginTop: 14 }}>
              {[
                { label: "Error Rate", from: "42%", to: "3%" },
                { label: "CPU", from: "98%", to: "54%" },
                { label: "Latency", from: "4.2s", to: "180ms" },
              ].map((m) => (
                <div key={m.label} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 6, padding: 12 }}>
                  <div className="text-xs" style={{ color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{m.label}</div>
                  <div className="flex items-center gap-2 tabular-nums" style={{ marginTop: 6, fontSize: 16, fontWeight: 700 }}>
                    <span style={{ color: C.textMuted, fontWeight: 500 }}>{m.from}</span>
                    <ArrowRight size={13} style={{ color: C.textMuted }} />
                    <span style={{ color: C.success }}>{m.to}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs" style={{ color: C.textMuted, marginTop: 12 }}>
              Simulated in a sandbox environment — not yet applied to production.
            </div>
          </div>
        ) : (
          <div className="text-sm" style={{ color: C.textMuted }}>Run a sandbox simulation to preview the predicted effect of this rollback before it is applied.</div>
        )}
      </Panel>

      {simulated && (
        <Panel title="Safety Gate">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3" style={{ marginBottom: approvalStage || executedOrLater || rejected ? 20 : 0 }}>
            {SAFETY_CHECKS.map((c) => (
              <div key={c} className="flex items-center gap-2 text-sm" style={{ color: C.textSecondary }}>
                <CheckCircle2 size={15} style={{ color: C.success }} /> {c}
              </div>
            ))}
          </div>

          {!approvalStage && !executedOrLater && !rejected && (
            <button onClick={onRequestApproval} style={btnPrimary}>Request Approval</button>
          )}

          {approvalStage && (
            <div style={{ background: C.warningSoft, border: `1px solid ${C.warningBorder}`, borderRadius: 8, padding: 16 }}>
              <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                <ShieldAlert size={16} style={{ color: C.warning }} />
                <span className="text-sm" style={{ color: C.warning, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>Approval Required</span>
              </div>
              <div className="text-sm" style={{ color: C.textSecondary, marginBottom: 14 }}>Rollback affects production traffic.</div>
              <div className="flex gap-3">
                <button onClick={onApprove} style={{ ...btnGhost, borderColor: C.warningBorder, color: C.text }}>
                  <ShieldCheck size={14} /> Approve Rollback
                </button>
                <button onClick={onReject} style={btnDanger}>
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          )}

          {rejected && (
            <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
              <div className="text-sm" style={{ color: C.text, fontWeight: 600, marginBottom: 4 }}>Rollback rejected</div>
              <div className="text-sm" style={{ color: C.textMuted, marginBottom: 12 }}>The incident remains open. You can request approval again when ready.</div>
              <button onClick={onRequestApproval} style={btnGhost}>Request Approval Again</button>
            </div>
          )}

          {executedOrLater && (
            <div className="flex items-center gap-2 text-sm" style={{ color: C.success, fontWeight: 600 }}>
              <CheckCircle2 size={15} /> Rollback approved — see Recovery for execution status.
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}

/* =============================================================================
   RECOVERY / EXECUTION
============================================================================= */
function Recovery({ stage, execStep }) {
  if (STAGE_RANK[stage] < STAGE_RANK.executing) {
    return <div style={{ padding: 24 }}><Pending title="Awaiting approval" message="Recovery begins once the rollback is approved on the Remediation screen." icon={Clock} /></div>;
  }
  const steps = ["Approval confirmed", "Traffic shifting", "Rollback", "Health checks", "Verification"];
  const resolved = stage === "resolved";
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18, maxWidth: 760 }}>
      <div>
        <div className="text-xl" style={{ fontWeight: 700, color: C.text }}>Execution &amp; Recovery</div>
        <div className="text-sm" style={{ color: C.textMuted, marginTop: 2 }}>INC-1042 · Rollback payment-service v1.8 → v1.7</div>
      </div>

      <Panel title="Execution Progress">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {steps.map((s, i) => {
            const n = i + 1;
            const done = execStep >= n || resolved;
            const inProgress = execStep === n - 1 && !done && stage === "executing";
            return (
              <div key={s} className="flex items-center gap-3">
                {done ? (
                  <CheckCircle2 size={17} style={{ color: C.success }} />
                ) : inProgress ? (
                  <Loader2 size={17} className="animate-spin" style={{ color: C.accent }} />
                ) : (
                  <Circle size={17} style={{ color: C.textMuted }} />
                )}
                <span className="text-sm" style={{ color: done ? C.text : C.textMuted, fontWeight: done ? 600 : 500 }}>{s}</span>
              </div>
            );
          })}
        </div>
      </Panel>

      {resolved && (
        <>
          <div style={{ background: C.successSoft, border: `1px solid ${C.successBorder}`, borderRadius: 8, padding: 20 }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
              <ShieldCheck size={18} style={{ color: C.success }} />
              <span className="text-base" style={{ color: C.success, fontWeight: 800, letterSpacing: "0.02em" }}>INCIDENT RESOLVED</span>
            </div>
            <div className="text-sm" style={{ color: C.textSecondary }}>Recovery verified</div>
          </div>

          <Panel title="Before vs After">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "CPU", from: "98%", to: "54%" },
                { label: "Error Rate", from: "42%", to: "3%" },
                { label: "Latency", from: "4.2s", to: "180ms" },
              ].map((m) => (
                <div key={m.label} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 6, padding: 12 }}>
                  <div className="text-xs" style={{ color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{m.label}</div>
                  <div className="flex items-center gap-2 tabular-nums" style={{ marginTop: 6, fontSize: 16, fontWeight: 700 }}>
                    <span style={{ color: C.textMuted, fontWeight: 500 }}>{m.from}</span>
                    <ArrowRight size={13} style={{ color: C.textMuted }} />
                    <span style={{ color: C.success }}>{m.to}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div><span style={{ color: C.textMuted }}>Duration</span><div style={{ color: C.text, fontWeight: 600, marginTop: 2 }}>11m 24s</div></div>
              <div><span style={{ color: C.textMuted }}>Verification</span><div style={{ marginTop: 2 }}><Badge tone="success">Passed</Badge></div></div>
              <div><span style={{ color: C.textMuted }}>Root Cause</span><div style={{ color: C.text, fontWeight: 600, marginTop: 2 }}>Database query regression</div></div>
              <div><span style={{ color: C.textMuted }}>Remediation</span><div style={{ color: C.text, fontWeight: 600, marginTop: 2, fontFamily: MONO }}>Rollback v1.8 → v1.7</div></div>
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}

/* =============================================================================
   TIMELINE
============================================================================= */
function typeColor(type) {
  if (type === "critical") return C.critical;
  if (type === "resolved") return C.success;
  if (type === "approve" || type === "signal") return C.warning;
  return C.accent;
}
function TimelinePage() {
  return (
    <div style={{ padding: 24, maxWidth: 640 }}>
      <div className="text-xl" style={{ fontWeight: 700, color: C.text, marginBottom: 2 }}>Incident Timeline</div>
      <div className="text-sm" style={{ color: C.textMuted, marginBottom: 20 }}>INC-1042 · Payment Service Degradation</div>
      <div>
        {TIMELINE.map((t, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span style={{ width: 9, height: 9, borderRadius: 999, background: typeColor(t.type), flexShrink: 0, marginTop: 4 }} />
              {i < TIMELINE.length - 1 && <div style={{ width: 1, flex: 1, background: C.border, minHeight: 26 }} />}
            </div>
            <div style={{ paddingBottom: 18 }}>
              <span className="text-xs" style={{ color: C.textMuted, fontFamily: MONO }}>{t.time}</span>
              <div className="text-sm" style={{ color: C.text, fontWeight: 600, marginTop: 2 }}>{t.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =============================================================================
   ACTION LOG
============================================================================= */
function ActionLogPage({ stage }) {
  const rows = [...ACTION_LOG_BASE, ...(STAGE_RANK[stage] >= STAGE_RANK.executing ? ACTION_LOG_APPROVAL : [])];
  return (
    <div style={{ padding: 24 }}>
      <div className="text-xl" style={{ fontWeight: 700, color: C.text, marginBottom: 2 }}>Action Log</div>
      <div className="text-sm" style={{ color: C.textMuted, marginBottom: 18 }}>Autonomous ≠ uncontrolled — every action is recorded and auditable.</div>
      <Panel padded={false}>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Timestamp", "Actor", "Action", "Approval", "Result"].map((h) => (
                <th key={h} className="text-xs" style={{ textAlign: "left", padding: "10px 18px", color: C.textMuted, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "11px 18px", color: C.textMuted, fontFamily: MONO }}>{r.time}</td>
                <td style={{ padding: "11px 18px", color: C.text, fontWeight: 600 }}>{r.actor}</td>
                <td style={{ padding: "11px 18px", color: C.textSecondary }}>{r.action}</td>
                <td style={{ padding: "11px 18px" }}>
                  <Badge tone={r.approval === "Approved" ? "accent" : "neutral"}>{r.approval}</Badge>
                </td>
                <td style={{ padding: "11px 18px" }}>
                  <span className="flex items-center gap-1.5" style={{ color: C.success, fontWeight: 600 }}>
                    <CheckCircle2 size={13} /> {r.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

/* =============================================================================
   SERVICES + SETTINGS
============================================================================= */
function ServicesPage({ stage }) {
  const resolved = stage === "resolved";
  const paymentRow = resolved
    ? { id: "payment-service", status: "healthy", cpu: 54, error: 3, latency: 180, version: "v1.7" }
    : { id: "payment-service", status: "critical", cpu: 98, error: 42, latency: 4200, version: "v1.8" };
  const services = [paymentRow, ...SERVICES_STATIC];
  return (
    <div style={{ padding: 24 }}>
      <div className="text-xl" style={{ fontWeight: 700, color: C.text, marginBottom: 2 }}>Services</div>
      <div className="text-sm" style={{ color: C.textMuted, marginBottom: 18 }}>4 services · Production</div>
      <div className="grid grid-cols-2 gap-4">
        {services.map((s) => (
          <Panel key={s.id}>
            <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
              <div className="text-sm" style={{ color: C.text, fontWeight: 700 }}>{s.id}</div>
              <span className="flex items-center gap-2 text-xs" style={{ color: statusColor(s.status), fontWeight: 600, textTransform: "uppercase" }}>
                <StatusDot status={s.status} pulse={s.status === "critical"} /> {s.status}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <Metric label="CPU" value={s.cpu + "%"} />
              <Metric label="Error" value={s.error + "%"} />
              <Metric label="Latency" value={s.latency >= 1000 ? (s.latency / 1000).toFixed(1) + "s" : s.latency + "ms"} />
              <Metric label="Version" value={s.version} />
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

function SettingsPage() {
  const [approvalRequired, setApprovalRequired] = useState(true);
  return (
    <div style={{ padding: 24, maxWidth: 560 }}>
      <div className="text-xl" style={{ fontWeight: 700, color: C.text, marginBottom: 18 }}>Settings</div>
      <Panel title="Environment" >
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: C.textSecondary }}>Active environment</span>
          <Badge tone="accent">Production</Badge>
        </div>
      </Panel>
      <div style={{ height: 14 }} />
      <Panel title="Safety Policy">
        <div className="flex items-center justify-between text-sm" style={{ marginBottom: 14 }}>
          <div>
            <div style={{ color: C.text, fontWeight: 600 }}>Require approval for high-impact actions</div>
            <div className="text-xs" style={{ color: C.textMuted, marginTop: 2 }}>Rollbacks, scaling, and config changes require human sign-off.</div>
          </div>
          <button
            onClick={() => setApprovalRequired((v) => !v)}
            style={{ width: 40, height: 22, borderRadius: 999, background: approvalRequired ? C.accent : C.surface2, border: `1px solid ${approvalRequired ? C.accentBorder : C.border}`, position: "relative", cursor: "pointer", flexShrink: 0 }}
          >
            <span style={{ position: "absolute", top: 2, left: approvalRequired ? 20 : 2, width: 16, height: 16, borderRadius: 999, background: "#fff", transition: "left 0.15s ease" }} />
          </button>
        </div>
        <div className="text-sm" style={{ color: C.textSecondary }}>Confidence threshold for autonomous suggestions: <span style={{ color: C.text, fontWeight: 600 }}>80%</span></div>
      </Panel>
    </div>
  );
}

/* =============================================================================
   APP
============================================================================= */
export default function CloudDoctorApp() {
  const [page, setPage] = useState("overview");
  const [stage, setStage] = useState("investigating");
  const [execStep, setExecStep] = useState(0);
  const [demoRunning, setDemoRunning] = useState(false);

  useEffect(() => {
    if (stage !== "executing") {
      if (stage !== "resolved") setExecStep(0);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setExecStep(Math.min(i, 5));
      if (i >= 5) clearInterval(id);
    }, 480);
    return () => clearInterval(id);
  }, [stage]);

  useEffect(() => {
    if (stage === "executing" && execStep >= 5 && !demoRunning) {
      const t = setTimeout(() => setStage("resolved"), 500);
      return () => clearTimeout(t);
    }
  }, [execStep, stage, demoRunning]);

  function openInvestigation() {
    setPage("investigation");
    setStage((s) => (s === "healthy" || s === "detected" ? "investigating" : s));
  }
  function viewRootCause() { setStage("diagnosed"); setPage("rootcause"); }
  function viewRemediation() { setStage("remediation"); setPage("remediation"); }
  function simulateFix() { setStage("simulated"); }
  function requestApproval() { setStage("approval"); }
  function approveRollback() { setExecStep(0); setStage("executing"); setPage("recovery"); }
  function rejectRollback() { setStage("rejected"); }

  function runDemo() {
    if (demoRunning) return;
    setDemoRunning(true);
    const seq = [
      { stage: "healthy", page: "overview", delay: 1500 },
      { stage: "detected", page: "overview", delay: 1700 },
      { stage: "investigating", page: "investigation", delay: 2600 },
      { stage: "diagnosed", page: "rootcause", delay: 2400 },
      { stage: "remediation", page: "remediation", delay: 1700 },
      { stage: "simulated", page: "remediation", delay: 1900 },
      { stage: "approval", page: "remediation", delay: 2000 },
      { stage: "executing", page: "recovery", delay: 3000 },
      { stage: "resolved", page: "recovery", delay: 0 },
    ];
    let t = 0;
    seq.forEach((step, i) => {
      setTimeout(() => {
        setStage(step.stage);
        setPage(step.page);
        if (step.stage === "executing") setExecStep(0);
        if (i === seq.length - 1) setDemoRunning(false);
      }, t);
      t += step.delay;
    });
  }

  return (
    <div className="flex" style={{ height: "100vh", width: "100%", background: C.bg, color: C.text, fontFamily: FONT, overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        table { font-variant-numeric: tabular-nums; }
      `}</style>
      <Sidebar page={page} setPage={setPage} />
      <div className="flex flex-col flex-1" style={{ minWidth: 0 }}>
        <TopBar page={page} stage={stage} onDemo={runDemo} demoRunning={demoRunning} />
        <div className="flex-1" style={{ overflowY: "auto" }}>
          {page === "overview" && <Overview stage={stage} onOpenIncident={openInvestigation} />}
          {page === "incidents" && <IncidentsList stage={stage} onOpenIncident={openInvestigation} />}
          {page === "investigation" && <Investigation stage={stage} onViewRootCause={viewRootCause} />}
          {page === "rootcause" && <RootCause stage={stage} onViewRemediation={viewRemediation} />}
          {page === "remediation" && (
            <Remediation
              stage={stage}
              onSimulate={simulateFix}
              onRequestApproval={requestApproval}
              onApprove={approveRollback}
              onReject={rejectRollback}
            />
          )}
          {page === "recovery" && <Recovery stage={stage} execStep={execStep} />}
          {page === "timeline" && <TimelinePage />}
          {page === "actionlog" && <ActionLogPage stage={stage} />}
          {page === "services" && <ServicesPage stage={stage} />}
          {page === "settings" && <SettingsPage />}
        </div>
      </div>
    </div>
  );
}
