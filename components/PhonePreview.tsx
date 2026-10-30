"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import ProfileView from "@/components/ProfileView";
import type { Profile } from "@/lib/types";

const W = 305;
const H = 640;
/** Navbar (64px) + upar/neeche thoda margin. Kam karoge to phone bada hoga. */
const OFFSET = 112;

// Pichla scale yaad rakho, taaki naya mount seedha sahi size pe aaye (jump nahi)
let lastScale = 0.85;
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useFit() {
  const [s, setS] = useState(lastScale);
  useIsoLayoutEffect(() => {
    const calc = () => {
      lastScale = Math.min(1, Math.max(0.5, (window.innerHeight - OFFSET) / H));
      setS(lastScale);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return s;
}

export default function PhonePreview({
  profile,
  onAvatarChange,
  interactive = false,
  onEdit,
}: {
  profile: Profile;
  onAvatarChange?: (dataUrl: string) => void;
  interactive?: boolean;
  onEdit?: () => void;
}) {
  const s = useFit();

  return (
    <div className="relative mx-auto" style={{ width: W * s, height: H * s }}>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: W, height: H, transform: `scale(${s})` }}
      >
        <span className="absolute -left-[3px] top-[17%] h-6 w-[3px] rounded-l bg-neutral-700" />
        <span className="absolute -left-[3px] top-[24%] h-11 w-[3px] rounded-l bg-neutral-700" />
        <span className="absolute -left-[3px] top-[32%] h-11 w-[3px] rounded-l bg-neutral-700" />
        <span className="absolute -right-[3px] top-[27%] h-16 w-[3px] rounded-r bg-neutral-700" />

        <div className="relative h-full w-full overflow-hidden rounded-[2.75rem] border-[5px] border-neutral-900 bg-neutral-900 shadow-2xl ring-1 ring-neutral-700 dark:border-neutral-800 dark:ring-neutral-600">
          <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-[22px] w-[74px] -translate-x-1/2 rounded-full bg-black" />
          <div className="h-full overflow-y-auto rounded-[2.4rem] [scrollbar-width:none]">
            <ProfileView
              profile={profile}
              preview={!interactive}
              compact
              onAvatarChange={onAvatarChange}
              onEdit={onEdit}
              className="min-h-full"
            />
          </div>
          <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-20 h-[5px] w-28 -translate-x-1/2 rounded-full bg-neutral-900/40 dark:bg-white/50" />
        </div>
      </div>
    </div>
  );
}