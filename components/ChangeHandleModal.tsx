"use client";

import { useEffect, useState } from "react";
import { ghostBtn, primaryBtn } from "@/components/ui";
import { DOMAIN } from "@/lib/config";
import { sanitizeHandle, validateHandleFormat } from "@/lib/handle";
import { isHandleAvailable, saveProfile } from "@/lib/storage";
import type { Profile } from "@/lib/types";

const COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;

interface Props {
  profile: Profile;
  userId: string;
  onClose: () => void;
  onChanged: (p: Profile) => void;
}

export default function ChangeHandleModal({ profile, userId, onClose, onChanged }: Props) {
  const [value, setValue] = useState(profile.handle);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const unlockAt = (profile.handleChangedAt ?? 0) + COOLDOWN_MS;
  const locked = Date.now() < unlockAt;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (value === profile.handle) return setError("This is already your username");
    const fmt = validateHandleFormat(value);
    if (fmt) return setError(fmt);

    setBusy(true);
    const ok = await isHandleAvailable(value, profile.id);
    if (!ok) {
      setBusy(false);
      return setError("That handle is already taken");
    }
    const next: Profile = {
      ...profile,
      handle: value,
      handleChangedAt: Date.now(),
      updatedAt: Date.now(),
    };
    try {
      await saveProfile(next);
    } catch (err) {
      setBusy(false);
      return setError(err instanceof Error ? err.message : "Could not save");
    }
    setBusy(false);
    onChanged(next);
  }

  return (
    <div
      className="fixed inset-0 z-50 grid items-end bg-black/50 backdrop-blur-sm sm:place-items-center sm:px-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="fade-up w-full max-w-none rounded-t-2xl border border-b-0 border-neutral-200 bg-white p-6 shadow-card sm:max-w-sm sm:rounded-2xl sm:border-b dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="font-display text-xl font-semibold tracking-tight">Change username</h2>

        {locked ? (
          <>
            <p className="mt-3 text-sm text-neutral-500">
              You can change your username once every 30 days. Next change available on{" "}
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {new Date(unlockAt).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              .
            </p>
            <button onClick={onClose} className={`${ghostBtn} mt-6 w-full`}>
              Close
            </button>
          </>
        ) : (
          <form onSubmit={save} className="mt-4 space-y-3">
            <div className="flex items-center rounded-full border border-neutral-200 bg-white pl-5 pr-2 transition focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15 dark:border-neutral-800 dark:bg-neutral-950">
              <span className="text-sm text-neutral-400">{DOMAIN}/</span>
              <input
                autoFocus
                value={value}
                onChange={(e) => {
                  setValue(sanitizeHandle(e.target.value));
                  setError(null);
                }}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="w-full bg-transparent py-3 pl-0.5 text-sm outline-none"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <p className="text-xs text-neutral-500">
              You can change it only once every 30 days. Your old link will stop working.
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className={`${ghostBtn} flex-1`}>
                Cancel
              </button>
              <button disabled={busy} className={`${primaryBtn} flex-1`}>
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}