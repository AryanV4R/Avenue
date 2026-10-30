"use client";

import { useRef, useState } from "react";
import { FiChevronDown, FiImage, FiLink, FiTrash2, FiX } from "react-icons/fi";
import { removeImage, uploadImage } from "@/lib/upload";
import { PLATFORMS, PLATFORM_MAP, PREFIXES, extractHandle } from "@/lib/platforms";
import type { LinkItem, Profile, SocialItem } from "@/lib/types";
import { cn, uid } from "@/lib/utils";
import { iconBtn, inputCls, primaryBtn } from "../ui";
import SortableList from "./SortableList";
import { Card } from "./ui";

const CUSTOM = "__link"; // the "Link" tile in the icon grid

interface Props {
  userId: string;
  links: LinkItem[];
  socials: SocialItem[];
  onChange: (patch: Partial<Pick<Profile, "links" | "socials">>) => void;
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Show link on page"
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

const tile =
  "grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300";

function LinkRow({
  userId, link, handle, open, onToggleOpen, onPatch, onRemove,
}: {
  userId: string;
  link: LinkItem;
  handle: React.ReactNode;
  open: boolean;
  onToggleOpen: () => void;
  onPatch: (p: Partial<LinkItem>) => void;
  onRemove: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(file?: File) {
    if (!file) return;
    try {
      onPatch({ thumbnail: await uploadImage(userId, `thumb-${link.id}`, file, 96) });
    } catch {
      alert("Couldn't upload that image");
    }
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-neutral-200 bg-white transition-opacity dark:border-neutral-800 dark:bg-neutral-950",
        !link.enabled && "opacity-70"
      )}
    >
      <div className="flex items-center gap-2 p-2.5">
        {handle}
        <span className={tile}>
          {link.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={link.thumbnail} alt="" className="h-full w-full object-cover" />
          ) : (
            <FiLink />
          )}
        </span>
        <button
          type="button"
          onClick={onToggleOpen}
          aria-expanded={open}
          className="min-w-0 flex-1 text-left"
        >
          <span className="block truncate text-sm font-medium">{link.title || "Untitled link"}</span>
          <span className="block truncate text-xs text-neutral-500">{link.url || "Add a URL"}</span>
        </button>
        <Toggle on={link.enabled} onChange={(enabled) => onPatch({ enabled })} />
        <button
          type="button"
          onClick={onToggleOpen}
          aria-label={open ? "Collapse" : "Edit link"}
          className={iconBtn}
        >
          <FiChevronDown className={cn("transition-transform", open && "rotate-180")} />
        </button>
      </div>

      {open && (
        <div className="space-y-2 border-t border-neutral-200 p-3 dark:border-neutral-800">
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
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-500 transition hover:border-accent hover:text-accent dark:border-neutral-700"
              >
                <FiImage /> {link.thumbnail ? "Change image" : "Add image"}
              </button>
              {link.thumbnail && (
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => {
                    removeImage(userId, `thumb-${link.id}`);
                    onPatch({ thumbnail: undefined });
                  }}
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
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-500">
                {link.clicks} {link.clicks === 1 ? "click" : "clicks"}
              </span>
              <button type="button" aria-label="Delete link" onClick={onRemove} className={iconBtn}>
                <FiTrash2 />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LinksAndSocials({ userId, links, socials, onChange }: Props) {
  const [picking, setPicking] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const isLink = picking === CUSTOM;
  const platform = picking && !isLink ? PLATFORM_MAP[picking] : null;
  const canAdd = isLink ? !!title.trim() && !!value.trim() : !!value.trim();
  const PickedIcon = isLink ? FiLink : platform?.icon;
  const prefix = platform ? PREFIXES[platform.id] : undefined;
  const isFull = /^https?:\/\//i.test(value);

  function pick(id: string) {
    setPicking(picking === id ? null : id);
    setTitle("");
    setValue("");
  }

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!picking || !canAdd) return;
    if (isLink) {
      onChange({
        links: [
          { id: uid(), title: title.trim(), url: value.trim(), enabled: true, clicks: 0 },
          ...links,
        ],
      });
    } else {
      onChange({ socials: [...socials, { id: uid(), platform: picking, value: value.trim() }] });
    }
    setPicking(null);
    setTitle("");
    setValue("");
  }

  const patchLink = (id: string, p: Partial<LinkItem>) =>
    onChange({ links: links.map((l) => (l.id === id ? { ...l, ...p } : l)) });

  const tileBase =
    "flex flex-col items-center gap-1.5 rounded-xl border px-1 pb-2 pt-3 text-[11px] font-medium transition hover:-translate-y-0.5 active:scale-95";

  return (
    <div className="space-y-5 lg:grid lg:grid-cols-2 lg:items-start lg:gap-10 lg:space-y-0">
      {/* Icon grid: the first tile adds a custom link, the rest add social profiles */}
      <Card>
      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          aria-label="Add a custom link"
          onClick={() => pick(CUSTOM)}
          className={cn(
            tileBase,
            isLink
              ? "border-accent bg-accent text-white"
              : "border-accent/40 bg-accent/5 text-accent hover:bg-accent/10"
          )}
        >
          <FiLink size={20} />
          Link
        </button>
        {PLATFORMS.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              type="button"
              aria-label={`Add ${p.label}`}
              onClick={() => pick(p.id)}
              className={cn(
                tileBase,
                picking === p.id
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800/60"
              )}
            >
              <Icon size={20} />
              <span className="w-full truncate text-center">{p.label}</span>
            </button>
          );
        })}

