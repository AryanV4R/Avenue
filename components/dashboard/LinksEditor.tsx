"use client";

import { useRef } from "react";
import { FiImage, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { fileToDataUrl } from "@/lib/image";
import type { LinkItem } from "@/lib/types";
import { cn, uid } from "@/lib/utils";
import { iconBtn, inputCls, primaryBtn } from "../ui";
import SortableList from "./SortableList";

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Show link"
      onClick={() => onChange(!on)}
      className={cn(
        "relative h-6 w-10 shrink-0 rounded-full transition-colors",
        on ? "bg-accent" : "bg-neutral-300 dark:bg-neutral-700"
      )}
    >
      <span
        className={cn(
          "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          on && "translate-x-4"
        )}
      />
    </button>
  );
}

function LinkCard({
  link, handle, onPatch, onRemove,
}: {
  link: LinkItem;
  handle: React.ReactNode;
  onPatch: (p: Partial<LinkItem>) => void;
  onRemove: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(file?: File) {
    if (!file) return;
    try {
      onPatch({ thumbnail: await fileToDataUrl(file, 96) });
    } catch {
      alert("Couldn't read that image");
    }
  }

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-2xl border border-neutral-200 bg-white p-3 transition dark:border-neutral-800 dark:bg-neutral-950",
        !link.enabled && "opacity-60"
      )}
    >
      <div className="pt-1">{handle}</div>

      <div className="min-w-0 flex-1 space-y-2">
        <input
          className={inputCls}
          placeholder="Title"
          value={link.title}
          onChange={(e) => onPatch({ title: e.target.value })}
        />
        <input
          className={inputCls}
          placeholder="https://…"
          inputMode="url"
          autoCapitalize="none"
          value={link.url}
          onChange={(e) => onPatch({ url: e.target.value })}
        />
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="Set thumbnail"
              className="grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-dashed border-neutral-300 text-neutral-400 transition hover:border-accent hover:text-accent dark:border-neutral-700"
            >
              {link.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={link.thumbnail} alt="" className="h-full w-full object-cover" />
              ) : (
                <FiImage />
              )}
            </button>
            {link.thumbnail && (
              <button
                type="button"
                aria-label="Remove thumbnail"
                onClick={() => onPatch({ thumbnail: undefined })}
                className={iconBtn}
              >
                <FiX />
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                onFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </div>
          <span className="text-xs text-neutral-500">
            {link.clicks} {link.clicks === 1 ? "click" : "clicks"}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 pt-1">
        <Toggle on={link.enabled} onChange={(enabled) => onPatch({ enabled })} />
        <button type="button" aria-label="Delete link" onClick={onRemove} className={iconBtn}>
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
}

export default function LinksEditor({
  links, onChange,
}: {
  links: LinkItem[];
  onChange: (l: LinkItem[]) => void;
}) {
  const patch = (id: string, p: Partial<LinkItem>) =>
    onChange(links.map((l) => (l.id === id ? { ...l, ...p } : l)));

  const add = () =>
    onChange([{ id: uid(), title: "", url: "", enabled: true, clicks: 0 }, ...links]);

  return (
    <div className="space-y-3">
      <button type="button" onClick={add} className={`${primaryBtn} w-full`}>
        <FiPlus /> Add link
      </button>

      {links.length === 0 && (
        <p className="py-4 text-center text-sm text-neutral-500">No links yet. Add your first one.</p>
      )}

      <SortableList
        items={links}
        onChange={onChange}
        renderItem={(l, handle) => (
          <LinkCard
            link={l}
            handle={handle}
            onPatch={(p) => patch(l.id, p)}
            onRemove={() => onChange(links.filter((x) => x.id !== l.id))}
          />
        )}
      />
    </div>
  );
}
