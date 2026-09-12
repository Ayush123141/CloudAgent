import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { getStatusColor } from "../../styles/theme";

export default function StatusDot({ status, pulse }) {
  const { theme } = useTheme();
  const color = getStatusColor(status, theme);

  return (
    <span
      className={`relative inline-flex items-center justify-center flex-shrink-0 ${pulse ? "animate-pulse" : ""}`}
      style={{ width: 8, height: 8 }}
    >
      {pulse && (
        <span
          className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
          style={{ background: color }}
        />
      )}
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: color,
          display: "inline-block",
          boxShadow: `0 0 8px ${color}40`,
        }}
      />
    </span>
  );
}
