import React, { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import StatusDot from "../common/StatusDot";
import Badge from "../common/Badge";
import Panel from "../common/Panel";
import KpiCard from "../common/KpiCard";
import Metric from "../common/Metric";
import MetricChart from "../common/MetricChart";
import { getStatusColor, MONO } from "../../styles/theme";
import {
  TIME_POINTS, CPU_SERIES, ERROR_SERIES, LATENCY_SERIES,
  SERVICES_STATIC, chartCutoff
} from "../../data/mockData";

export default function Overview({ stage, onOpenIncident }) {
  const { theme } = useTheme();
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
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3 }}
      style={{ padding: 28, display: "flex", flexDirection: "column", gap: 22, maxWidth: 1400, margin: "0 auto" }}
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: theme.text }}>
            Operations Overview
          </h1>
          <div className="text-sm font-medium" style={{ color: theme.textMuted, marginTop: 2 }}>
            Real-time observability & autonomous incident diagnosis
          </div>
        </div>
        <div
          className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full"
          style={{
            background: active ? theme.criticalSoft : theme.successSoft,
            border: `1px solid ${active ? theme.criticalBorder : theme.successBorder}`,
            color: active ? theme.critical : theme.success,
          }}
        >
          <StatusDot status={active ? "critical" : "healthy"} pulse={active} />
          {active ? "Degraded — 1 active incident" : "Operational — all systems normal"}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <KpiCard label="System Health" value={active ? "84.6%" : "99.8%"} tone={active ? theme.warning : theme.success} />
        <KpiCard label="Active Incidents" value={active ? "1" : "0"} tone={active ? theme.critical : theme.success} />
        <KpiCard label="Critical Services" value={active ? "1" : "0"} tone={active ? theme.critical : theme.success} />
        <KpiCard label="Target MTTR" value="15m" />
        <KpiCard label="AI Confidence" value={stage === "healthy" || stage === "detected" ? "—" : "89%"} tone={theme.accent} />
      </div>

      {/* Active Incident Banner */}
      {active ? (
        <motion.div
          layout
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderLeft: `4px solid ${theme.critical}`,
            borderRadius: 10,
            padding: 22,
            boxShadow: theme.shadowCard,
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <Badge tone="critical">Critical Incident</Badge>
                <span className="text-xs font-mono font-semibold" style={{ color: theme.textMuted, fontFamily: MONO }}>
                  INC-1042
                </span>
              </div>
              <div className="text-xl font-bold" style={{ color: theme.text }}>
                Payment Service Degradation
              </div>
              <div className="text-xs" style={{ color: theme.textMuted, marginTop: 4 }}>
                payment-service · Production (us-east-1) · Started 10:24 AM · Duration 08m 42s
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenIncident}
              className="text-sm font-bold inline-flex items-center gap-2 cursor-pointer self-start"
              style={{
                background: theme.accent,
                color: "#FFFFFF",
                border: "none",
                borderRadius: 6,
                padding: "10px 18px",
                boxShadow: `0 2px 10px ${theme.accent}40`,
              }}
            >
              Open Autonomous Investigation <ArrowRight size={15} />
            </motion.button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-5 mt-4" style={{ borderTop: `1px solid ${theme.border}` }}>
            <Metric label="CPU Saturation" value="98%" direction="up" tone={theme.critical} />
            <Metric label="Error Rate" value="42%" direction="up" tone={theme.critical} />
            <Metric label="P99 Latency" value="4.2s" direction="up" tone={theme.critical} />
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold" style={{ color: theme.textMuted, fontSize: 11 }}>
                Agent Status
              </div>
              <div className="text-sm font-bold mt-1" style={{ color: theme.accent }}>
                {stage === "detected"
                  ? "Detected"
                  : stage === "investigating"
                  ? "Investigating..."
                  : stage === "diagnosed"
                  ? "Root Cause Diagnosed"
                  : "Remediation In Progress"}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          layout
          style={{
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderLeft: `4px solid ${theme.success}`,
            borderRadius: 10,
            padding: 20,
            boxShadow: theme.shadowCard,
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Badge tone="success">Resolved</Badge>
            <span className="text-xs font-mono font-semibold" style={{ color: theme.textMuted, fontFamily: MONO }}>
              INC-1042
            </span>
          </div>
          <div className="text-base font-bold" style={{ color: theme.text }}>
            Payment Service Degradation — recovery verified
          </div>
          <div className="text-xs" style={{ color: theme.textMuted, marginTop: 4 }}>
            Rolled back payment-service v1.8 → v1.7 · Resolved in 11m 24s · Production healthy
          </div>
        </motion.div>
      )}

      {/* Service Health Table */}
      <Panel title="Service Fleet Status" padded={false}>
        <div style={{ overflowX: "auto" }}>
          <table className="w-full text-sm" style={{ borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border}`, background: theme.surface2 }}>
                {["Service", "Status", "CPU", "Error Rate", "Latency", "Version"].map((h) => (
                  <th key={h} className="text-xs font-bold uppercase tracking-wider" style={{ padding: "12px 18px", color: theme.textMuted, fontSize: 11 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr
                  key={s.id}
                  style={{
                    borderBottom: `1px solid ${theme.border}`,
                    transition: "background-color 0.15s ease",
                  }}
                  className="hover:bg-opacity-50"
                >
                  <td style={{ padding: "13px 18px", color: theme.text, fontWeight: 700 }}>
                    {s.id}
                  </td>
                  <td style={{ padding: "13px 18px" }}>
                    <span
                      className="inline-flex items-center gap-2 font-bold capitalize text-xs"
                      style={{ color: getStatusColor(s.status, theme) }}
                    >
                      <StatusDot status={s.status} /> {s.status}
                    </span>
                  </td>
                  <td className="tabular-nums font-semibold" style={{ padding: "13px 18px", color: theme.textSecondary }}>
                    {s.cpu}%
                  </td>
                  <td className="tabular-nums font-semibold" style={{ padding: "13px 18px", color: theme.textSecondary }}>
                    {s.error}%
                  </td>
                  <td className="tabular-nums font-semibold" style={{ padding: "13px 18px", color: theme.textSecondary }}>
                    {s.latency >= 1000 ? (s.latency / 1000).toFixed(1) + "s" : s.latency + "ms"}
                  </td>
                  <td style={{ padding: "13px 18px", color: theme.textMuted, fontFamily: MONO, fontSize: 12 }}>
                    {s.version}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Observability Telemetry Charts */}
      <div>
        <div className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: theme.textMuted, fontSize: 11 }}>
          Live Telemetry Correlator
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricChart title="Error Rate (%)" data={errData} unit="%" color={theme.critical} cutoffIdx={cutoff} />
          <MetricChart title="CPU Saturation (%)" data={cpuData} unit="%" color={theme.accent} cutoffIdx={cutoff} />
        </div>
        <div className="mt-4">
          <MetricChart title="End-to-End Latency (ms)" data={latData} unit="ms" color={theme.warning} cutoffIdx={cutoff} height={140} />
        </div>
      </div>
    </motion.div>
  );
}
