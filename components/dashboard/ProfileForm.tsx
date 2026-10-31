"use client";

import { useRef, useState } from "react";
import { FiCamera } from "react-icons/fi";
import BackButton from "@/components/BackButton";
import ChangeHandleModal from "@/components/ChangeHandleModal";
import { uploadImage } from "@/lib/upload";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ghostBtn, inputCls } from "../ui";

interface Props {
  profile: Profile;
  onChange: (patch: Partial<Profile>) => void;
}

function Field({ label, hint, children }: { label: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center justify-between text-xs font-medium text-neutral-500">
        {label}
        {hint}
      </span>
      {children}
    </label>
  );
}

export default function ProfileForm({ profile, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [editingHandle, setEditingHandle] = useState(false);

    async function onFile(file?: File) {
    if (!file) return;
    try {
      onChange({ avatar: await uploadImage(profile.ownerId, "avatar", file, 256) });
    } catch {
      alert("Couldn't upload that image");
    }
  }

  const name = profile.displayName || profile.handle;

  return (
    <div className="space-y-5">
      {/* Avatar */}
      <div className="relative flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          aria-label="Change photo"
          className="relative h-24 w-24 rounded-full outline-none transition active:scale-95 focus-visible:ring-4 focus-visible:ring-accent/30"
        >
          {profile.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar} alt="" className="h-24 w-24 rounded-full object-cover" />
          ) : (
            <div className="grid h-24 w-24 place-items-center rounded-full bg-accent text-3xl font-semibold text-white">
              {name[0]?.toUpperCase()}
            </div>
          )}
          <span className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-accent text-white dark:border-neutral-900">
            <FiCamera className="text-sm" />
          </span>
        </button>
        <div className="h-5">
          {profile.avatar && (
            <button
              type="button"
              onClick={() => onChange({ avatar: "" })}
              className="text-xs text-neutral-500 transition hover:text-red-500"
            >
              Remove photo
            </button>
          )}
        </div>
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
        <div className="absolute right-0 top-0">
          <BackButton />
        </div>
      </div>
      <Field label="Display name">
        <input
          className={inputCls}
          maxLength={50}
          placeholder={profile.handle}
          value={profile.displayName}
          onChange={(e) => onChange({ displayName: e.target.value })}
        />
      </Field>

      <div className="space-y-1.5">
        <span className="block text-xs font-medium text-neutral-500">Handle</span>
        <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white py-1.5 pl-3.5 pr-1.5 text-sm dark:border-neutral-800 dark:bg-neutral-950">
          <span>@{profile.handle}</span>
          <button type="button" onClick={() => setEditingHandle(true)} className={ghostBtn}>
            Change
          </button>
        </div>
      </div>

      <Field
        label="Bio"
        hint={<span className="font-normal">{profile.bio.length}/160</span>}
      >
        <textarea
          className={cn(inputCls, "resize-none")}
          rows={3}
          maxLength={160}
          placeholder="A short line about you"
          value={profile.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
        />
      </Field>

      {editingHandle && (
        <ChangeHandleModal
          profile={profile}
          userId={profile.ownerId}
          onClose={() => setEditingHandle(false)}
          onChanged={(p) => {
            onChange({ handle: p.handle, handleChangedAt: p.handleChangedAt });
            setEditingHandle(false);
          }}
        />
      )}
    </div>
  );
}
