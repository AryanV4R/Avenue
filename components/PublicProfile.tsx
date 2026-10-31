"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProfileView from "@/components/ProfileView";
import { primaryBtn } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { APP_NAME } from "@/lib/config";
import { getProfileByHandle, recordClick } from "@/lib/storage";
import type { Profile } from "@/lib/types";

export default function PublicProfile({
  handle,
  initial = null,
}: {
  handle: string;
  initial?: Profile | null;
}) {
  const { profile: mine } = useAuth();
  const own = mine?.handle === handle ? mine : null;
  const start = own ?? initial;
  const [state, setState] = useState<"loading" | "ready" | "missing">(start ? "ready" : "loading");
  const [profile, setProfile] = useState<Profile | null>(start);

  useEffect(() => {
    if (own) {
      document.title = `${own.displayName || own.handle} (@${own.handle}) · ${APP_NAME}`;
      return;
    }
    if (initial) return; // server ne title metadata me de diya, dobara fetch nahi
    getProfileByHandle(handle).then((p) => {
      setProfile(p);
      setState(p ? "ready" : "missing");
      if (p) document.title = `${p.displayName || p.handle} (@${p.handle}) · ${APP_NAME}`;
    });
  }, [handle]);

  if (state === "loading") return <div className="min-h-dvh" />;

  if (state === "missing" || !profile) {
    return (
      <main className="grid min-h-dvh place-items-center px-5 text-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">@{handle}</h1>
          <p className="mt-2 text-sm text-neutral-500">This page doesn&apos;t exist yet.</p>
          <Link href={`/dashboard?handle=${handle}`} className={`${primaryBtn} mt-6`}>
            Claim this handle
          </Link>
        </div>
      </main>
    );
  }

const isOwner = !!mine && mine.id === profile.id;

return (
<ProfileView
  profile={profile}
  className="min-h-dvh overflow-clip"
  showBack={isOwner}
  showShare
  onLinkClick={isOwner ? undefined : (id) => recordClick(profile.handle, id)}
/>
);
}
