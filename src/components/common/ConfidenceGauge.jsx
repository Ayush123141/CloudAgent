import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function ConfidenceGauge({ value, size = 130, color }) {
  const { theme } = useTheme();
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const targetOffset = circ * (1 - value / 100);
  const strokeColor = color || theme.accent;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={theme.surface3}
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={strokeColor}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${strokeColor}40)`,
          }}
        />
      </svg>
      <div className="flex flex-col items-center justify-center absolute inset-0">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="tabular-nums font-black"
          style={{ fontSize: 32, color: theme.text, letterSpacing: "-0.02em", lineHeight: 1 }}
        >
          {value}%
        </motion.span>
        <span
          className="text-xs uppercase tracking-wider font-semibold"
          style={{ color: theme.textMuted, fontSize: 10, marginTop: 4 }}
        >
          confidence
        </span>
      </div>
    </div>
  );
}
