import React from "react";
import { HeartPulse, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import StatusDot from "../common/StatusDot";
import { NAV_GROUPS } from "../../data/mockData";

export default function Sidebar({ page, setPage }) {
  const { theme } = useTheme();

  return (
    <div
      className="flex flex-col z-10"
      style={{
        width: 230,
        flexShrink: 0,
        background: theme.surface,
        borderRight: `1px solid ${theme.border}`,
        height: "100%",
        transition: "background-color 0.25s ease, border-color 0.25s ease",
      }}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-2.5" style={{ padding: "20px 20px 18px" }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: theme.accentSoft,
            border: `1px solid ${theme.accentBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 12px ${theme.accent}30`,
          }}
        >
          <HeartPulse size={16} style={{ color: theme.accent }} />
        </div>
        <div>
          <div className="text-base font-extrabold tracking-tight" style={{ color: theme.text }}>
            Cloud<span style={{ color: theme.accent }}>Doctor</span>
          </div>
          <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: theme.textMuted, fontSize: 9 }}>
            Autonomous SRE
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1" style={{ padding: "8px 12px", overflowY: "auto" }}>
        {NAV_GROUPS.map((group, gi) => (
          <div
            key={gi}
            style={{
              marginBottom: 12,
              paddingBottom: 10,
              borderBottom: gi < NAV_GROUPS.length - 1 ? `1px solid ${theme.border}` : "none",
            }}
          >
            {group.map((item) => {
              const Icon = item.icon;
              const active = page === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPage(item.id)}
                  className="flex items-center gap-2.5 text-sm w-full relative"
                  style={{
                    padding: "9px 12px",
                    borderRadius: 8,
                    marginBottom: 3,
                    border: "none",
                    cursor: "pointer",
                    background: active ? theme.accentSoft : "transparent",
                    color: active ? theme.accent : theme.textSecondary,
                    fontWeight: active ? 700 : 500,
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Icon size={16} style={{ color: active ? theme.accent : theme.textMuted }} />
                  <span>{item.label}</span>
                  {active && (
                    <motion.div
                      layoutId="sidebarActiveIndicator"
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "20%",
                        bottom: "20%",
                        width: 3,
                        borderRadius: "0 4px 4px 0",
                        background: theme.accent,
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer / Environment info */}
      <div style={{ padding: "16px 18px", borderTop: `1px solid ${theme.border}` }}>
        <div className="flex items-center justify-between text-xs" style={{ color: theme.textSecondary, marginBottom: 8 }}>
          <span>Environment</span>
          <span className="flex items-center gap-1 font-semibold" style={{ color: theme.text }}>
            Production <ChevronDown size={12} />
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium" style={{ color: theme.textSecondary }}>
          <StatusDot status="healthy" pulse />
          Agent Operational
        </div>
      </div>
    </div>
  );
}
