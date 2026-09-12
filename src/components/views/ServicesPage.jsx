import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import StatusDot from "../common/StatusDot";
import Panel from "../common/Panel";
import Metric from "../common/Metric";
import { getStatusColor } from "../../styles/theme";
import { SERVICES_STATIC } from "../../data/mockData";

export default function ServicesPage({ stage }) {
  const { theme } = useTheme();
  const resolved = stage === "resolved";

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
      style={{ padding: 28, maxWidth: 1400, margin: "0 auto" }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight" style={{ color: theme.text }}>
          Microservices Fleet
        </h1>
        <div className="text-sm font-medium" style={{ color: theme.textMuted, marginTop: 2 }}>
          {services.length} services · Production cluster
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((s) => (
          <Panel key={s.id}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-base font-bold" style={{ color: theme.text }}>
                {s.id}
              </div>
              <span
                className="inline-flex items-center gap-2 text-xs font-bold capitalize"
                style={{ color: getStatusColor(s.status, theme) }}
              >
                <StatusDot status={s.status} pulse={s.status === "critical"} /> {s.status}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-3 pt-3" style={{ borderTop: `1px solid ${theme.border}` }}>
              <Metric label="CPU" value={`${s.cpu}%`} />
              <Metric label="Error" value={`${s.error}%`} />
              <Metric label="Latency" value={s.latency >= 1000 ? `${(s.latency / 1000).toFixed(1)}s` : `${s.latency}ms`} />
              <Metric label="Version" value={s.version} />
            </div>
          </Panel>
        ))}
      </div>
    </motion.div>
  );
}
