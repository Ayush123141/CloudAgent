export const THEMES = {
  dark: {
    name: "dark",
    bg: "#121416",
    bgGradient: "linear-gradient(180deg, #16181A 0%, #101214 100%)",
    surface: "#1A1D1F",
    surfaceHover: "#212427",
    surface2: "#222629",
    surface3: "#2B2F32",
    border: "#2F3336",
    borderStrong: "#3E4347",
    text: "#F3F4F6",
    textSecondary: "#A3ACB9",
    textMuted: "#6B7280",
    accent: "#14B8A6",
    accentHover: "#0D9488",
    accentSoft: "rgba(20, 184, 166, 0.14)",
    accentBorder: "rgba(20, 184, 166, 0.35)",
    success: "#22C55E",
    successSoft: "rgba(34, 197, 94, 0.14)",
    successBorder: "rgba(34, 197, 94, 0.35)",
    warning: "#F59E0B",
    warningSoft: "rgba(245, 158, 11, 0.14)",
    warningBorder: "rgba(245, 158, 11, 0.35)",
    critical: "#EF4444",
    criticalSoft: "rgba(239, 68, 68, 0.16)",
    criticalBorder: "rgba(239, 68, 68, 0.4)",
    chartGrid: "#272A2D",
    shadowCard: "0 4px 20px rgba(0, 0, 0, 0.4)",
    particleColor: "rgba(20, 184, 166, 0.25)",
    particleLineColor: "rgba(255, 255, 255, 0.04)",
  },
  light: {
    name: "light",
    bg: "#F8FAFC",
    bgGradient: "linear-gradient(180deg, #F8FAFC 0%, #EEF2F6 100%)",
    surface: "#FFFFFF",
    surfaceHover: "#F8FAFC",
    surface2: "#F1F5F9",
    surface3: "#E2E8F0",
    border: "#E2E8F0",
    borderStrong: "#CBD5E1",
    text: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#94A3B8",
    accent: "#0D9488",
    accentHover: "#0F766E",
    accentSoft: "rgba(13, 148, 136, 0.1)",
    accentBorder: "rgba(13, 148, 136, 0.25)",
    success: "#16A34A",
    successSoft: "rgba(22, 163, 74, 0.1)",
    successBorder: "rgba(22, 163, 74, 0.25)",
    warning: "#D97706",
    warningSoft: "rgba(217, 119, 6, 0.12)",
    warningBorder: "rgba(217, 119, 6, 0.25)",
    critical: "#DC2626",
    criticalSoft: "rgba(220, 38, 38, 0.1)",
    criticalBorder: "rgba(220, 38, 38, 0.25)",
    chartGrid: "#E2E8F0",
    shadowCard: "0 4px 16px rgba(15, 23, 42, 0.05)",
    particleColor: "rgba(13, 148, 136, 0.18)",
    particleLineColor: "rgba(15, 23, 42, 0.04)",
  },
};

export const FONT = "'Source Sans 3', ui-sans-serif, system-ui, -apple-system, sans-serif";
export const MONO = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

export function getStatusColor(status, theme) {
  if (status === "critical") return theme.critical;
  if (status === "warning") return theme.warning;
  if (status === "healthy" || status === "resolved") return theme.success;
  if (status === "info") return theme.accent;
  return theme.textMuted;
}