      </div>
      </Card>

      {picking && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-5 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPicking(null);
          }}
          onKeyDown={(e) => e.key === "Escape" && setPicking(null)}
        >
          <form
            key={picking}
            onSubmit={add}
            className="fade-up w-full max-w-sm space-y-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-card dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium">
                {PickedIcon && <PickedIcon size={18} />}
                {isLink ? "Add a link" : platform?.label}
              </span>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setPicking(null)}
                className={iconBtn}
              >
                <FiX />
              </button>
            </div>

            {isLink ? (
              <>
                <input
                  autoFocus
                  className={inputCls}
                  placeholder="Title (e.g. My latest video)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  className={inputCls}
                  inputMode="url"
                  autoCapitalize="none"
                  placeholder="https://…"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </>
            ) : (
              <div className="flex items-center rounded-xl border border-neutral-200 bg-white pl-3.5 transition focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15 dark:border-neutral-800 dark:bg-neutral-950">
                {prefix && !isFull && (
                  <span className="shrink-0 text-sm text-neutral-400">{prefix}</span>
                )}
                <input
                  autoFocus
                  autoCapitalize="none"
                  className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-sm outline-none"
                  placeholder={prefix && !isFull ? "username" : platform?.placeholder}
                  value={value}
                  onChange={(e) => setValue(extractHandle(picking, e.target.value))}
                />
              </div>
            )}

            <button className={`${primaryBtn} w-full`} disabled={!canAdd}>
              Add
            </button>
          </form>
        </div>
      )}
      <Card>
      {links.length === 0 && socials.length === 0 ? (
        <p className="flex min-h-[58px] items-center justify-center rounded-2xl border border-dashed border-neutral-300 px-4 py-2.5 text-center text-sm text-neutral-500 dark:border-neutral-700">
          Nothing here yet. Tap an icon above to add your first link or social profile.
        </p>
      ) : (
        <div className="space-y-2">
          {links.length > 0 && (
            <SortableList
              items={links}
              onChange={(l) => onChange({ links: l })}
              renderItem={(l, handle) => (
                <LinkRow
                  userId={userId}
                  link={l}
                  handle={handle}
                  open={openId === l.id}
                  onToggleOpen={() => setOpenId(openId === l.id ? null : l.id)}
                  onPatch={(p) => patchLink(l.id, p)}
                  onRemove={() => {
                    removeImage(userId, `thumb-${l.id}`);
                    onChange({ links: links.filter((x) => x.id !== l.id) });
                  }}
                />
              )}
            />
          )}

          {socials.length > 0 && (
            <SortableList
              items={socials}
              onChange={(s) => onChange({ socials: s })}
              renderItem={(s, handle) => {
                const p = PLATFORM_MAP[s.platform];
                if (!p) return null;
                const Icon = p.icon;
                return (
                  <div className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white p-2.5 dark:border-neutral-800 dark:bg-neutral-950">
                    {handle}
                    <span className={tile}>
                      <Icon size={18} />
                    </span>
                    <input
                      aria-label={p.label}
                      className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none"
                      value={s.value}
                      onChange={(e) =>
                        onChange({
                          socials: socials.map((x) =>
                            x.id === s.id ? { ...x, value: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <button
                      type="button"
                      aria-label={`Remove ${p.label}`}
                      onClick={() => onChange({ socials: socials.filter((x) => x.id !== s.id) })}
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
      )}
      </Card>
    </div>
  );
}
