"use client";

import { useEffect, useState } from "react";
import ChangeHandleModal from "@/components/ChangeHandleModal";
import { ghostBtn, inputCls, primaryBtn } from "@/components/ui";
import type { Profile } from "@/lib/types";

interface Props {
  profile: Profile;
  onClose: () => void;
  onSaveName: (name: string) => Promise<void> | void;
  onHandleChanged: (p: Profile) => void;
}

export default function EditProfileModal({ profile, onClose, onSaveName, onHandleChanged }: Props) {
  const [name, setName] = useState(profile.displayName ?? "");
  const [busy, setBusy] = useState(false);
  const [changingHandle, setChangingHandle] = useState(false);

  useEffect(() => {
    if (changingHandle) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, changingHandle]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await onSaveName(name.trim());
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid items-end bg-black/50 backdrop-blur-sm sm:place-items-center sm:px-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={save}
        className="fade-up w-full max-w-none space-y-4 rounded-t-2xl border border-b-0 border-neutral-200 bg-white p-6 shadow-card sm:max-w-sm sm:rounded-2xl sm:border-b dark:border-neutral-800 dark:bg-neutral-900"
      >
        <h2 className="font-display text-xl font-semibold tracking-tight">Edit profile</h2>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-neutral-500">Display name</span>
          <input
            autoFocus
            className={inputCls}
            maxLength={50}
            placeholder={profile.handle}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <div className="space-y-1.5">
          <span className="block text-xs font-medium text-neutral-500">Username</span>
          <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white py-1.5 pl-3.5 pr-1.5 text-sm dark:border-neutral-800 dark:bg-neutral-950">
            <span>@{profile.handle}</span>
            <button type="button" onClick={() => setChangingHandle(true)} className={ghostBtn}>
              Change
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={onClose} className={`${ghostBtn} flex-1`}>
            Cancel
          </button>
          <button disabled={busy} className={`${primaryBtn} flex-1`}>
            Save
          </button>
        </div>
      </form>

      {changingHandle && (
        <ChangeHandleModal
          profile={profile}
          userId={profile.ownerId}
          onClose={() => setChangingHandle(false)}
          onChanged={(p) => {
            onHandleChanged(p);
            setChangingHandle(false);
          }}
        />
      )}
    </div>
  );
}