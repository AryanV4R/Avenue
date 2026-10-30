"use client";

import { useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
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
      <div className="flex items-center gap-4">
        {profile.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.avatar} alt="" className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded-full bg-accent text-xl font-semibold text-white">
            {name[0]?.toUpperCase()}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => fileRef.current?.click()} className={ghostBtn}>
            <FiUpload /> Upload
          </button>
          {profile.avatar && (
            <button type="button" onClick={() => onChange({ avatar: "" })} className={ghostBtn}>
              Remove
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
        <div className="ml-auto">
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
