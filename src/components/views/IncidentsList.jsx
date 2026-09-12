import React from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import StatusDot from "../common/StatusDot";
import Panel from "../common/Panel";
import { getStatusColor, MONO } from "../../styles/theme";

export default function IncidentsList({ stage, onOpenIncident }) {
  const { theme } = useTheme();
  const resolved = stage === "resolved";

  const rows = [
    { id: "INC-1042", service: "payment-service", cause: "Bad deployment (v1.8 query regression)", status: resolved ? "resolved" : "critical", time: "10:24 AM", active: true },
    { id: "INC-1031", service: "user-service", cause: "Config drift in redis cache pool", status: "resolved", time: "08:12 AM" },
    { id: "INC-1024", service: "order-service", cause: "Downstream checkout rate spike", status: "resolved", time: "06:45 AM" },
  ];

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
          Incidents
        </h1>
        <div className="text-sm" style={{ color: theme.textMuted, marginTop: 2 }}>
          Production environment incident history & autonomous remediation log
        </div>
      </div>

      <Panel padded={false}>
        <div style={{ overflowX: "auto" }}>
          <table className="w-full text-sm" style={{ borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border}`, background: theme.surface2 }}>
                {["Incident ID", "Affected Service", "Identified Cause", "Status", "Triggered At"].map((h) => (
                  <th
                    key={h}
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ padding: "12px 18px", color: theme.textMuted, fontSize: 11 }}
                  >
                    {h}
                  </th>
                ))}
                <th style={{ padding: "12px 18px" }} />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  style={{
                    borderBottom: `1px solid ${theme.border}`,
                    transition: "background-color 0.15s ease",
                  }}
                >
                  <td style={{ padding: "14px 18px", color: theme.text, fontFamily: MONO, fontWeight: 700 }}>
                    {r.id}
                  </td>
                  <td style={{ padding: "14px 18px", color: theme.textSecondary, fontWeight: 600 }}>
                    {r.service}
                  </td>
                  <td style={{ padding: "14px 18px", color: theme.textSecondary }}>
                    {r.cause}
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <span
                      className="inline-flex items-center gap-2 font-bold capitalize text-xs"
                      style={{ color: getStatusColor(r.status, theme) }}
                    >
                      <StatusDot status={r.status} pulse={r.status === "critical"} /> {r.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 18px", color: theme.textMuted, fontFamily: MONO, fontSize: 12 }}>
                    {r.time}
                  </td>
                  <td style={{ padding: "14px 18px", textAlign: "right" }}>
                    {r.active && (
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={onOpenIncident}
                        className="text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                        style={{
                          background: theme.accentSoft,
                          border: `1px solid ${theme.accentBorder}`,
                          color: theme.accent,
                          padding: "6px 14px",
                          borderRadius: 6,
                        }}
                      >
                        Investigate <ChevronRight size={13} />
                      </motion.button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </motion.div>
  );
}
