"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { FiUser, FiLogOut } from "react-icons/fi";
import { supabase } from "@/lib/supabase";

export default function UserMenu() {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);

  // Bahar click ya Esc dabane pe popup band
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

const meta = user.user_metadata ?? {};
const name: string =
  profile?.displayName?.trim() || meta.full_name || meta.name || user.email?.split("@")[0] || "User";
const avatar: string = profile?.avatar || meta.avatar_url || meta.picture || "";
const initial = name[0]?.toUpperCase();

  const face = (size: string) =>
    avatar ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatar}
        alt={name}
        referrerPolicy="no-referrer"
        className={`${size} rounded-full object-cover`}
      />
    ) : (
      <div className={`${size} grid place-items-center rounded-full bg-accent font-medium text-white`}>
        {initial}
      </div>
    );

  async function signOut() {
    setOpen(false);
    await supabase.auth.signOut();
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
        className="block rounded-full ring-2 ring-transparent transition hover:ring-accent/40 active:scale-95"
      >
        {face("h-10 w-10 sm:h-9 sm:w-9")}
      </button>

      {open && (
        <div className="fade-up absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-neutral-200 bg-white p-4 shadow-card dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            {face("h-12 w-12")}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="truncate text-xs text-neutral-500">{user.email}</p>
              {profile?.handle && (
                <p className="truncate text-xs text-accent">@{profile.handle}</p>
              )}
            </div>
          </div>
          {profile?.handle && (
            <Link
              href={`/${profile.handle}`}
              onClick={() => setOpen(false)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 py-2 text-sm font-medium transition hover:bg-neutral-100 active:scale-[0.98] md:hidden dark:border-neutral-800 dark:hover:bg-neutral-800"
            >
              <FiUser size={15} />
              My Page
            </Link>
          )}
          <button
            onClick={signOut}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 py-2 text-sm font-medium transition hover:bg-neutral-100 active:scale-[0.98] md:mt-4 dark:border-neutral-800 dark:hover:bg-neutral-800"
          >
            <FiLogOut size={15} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}