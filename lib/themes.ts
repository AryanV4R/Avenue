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
    id: "light", label: "Sky",
    page: "bg-[#cfe6fb] bg-[radial-gradient(60%_40%_at_20%_0%,rgb(255_255_255/0.85),transparent),radial-gradient(70%_50%_at_90%_100%,rgb(98_160_235/0.55),transparent)]",
    text: "text-[#0f2238]",
    muted: "text-[#28435f]",
    button: "bg-white/60 text-[#0f2238] border border-white/70 shadow-card backdrop-blur-sm",
    swatch: "bg-gradient-to-br from-[#eaf4ff] via-[#b5d8f8] to-[#6aa6ea]",
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
    id: "gradient", label: "Dusk",
    page: "bg-gradient-to-b from-[#171a35] via-[#2f2556] to-[#6b3560]",
    text: "text-white",
    muted: "text-white/70",
    button: "bg-white/10 text-white border border-white/15 backdrop-blur-md",
    swatch: "bg-gradient-to-br from-[#171a35] via-[#2f2556] to-[#6b3560]",
  },
};

export const THEME_LIST = Object.values(THEMES);