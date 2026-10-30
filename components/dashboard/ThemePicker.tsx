"use client";

import { THEME_LIST } from "@/lib/themes";
import type { ThemeId } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ThemePicker({
  value, onChange,
}: {
  value: ThemeId;
  onChange: (t: ThemeId) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-3 lg:flex lg:flex-col">
      {THEME_LIST.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={cn(
            "flex flex-col items-center gap-2 rounded-2xl border p-3 text-xs font-medium transition active:scale-95 lg:w-28",
            value === t.id
              ? "border-accent ring-4 ring-accent/15"
              : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
          )}
        >
          <span className={cn("h-10 w-10 rounded-full", t.swatch)} />
          {t.label}
        </button>
      ))}
    </div>
  );
}
