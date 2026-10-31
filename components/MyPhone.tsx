"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import EditProfileModal from "@/components/EditProfileModal";
import PhonePreview from "@/components/PhonePreview";
import { useAuth } from "@/lib/auth-context";
import type { Profile } from "@/lib/types";
import { uploadImage } from "@/lib/upload";

interface Props {
  profile: Profile;
  /** Dashboard me context ka update, home me saveProfile wala. */
  onUpdate: (patch: Partial<Profile>) => void | Promise<void>;
}

export default function MyPhone({ profile, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const { user } = useAuth();
  const meta: Record<string, string | undefined> = user?.user_metadata ?? {};
  const accountAvatar = meta.avatar_url || meta.picture || "";

  async function changeAvatar(dataUrl: string) {
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "avatar", { type: blob.type });
      await onUpdate({ avatar: await uploadImage(profile.ownerId, "avatar", file, 256) });
    } catch {
      alert("Couldn't upload that image");
    }
  }

  return (
    <>
      <PhonePreview
        profile={{ ...profile, avatar: profile.avatar || accountAvatar }}
        interactive
        onAvatarChange={changeAvatar}
        onEdit={() => setEditing(true)}
      />
      {editing &&
        createPortal(
          <EditProfileModal
            profile={profile}
            onClose={() => setEditing(false)}
            onSaveName={(n) => onUpdate({ displayName: n })}
            onHandleChanged={(p) =>
              onUpdate({ handle: p.handle, handleChangedAt: p.handleChangedAt })
            }
          />,
          document.body
        )}
    </>
  );
}