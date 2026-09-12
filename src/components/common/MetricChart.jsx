import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import Panel from "./Panel";
import { useTheme } from "../../context/ThemeContext";
import { MONO } from "../../styles/theme";
import { TIME_POINTS, DEPLOY_IDX, INCIDENT_IDX } from "../../data/mockData";

function ChartTooltip({ active, payload, label, unit, theme }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: theme.surface,
        border: `1px solid ${theme.borderStrong}`,
        borderRadius: 8,
        padding: "8px 12px",
        boxShadow: theme.shadowCard,
        backdropFilter: "blur(6px)",
      }}
    >
      <div className="text-xs" style={{ color: theme.textMuted, fontFamily: MONO }}>
        {label}
      </div>
      <div
        className="tabular-nums text-sm font-bold"
        style={{ color: theme.text, fontFamily: MONO, marginTop: 2 }}
      >
        {payload[0].value !== null ? `${payload[0].value}${unit}` : "—"}
      </div>
    </div>
  );
}

export default function MetricChart({ title, data, unit, color, cutoffIdx, height = 150 }) {
  const { theme } = useTheme();
  const trimmed = data.map((d, i) => (i <= cutoffIdx ? d : { ...d, v: null }));

  return (
    <Panel title={title} padded={false}>
      <div style={{ padding: "14px 16px 8px" }}>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={trimmed} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid stroke={theme.chartGrid} strokeDasharray="3 5" vertical={false} />
            <XAxis
              dataKey="t"
              stroke={theme.textMuted}
              tick={{ fontSize: 10, fill: theme.textMuted }}
              tickLine={false}
              axisLine={{ stroke: theme.border }}
              minTickGap={24}
            />
            <YAxis
              stroke={theme.textMuted}
              tick={{ fontSize: 10, fill: theme.textMuted }}
              tickLine={false}
              axisLine={false}
              width={34}
            />
            <Tooltip content={<ChartTooltip unit={unit} theme={theme} />} />
            <ReferenceLine
              x={TIME_POINTS[DEPLOY_IDX]}
              stroke={theme.accent}
              strokeDasharray="4 3"
              label={{
                value: "v1.8",
                fill: theme.accent,
                fontSize: 10,
                position: "insideTopLeft",
                fontWeight: 600,
              }}
            />
            <ReferenceLine
              x={TIME_POINTS[INCIDENT_IDX]}
              stroke={theme.critical}
              strokeDasharray="4 3"
              label={{
                value: "Incident",
                fill: theme.critical,
                fontSize: 10,
                position: "insideTopRight",
                fontWeight: 600,
              }}
            />
            <Line
              type="monotone"
              dataKey="v"
              stroke={color || theme.accent}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={true}
              animationDuration={800}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
