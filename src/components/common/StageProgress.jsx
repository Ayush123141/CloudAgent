import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { STAGE_STEPS, stageStepIndex } from "../../data/mockData";

export default function StageProgress({ stage }) {
  const { theme } = useTheme();
  const idx = stageStepIndex(stage);

  return (
    <div className="flex items-center w-full">
      {STAGE_STEPS.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        const color = active ? theme.accent : done ? theme.success : theme.textMuted;

        return (
          <React.Fragment key={s.key}>
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.span
                animate={{
                  scale: active ? [1, 1.25, 1] : 1,
                  boxShadow: active ? `0 0 10px ${color}` : "none",
                }}
                transition={{ duration: 1.5, repeat: active ? Infinity : 0 }}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  flexShrink: 0,
                  background: active || done ? color : "transparent",
                  border: `2px solid ${color}`,
                }}
              />
              <span
                className="text-xs font-semibold"
                style={{
                  color: active ? theme.text : done ? theme.success : theme.textMuted,
                  fontWeight: active ? 700 : 600,
                  whiteSpace: "nowrap",
                }}
              >
                {s.label}
              </span>
            </div>
            {i < STAGE_STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: done ? theme.success : theme.border,
                  margin: "0 12px",
                  borderRadius: 999,
                  opacity: done ? 0.8 : 0.5,
                  transition: "background 0.3s ease",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
