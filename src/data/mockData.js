import {
  Activity, AlertTriangle, Database, FileText, GitBranch, Layers, LayoutGrid,
  ListChecks, Search, Server, Settings as SettingsIcon, ShieldCheck,
  TrendingUp, FlaskConical, Boxes, History
} from "lucide-react";

export const TIME_POINTS = ["10:00","10:03","10:06","10:09","10:12","10:15","10:18","10:20","10:22","10:24","10:26","10:28","10:29","10:31","10:33","10:36","10:39","10:42","10:45","10:48","10:50"];
export const CPU_SERIES     = [44,46,45,45,46,45,45,52,75,98,98,98,85,58,54,54,54,54,54,54,54];
export const ERROR_SERIES   = [1.1,1.3,1.2,1.2,1.3,1.2,1.2,2,18,42,42,42,25,5,3,3,3,3,3,3,3];
export const LATENCY_SERIES = [118,122,120,119,121,120,120,300,1800,4200,4200,4200,2500,300,180,180,180,180,180,180,180];
export const DEPLOY_IDX = 6;   // 10:18
export const INCIDENT_IDX = 9; // 10:24

export const SERVICES_STATIC = [
  { id: "order-service", status: "healthy", cpu: 42, error: 0.8, latency: 132, version: "v2.4" },
  { id: "user-service", status: "healthy", cpu: 38, error: 0.4, latency: 98, version: "v3.1" },
  { id: "notification-service", status: "warning", cpu: 67, error: 3.2, latency: 410, version: "v1.9" },
];

export const EVIDENCE_SOURCES = [
  { name: "Metrics", detail: "142 signals collected", time: "10:24:31", icon: Activity },
  { name: "Logs", detail: "1,284 events collected", time: "10:24:47", icon: FileText },
  { name: "Traces", detail: "96 spans collected", time: "10:24:52", icon: Layers },
  { name: "Deployment History", detail: "v1.8 detected", time: "10:24:47", icon: Boxes },
  { name: "Git Changes", detail: "7 files changed", time: "10:25:02", icon: GitBranch },
  { name: "Dependency Health", detail: "Database anomaly found", time: "10:25:19", icon: Database },
];

export const INVESTIGATION_FEED = [
  { time: "10:24:12", title: "Incident detected", detail: "CPU threshold exceeded on payment-service", ref: "Metrics", icon: AlertTriangle },
  { time: "10:24:18", title: "Correlating metrics", detail: "Error rate increased 31% after deployment", ref: "Metrics", icon: TrendingUp },
  { time: "10:24:31", title: "Analyzing logs", detail: "Detected timeout + retry pattern", ref: "Logs", icon: FileText },
  { time: "10:24:47", title: "Inspecting deployment", detail: "payment-service v1.8 deployed 2m before incident", ref: "Deployment", icon: Boxes },
  { time: "10:25:02", title: "Analyzing code changes", detail: "Database query modified in v1.8", ref: "Git", icon: GitBranch },
  { time: "10:25:19", title: "Correlating dependency health", detail: "Database latency increased 4.1×", ref: "Dependencies", icon: Database },
  { time: "10:25:32", title: "RCA generated", detail: "Root cause identified with 89% confidence", ref: "RCA Engine", icon: ShieldCheck },
];

export const EVIDENCE_CHAIN = [
  "Deployment v1.8",
  "Database query changed",
  "Database latency increased",
  "Timeouts increased",
  "Retries increased",
  "CPU reached 98%",
  "Error rate reached 42%",
];

export const EVIDENCE_CHAIN_DETAIL = [
  "payment-service v1.8 deployed at 10:18, two minutes before symptoms began.",
  "Git diff shows the order-lookup query in v1.8 dropped an index hint used in v1.7.",
  "Median query latency to the primary database rose from 40ms to 640ms within 4 minutes.",
  "Downstream calls began exceeding their 1.5s timeout budget as queries slowed.",
  "The service's retry policy re-issued failed requests, compounding load on the database.",
  "Compute saturated as retries and slow queries queued faster than they could drain.",
  "Client-facing requests began failing once CPU saturation caused request queuing.",
];

export const SUPPORTING_EVIDENCE = [
  { source: "Deployment", finding: "v1.8 deployed 2m before incident", relevance: 92, icon: Boxes },
  { source: "Logs", finding: "Timeout/retry pattern increased 8.4×", relevance: 88, icon: FileText },
  { source: "Database", finding: "Query latency increased 3.7×", relevance: 90, icon: Database },
  { source: "Metrics", finding: "CPU spike follows error-rate increase", relevance: 81, icon: Activity },
  { source: "Git", finding: "Query optimization change introduced in v1.8", relevance: 85, icon: GitBranch },
];

export const ALTERNATIVES = [
  { action: "Scale payment-service horizontally", risk: "Medium", confidence: 61, note: "Adds compute but does not address the underlying query regression." },
  { action: "Restart affected pods", risk: "Medium", confidence: 44, note: "Provides brief relief; incident recurs once query load returns." },
];

export const SAFETY_CHECKS = [
  "Rollback available",
  "Sandbox simulation passed",
  "Confidence threshold met",
  "No database mutation",
  "Previous version healthy",
];

export const TIMELINE = [
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

export const ACTION_LOG_BASE = [
  { time: "10:24", actor: "CloudDoctor", action: "Create incident INC-1042", approval: "Automatic", result: "Success" },
  { time: "10:25", actor: "CloudDoctor", action: "Generate root cause analysis", approval: "Automatic", result: "Success" },
];

export const ACTION_LOG_APPROVAL = [
  { time: "10:28", actor: "Engineer", action: "Approve rollback v1.8 → v1.7", approval: "Approved", result: "Success" },
  { time: "10:29", actor: "CloudDoctor", action: "Execute rollback v1.8 → v1.7", approval: "Approved", result: "Success" },
  { time: "10:31", actor: "CloudDoctor", action: "Verify recovery", approval: "Automatic", result: "Passed" },
];

export const STAGE_STEPS = [
  { key: "detected", label: "Detected" },
  { key: "investigating", label: "Investigating" },
  { key: "diagnosed", label: "Diagnosed" },
  { key: "remediation", label: "Remediation" },
  { key: "verifying", label: "Verifying" },
  { key: "resolved", label: "Resolved" },
];

export const STAGE_RANK = {
  healthy: 0,
  detected: 1,
  investigating: 2,
  diagnosed: 3,
  remediation: 4,
  simulated: 5,
  approval: 6,
  rejected: 6,
  executing: 7,
  resolved: 8,
};

export function stageStepIndex(stage) {
  if (stage === "healthy") return -1;
  if (stage === "detected") return 0;
  if (stage === "investigating") return 1;
  if (stage === "diagnosed") return 2;
  if (["remediation", "simulated", "approval", "rejected"].includes(stage)) return 3;
  if (stage === "executing") return 4;
  if (stage === "resolved") return 5;
  return -1;
}

export function chartCutoff(stage) {
  if (stage === "healthy") return DEPLOY_IDX;
  if (stage === "detected") return INCIDENT_IDX;
  if (stage === "executing") return 13;
  if (stage === "resolved") return TIME_POINTS.length - 1;
  return 11;
}

export const NAV_GROUPS = [
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

export const BREADCRUMBS = {
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
