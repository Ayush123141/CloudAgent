import {
  Activity, AlertTriangle, Database, FileText, GitBranch, Layers, LayoutGrid,
  ListChecks, Search, Server, Settings as SettingsIcon, ShieldCheck,
  TrendingUp, FlaskConical, Boxes, History, CheckCircle2, Cpu, HardDrive
} from "lucide-react";

export const TIME_POINTS = ["10:00","10:03","10:06","10:09","10:12","10:15","10:18","10:20","10:22","10:24","10:26","10:28","10:29","10:31","10:33","10:36","10:39","10:42","10:45","10:48","10:50"];
export const CPU_SERIES     = [44,46,45,45,46,45,45,52,75,98,98,98,85,58,54,54,54,54,54,54,54];
export const MEMORY_SERIES  = [58,59,58,58,59,58,58,64,82,94,95,94,86,65,60,60,60,60,60,60,60];
export const ERROR_SERIES   = [1.1,1.3,1.2,1.2,1.3,1.2,1.2,2,18,42,42,42,25,5,3,3,3,3,3,3,3];
export const LATENCY_SERIES = [118,122,120,119,121,120,120,300,1800,4200,4200,4200,2500,300,180,180,180,180,180,180,180];
export const DEPLOY_IDX = 6;   // 10:18
export const INCIDENT_IDX = 9; // 10:24

export const SERVICES_STATIC = [
  { id: "order-service", status: "healthy", cpu: 42, memory: 54, error: 0.8, latency: 132, version: "v2.4" },
  { id: "user-service", status: "healthy", cpu: 38, memory: 48, error: 0.4, latency: 98, version: "v3.1" },
  { id: "notification-service", status: "warning", cpu: 67, memory: 72, error: 3.2, latency: 410, version: "v1.9" },
];

export const EVIDENCE_SOURCES = [
  {
    name: "Metrics",
    detail: "142 signals collected",
    time: "10:24:31",
    icon: Activity,
    snippet: "CPU Saturation: 98.4% | P99 Latency: 4.21s | Throughput: 2,400 req/s with 42% 504 Gateway Timeouts"
  },
  {
    name: "Logs",
    detail: "1,284 events collected",
    time: "10:24:47",
    icon: FileText,
    snippet: "[ERROR] HikariCP pool exhausted: 150/150 connections in use. 142 threads waiting for connection lease."
  },
  {
    name: "Traces",
    detail: "96 spans collected",
    time: "10:24:52",
    icon: Layers,
    snippet: "TraceID: 4a9f-81c2-90 | Root: HTTP POST /v1/checkout | DB Query Span: 3,840ms (91% of total span duration)"
  },
  {
    name: "Deployment History",
    detail: "v1.8 detected",
    time: "10:24:47",
    icon: Boxes,
    snippet: "Deployment ID: dep-89412 | Image: payment-service:v1.8 | Commit: 9f4a1c2 | Triggered by: release-pipeline"
  },
  {
    name: "Git Changes",
    detail: "7 files changed",
    time: "10:25:02",
    icon: GitBranch,
    snippet: "Commit 9f4a1c2: refactored order lookup SQL query. Dropped index hint: /*! USE INDEX (idx_tx_account_status_created) */"
  },
  {
    name: "Dependency Health",
    detail: "Database anomaly found",
    time: "10:25:19",
    icon: Database,
    snippet: "PostgreSQL Primary Node (db-cluster-01): Query execution time spiked from 40ms to 640ms; active locks = 184"
  },
];

export const INVESTIGATION_FEED = [
  { time: "10:24:12", title: "Incident detected", detail: "CPU threshold (>90%) exceeded on payment-service", ref: "Metrics", icon: AlertTriangle },
  { time: "10:24:18", title: "Correlating metrics", detail: "Error rate increased 31% directly following v1.8 deployment", ref: "Metrics", icon: TrendingUp },
  { time: "10:24:31", title: "Analyzing logs", detail: "Detected timeout + retry cascade in connection pool logs", ref: "Logs", icon: FileText },
  { time: "10:24:47", title: "Inspecting deployment", detail: "payment-service v1.8 deployed 2m before incident onset", ref: "Deployment", icon: Boxes },
  { time: "10:25:02", title: "Analyzing code changes", detail: "Database query modified in commit 9f4a1c2 (index hint removed)", ref: "Git", icon: GitBranch },
  { time: "10:25:19", title: "Correlating dependency health", detail: "Database query latency increased 4.1× on transaction tables", ref: "Dependencies", icon: Database },
  { time: "10:25:32", title: "RCA generated", detail: "Root cause identified: SQL index hint omission with 89% confidence", ref: "RCA Engine", icon: ShieldCheck },
];

export const EVIDENCE_CHAIN = [
  "Deployment v1.8 Applied",
  "Database Query Index Hint Removed",
  "Database Query Latency Spikes 4.1x",
  "Downstream 1.5s Client Timeouts",
  "Exponential Retries Flood Connection Pool",
  "CPU Saturates at 98%",
  "Client Error Rate Reaches 42%",
];

