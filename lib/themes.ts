import type { ThemeId } from "./types";

export interface PublicTheme {
  id: ThemeId;
  label: string;
  page: string;
  text: string;
  muted: string;
  button: string;
  swatch: string;
}

export const THEMES: Record<ThemeId, PublicTheme> = {
  light: {
    id: "light", label: "Paper",
    page: "bg-neutral-50",
    text: "text-neutral-900",
    muted: "text-neutral-500",
    button: "bg-white text-neutral-900 border border-neutral-200/80 shadow-card",
    swatch: "bg-neutral-50 border border-neutral-300",
  },
  dark: {
    id: "dark", label: "Night",
    page: "bg-neutral-950 bg-[radial-gradient(70%_45%_at_50%_0%,rgb(42_133_112/0.20),transparent)]",
    text: "text-neutral-50",
    muted: "text-neutral-400",
    button: "bg-white/[0.06] text-neutral-50 border border-white/10 backdrop-blur-sm",
    swatch: "bg-neutral-900 border border-neutral-700",
  },
  gray: {
    id: "gray", label: "Mist",
    page: "bg-neutral-200",
    text: "text-neutral-900",
    muted: "text-neutral-600",
    button: "bg-neutral-50 text-neutral-900 shadow-card",
    swatch: "bg-neutral-200",
  },
  gradient: {
    id: "gradient", label: "Aurora",
    page: "bg-gradient-to-b from-[#d3ebe2] via-[#e4edf5] to-[#f0e6ef]",
    text: "text-neutral-900",
    muted: "text-neutral-600",
    button: "bg-white/60 text-neutral-900 border border-white/70 shadow-card backdrop-blur-md",
    swatch: "bg-gradient-to-br from-[#d3ebe2] to-[#f0e6ef]",
  },
};

export const THEME_LIST = Object.values(THEMES);
