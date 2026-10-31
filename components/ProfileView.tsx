"use client";

import { useState } from "react";
import { FiCamera, FiCheck, FiEdit2, FiShare2 } from "react-icons/fi";
import BackButton from "@/components/BackButton";
import { PLATFORM_MAP } from "@/lib/platforms";
import { THEMES } from "@/lib/themes";
import type { Profile } from "@/lib/types";
import { cn, normalizeUrl } from "@/lib/utils";

interface Props {
  profile: Profile;
  /** Preview mode: nothing navigates, nothing is counted. */
  preview?: boolean;
  onLinkClick?: (linkId: string) => void;
  className?: string;
    /** Preview only: if set, tapping the avatar opens the device image picker. */
  onAvatarChange?: (dataUrl: string) => void;
  /** Phone preview ke liye chhota avatar aur kam top padding. */
  compact?: boolean;
  /** Agar diya to name/username ke neeche ek "Edit" pill dikhega. */
  onEdit?: () => void;
  /** Owner apna hi page dekh raha ho to top-right me cross (dashboard pe wapas). */
  showBack?: boolean;
  /** Sirf public /handle page pe share button dikhana ho to true. */
  showShare?: boolean;
}

export default function ProfileView({ profile, preview = false, onLinkClick, onAvatarChange, compact = false, onEdit, showBack = false, showShare = false, className }: Props) {
  const t = THEMES[profile.theme] ?? THEMES.light;
  const [copied, setCopied] = useState(false);

  const name = profile.displayName || profile.handle;
  const socials = profile.socials.filter((s) => s.value.trim() && PLATFORM_MAP[s.platform]);
  const links = profile.links.filter((l) => l.enabled && l.title.trim() && l.url.trim());
  const avatarSize = compact ? "h-[72px] w-[72px]" : "h-24 w-24";

  const block = (e: React.MouseEvent) => {
    if (preview) e.preventDefault();
  };

    function pickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => onAvatarChange?.(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function share() {
    if (preview) return;
    const url = `${window.location.origin}/${profile.handle}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  return (
    <div
      className={cn(
        "isolate relative flex w-full flex-col items-center pb-10", compact ? "px-3" : "px-5",
        compact ? "pt-14" : "pt-20",
        t.page,
        t.text,
        className
      )}
    >
      <div aria-hidden className={cn("doodle-layer pointer-events-none absolute inset-0 -z-10", compact && "doodle-layer-compact")} />
      {showBack && (
        <div className="fade-up absolute right-4 top-4 z-10">
          <BackButton />
        </div>
      )}
      <div className="relative">
        {profile.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar}
            alt={name}
            referrerPolicy="no-referrer"
            className={cn("rounded-full object-cover shadow-card ring-4 ring-white/30", avatarSize)}
          />
        ) : (
          <div
            className={cn(
              "grid place-items-center rounded-full bg-accent font-display font-semibold text-white shadow-card",
              avatarSize,
              compact ? "text-2xl" : "text-3xl"
            )}
          >
            {name[0]?.toUpperCase()}
          </div>
        )}
        {onAvatarChange && (
          <label
            aria-label="Change profile photo"
            className="absolute inset-0 cursor-pointer rounded-full focus-within:ring-4 focus-within:ring-accent/30"
          >
            <span
              className={cn(
                "absolute -bottom-0.5 -right-0.5 grid place-items-center rounded-full bg-accent text-white shadow-card ring-2 ring-white",
                compact ? "h-6 w-6" : "h-7 w-7"
              )}
            >
              <FiCamera size={compact ? 12 : 14} />
            </span>
            <input type="file" accept="image/*" className="sr-only" onChange={pickAvatar} />
          </label>
        )}
        {showShare && (
          <button
            type="button"
            onClick={share}
            aria-label="Copy link"
            className={cn(
              "absolute grid place-items-center rounded-full bg-accent text-white shadow-card ring-2 ring-white transition hover:scale-105 active:scale-95",
              onAvatarChange ? "-bottom-0.5 -left-0.5" : "-bottom-0.5 -right-0.5",
              compact ? "h-6 w-6" : "h-7 w-7"
            )}
          >
            {copied ? <FiCheck size={compact ? 12 : 14} /> : <FiShare2 size={compact ? 12 : 14} />}
          </button>
        )}
        {showShare && copied && (
          <span className="fade-up absolute bottom-1 left-full ml-3 whitespace-nowrap rounded-full bg-black/80 px-3 py-1 text-xs text-white">
            Link copied
          </span>
        )}
      </div>

      <div className="mt-5 flex max-w-full items-center justify-center gap-2.5">
        <h1 className="min-w-0 truncate font-display text-xl font-semibold tracking-tight">
          {name}
        </h1>
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit name and username"
            title="Edit"
            className={cn(
              "group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-current/10 px-2.5 py-1 text-xs transition hover:bg-current/15 active:scale-95",
              t.muted
            )}
          >
            @{profile.handle}
            <FiEdit2 size={11} className="opacity-70 transition group-hover:opacity-100" />
          </button>
        ) : (
          <span className={cn("shrink-0 rounded-full bg-current/10 px-2.5 py-1 text-xs", t.muted)}>
            @{profile.handle}
          </span>
        )}
      </div>
      {profile.bio && (
        <p
          className={cn("mt-3 max-w-xs whitespace-pre-line text-balance text-center text-sm leading-relaxed", t.muted)}
        >
          {profile.bio}
        </p>
      )}

      {socials.length > 0 && (
        <div className={cn("mt-6 grid w-full max-w-md grid-cols-2", compact ? "gap-2" : "gap-3")}>
          {socials.map((s) => {
            const p = PLATFORM_MAP[s.platform];
            const Icon = p.icon;
            return (
              <a
                key={s.id}
                href={p.build(s.value)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={block}
                className={cn(
                  "flex w-full min-w-0 items-center justify-center rounded-full text-center font-medium transition duration-200 hover:-translate-y-px hover:shadow-md active:scale-[0.985]", compact ? "gap-1.5 px-2.5 py-1.5 text-xs" : "gap-2 px-4 py-2 text-sm",
                  t.button
                )}
              >
                <span className={cn("grid shrink-0 place-items-center", compact ? "h-4 w-4" : "h-5 w-5")}>
                  <Icon size={compact ? 14 : 20} />
                </span>
                <span className="min-w-0 truncate">{p.label}</span>
              </a>
            );
          })}
        </div>
      )}

      <div className="mt-8 w-full max-w-md space-y-3">
        {links.map((l) => (
          <a
            key={l.id}
            href={normalizeUrl(l.url)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (preview) return e.preventDefault();
              onLinkClick?.(l.id);
            }}
            className={cn(
              cn(
                "relative flex w-full items-center justify-center rounded-full text-center font-medium transition duration-200 hover:-translate-y-px hover:shadow-md active:scale-[0.985]",
                compact ? "px-12 py-2.5 text-xs" : "px-14 py-3 text-sm"
              ),
              t.button
            )}
          >
            {l.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={l.thumbnail}
                alt=""
                className={cn(
                  "absolute left-1.5 rounded-full object-cover",
                  compact ? "h-7 w-7" : "h-8 w-8"
                )}
              />
            )}
            <span className="truncate">{l.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