export const EVIDENCE_CHAIN_DETAIL = [
  "payment-service v1.8 deployed at 10:18, two minutes before latency degradation started.",
  "Git diff shows the order-lookup query in commit 9f4a1c2 dropped the index hint used in v1.7.",
  "Median query latency to the primary database rose from 40ms to 640ms within 4 minutes under load.",
  "Downstream client checkout calls began exceeding their 1.5s timeout budget as queries queued.",
  "The service's aggressive retry policy re-issued failed requests, compounding database starvation.",
  "Compute saturated at 98% as retries and slow queries queued faster than threads could drain.",
  "Client-facing requests began failing with 504 Gateway Timeouts as thread pool saturated.",
];

export const SUPPORTING_EVIDENCE = [
  { source: "Deployment", finding: "v1.8 deployed 2m before incident onset", relevance: 92, icon: Boxes },
  { source: "Logs", finding: "Timeout/retry error cascade increased 8.4×", relevance: 88, icon: FileText },
  { source: "Database", finding: "Query execution latency increased 3.7×", relevance: 90, icon: Database },
  { source: "Metrics", finding: "CPU spike precisely mirrors database latency spike", relevance: 81, icon: Activity },
  { source: "Git", finding: "Query optimization hint removed in commit 9f4a1c2", relevance: 85, icon: GitBranch },
];

export const ALTERNATIVES = [
  { action: "Scale payment-service horizontally (3 -> 12 pods)", risk: "Medium", confidence: 61, note: "Adds compute capacity but does not address the underlying database query regression and may overload the database further." },
  { action: "Restart all affected payment-service pods", risk: "Medium", confidence: 44, note: "Provides transient 60-second relief; incident immediately recurs once query concurrency returns." },
];

export const SAFETY_CHECKS = [
  "Rollback artifact available (v1.7 verified)",
  "Digital twin sandbox simulation passed (93% recovery)",
  "Confidence threshold met (89% > 80% policy requirement)",
  "No destructive schema mutations in v1.8",
  "Previous release v1.7 certified stable for 14 days",
];

export const TIMELINE = [
  { time: "10:18", label: "Deployment v1.8 applied to production", type: "deploy" },
  { time: "10:20", label: "Database query latency begins rising (40ms -> 640ms)", type: "signal" },
  { time: "10:24", label: "Incident INC-1042 detected by CloudDoctor", type: "critical" },
  { time: "10:24", label: "CPU reaches 98% saturation; Error rate hits 42%", type: "critical" },
  { time: "10:25", label: "CloudDoctor autonomous multi-modal investigation begins", type: "investigate" },
  { time: "10:25", label: "Root cause diagnosed: Missing SQL index hint (89% confidence)", type: "diagnose" },
  { time: "10:26", label: "Remediation recommended: Rollback to v1.7", type: "remediate" },
  { time: "10:27", label: "Digital twin sandbox simulation confirms 93% recovery", type: "simulate" },
  { time: "10:28", label: "SRE engineer grants human-in-the-loop approval", type: "approve" },
  { time: "10:29", label: "Canary rollback executed to v1.7", type: "execute" },
  { time: "10:31", label: "Telemetry recovery verified; all SLAs restored", type: "resolved" },
];

export const ACTION_LOG_BASE = [
  { time: "10:24", actor: "CloudDoctor", action: "Create incident INC-1042", approval: "Automatic", result: "Success" },
  { time: "10:25", actor: "CloudDoctor", action: "Generate multi-modal root cause analysis", approval: "Automatic", result: "Success" },
  { time: "10:26", actor: "CloudDoctor", action: "Execute digital twin sandbox simulation", approval: "Automatic", result: "Passed" },
];

export const ACTION_LOG_APPROVAL = [
  { time: "10:28", actor: "SRE Engineer", action: "Approve rollback payment-service v1.8 → v1.7", approval: "Approved", result: "Success" },
  { time: "10:29", actor: "CloudDoctor", action: "Execute automated rollback sequence", approval: "Approved", result: "Success" },
  { time: "10:31", actor: "CloudDoctor", action: "Verify telemetry baseline recovery", approval: "Automatic", result: "Passed" },
];

export const STAGE_STEPS = [
  { key: "detected", label: "Detected" },
  { key: "investigating", label: "Investigating" },
  { key: "diagnosed", label: "Diagnosed" },
  { key: "remediation", label: "Remediation & Simulation" },
  { key: "executing", label: "Executing" },
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
    { id: "investigation", label: "Investigation", icon: Search },
    { id: "rootcause", label: "Root Cause", icon: ShieldCheck },
    { id: "remediation", label: "Remediation & Simulation", icon: FlaskConical },
    { id: "recovery", label: "Recovery", icon: CheckCircle2 },
  ],
  [
    { id: "services", label: "Services Fleet", icon: Server },
    { id: "timeline", label: "Timeline", icon: History },
    { id: "actionlog", label: "Action Logs", icon: ListChecks },
  ],
  [{ id: "settings", label: "Settings & Safety", icon: SettingsIcon }],
];

export const BREADCRUMBS = {
  overview: "Operations / Overview",
  incidents: "Operations / Incidents",
  investigation: "Incident INC-1042 / Autonomous Investigation",
  rootcause: "Incident INC-1042 / Root Cause Analysis",
  remediation: "Incident INC-1042 / Remediation & Simulation",
  recovery: "Incident INC-1042 / Execution & Recovery",
  timeline: "Operations / Timeline",
  actionlog: "Operations / Action Logs",
  services: "Operations / Microservices Fleet",
  settings: "System & Safety Settings",
};
