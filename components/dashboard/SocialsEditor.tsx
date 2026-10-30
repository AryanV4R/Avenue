"use client";

import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { PLATFORMS, PLATFORM_MAP } from "@/lib/platforms";
import type { SocialItem } from "@/lib/types";
import { cn, uid } from "@/lib/utils";
import { ghostBtn, iconBtn, inputCls, primaryBtn } from "../ui";
import SortableList from "./SortableList";

interface Props {
  socials: SocialItem[];
  onChange: (s: SocialItem[]) => void;
}

export default function SocialsEditor({ socials, onChange }: Props) {
  const [picking, setPicking] = useState<string | null>(null);
  const [value, setValue] = useState("");

  const platform = picking ? PLATFORM_MAP[picking] : null;

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!picking || !value.trim()) return;
    onChange([...socials, { id: uid(), platform: picking, value: value.trim() }]);
    setPicking(null);
    setValue("");
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
        {PLATFORMS.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              type="button"
              title={p.label}
              aria-label={`Add ${p.label}`}
              onClick={() => {
                setPicking(p.id);
                setValue("");
              }}
              className={cn(
                "grid h-12 place-items-center rounded-xl border transition hover:-translate-y-0.5 hover:shadow-sm active:scale-95",
                picking === p.id
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-neutral-200 text-neutral-700 dark:border-neutral-800 dark:text-neutral-300"
              )}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>

      {platform && (
        <form onSubmit={add} className="fade-up flex flex-col gap-2 sm:flex-row">
          <input
            autoFocus
            className={inputCls}
            placeholder={`${platform.label}: ${platform.placeholder}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="flex gap-2">
            <button className={primaryBtn} disabled={!value.trim()}>
              Add
            </button>
            <button type="button" className={ghostBtn} onClick={() => setPicking(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {socials.length > 0 && (
        <SortableList
          items={socials}
          onChange={onChange}
          renderItem={(s, handle) => {
            const p = PLATFORM_MAP[s.platform];
            if (!p) return null;
            const Icon = p.icon;
            return (
              <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-950">
                {handle}
                <Icon size={18} className="shrink-0" />
                <input
                  aria-label={p.label}
                  className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none"
                  value={s.value}
                  onChange={(e) =>
                    onChange(socials.map((x) => (x.id === s.id ? { ...x, value: e.target.value } : x)))
                  }
                />
                <button
                  type="button"
                  aria-label={`Remove ${p.label}`}
                  onClick={() => onChange(socials.filter((x) => x.id !== s.id))}
                  className={iconBtn}
                >
                  <FiTrash2 />
                </button>
              </div>
            );
          }}
        />
      )}
    </div>
  );
}
