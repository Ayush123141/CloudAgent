import React from "react";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import Badge from "../common/Badge";
import Panel from "../common/Panel";
import {
  ACTION_LOG_BASE, ACTION_LOG_APPROVAL, STAGE_RANK
} from "../../data/mockData";
import { MONO } from "../../styles/theme";

export default function ActionLogPage({ stage }) {
  const { theme } = useTheme();
  const rows = [
    ...ACTION_LOG_BASE,
    ...(STAGE_RANK[stage] >= STAGE_RANK.executing ? ACTION_LOG_APPROVAL : []),
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
          Audit Action Log
        </h1>
        <div className="text-sm font-medium" style={{ color: theme.textMuted, marginTop: 2 }}>
          Autonomous ≠ uncontrolled — immutable cryptographic audit trail of all AI agent decisions
        </div>
      </div>

      <Panel padded={false}>
        <div style={{ overflowX: "auto" }}>
          <table className="w-full text-sm" style={{ borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border}`, background: theme.surface2 }}>
                {["Timestamp", "Actor", "Action", "Governance Approval", "Result"].map((h) => (
                  <th
                    key={h}
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ padding: "12px 18px", color: theme.textMuted, fontSize: 11 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: `1px solid ${theme.border}`,
                    transition: "background-color 0.15s ease",
                  }}
                >
                  <td style={{ padding: "13px 18px", color: theme.textMuted, fontFamily: MONO, fontSize: 12 }}>
                    {r.time}
                  </td>
                  <td style={{ padding: "13px 18px", color: theme.text, fontWeight: 700 }}>
                    {r.actor}
                  </td>
                  <td style={{ padding: "13px 18px", color: theme.textSecondary, fontWeight: 500 }}>
                    {r.action}
                  </td>
                  <td style={{ padding: "13px 18px" }}>
                    <Badge tone={r.approval === "Approved" ? "accent" : "neutral"}>
                      {r.approval}
                    </Badge>
                  </td>
                  <td style={{ padding: "13px 18px" }}>
                    <span className="inline-flex items-center gap-1.5 font-bold text-xs" style={{ color: theme.success }}>
                      <CheckCircle2 size={14} /> {r.result}
                    </span>
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
