import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function Metric({ label, value, direction, tone }) {
  const { theme } = useTheme();

  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.textMuted, fontSize: 11 }}>
        {label}
      </div>
      <div
        className="flex items-center gap-1.5 tabular-nums font-bold"
        style={{ fontSize: 20, color: tone || theme.text, marginTop: 4 }}
      >
        {value}
        {direction === "up" && <TrendingUp size={16} style={{ color: theme.critical }} />}
        {direction === "down" && <TrendingDown size={16} style={{ color: theme.success }} />}
      </div>
    </div>
  );
}
