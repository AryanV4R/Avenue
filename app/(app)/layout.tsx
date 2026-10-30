"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { FiCheck, FiEye, FiX } from "react-icons/fi";
import MyPhone from "@/components/MyPhone";
import ThemePicker from "@/components/dashboard/ThemePicker";
import { primaryBtn } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/profile-context";
import { supabase } from "@/lib/supabase";

function SaveStatus() {
  const { status, error } = useProfile();
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  useEffect(() => setSlot(document.getElementById("nav-extra")), []);
  if (!slot || status === "idle") return null;

  return createPortal(
    status === "error" ? (
      <span title={error ?? ""} className="mr-2 text-xs font-medium text-red-500">
        {"Couldn't save"}
      </span>
    ) : (
      <span className="mr-2 inline-flex items-center gap-1.5 text-xs text-neutral-500">
        {status === "saving" ? (
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
        ) : (
          <FiCheck className="text-accent" />
        )}
        {status === "saving" ? "Saving" : "Saved"}
      </span>
    ),
    slot
  );
}

function Skeleton() {
  const path = usePathname();
  const bar = "animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800";

  if (path === "/profile") {
    return (
      <div className="space-y-6">
        <div className={`${bar} h-5 w-40 rounded-lg`} />
        <div className="space-y-2">
          <div className={`${bar} h-8 w-32 rounded-lg`} />
          <div className={`${bar} h-4 w-64 rounded-lg`} />
        </div>
        <div className={`${bar} h-28`} />
        <div className={`${bar} h-72`} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`${bar} mx-auto h-4 w-72 max-w-full rounded-lg`} />
      <div className={`${bar} h-96`} />
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const { profile, update, load } = useProfile();
  const { ready, loggedIn } = useAuth();
  const router = useRouter();
  const [previewOpen, setPreviewOpen] = useState(false);
  const started = useRef(false);

  // Session nahi hai to signin pe bhejo (getSession se confirm, stale cache pe nahi)
  useEffect(() => {
    if (!ready || loggedIn) return;
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/signin");
    });
  }, [ready, loggedIn, router]);

  // Naya user (profile row nahi) ya claim flow (?handle=) me ek baar load/create
  useEffect(() => {
    if (!ready || !loggedIn || started.current) return;
    const wanted = new URLSearchParams(window.location.search).get("handle") ?? undefined;
    if (profile && !wanted) return;
    started.current = true;
    load(wanted);
  }, [ready, loggedIn, profile, load]);

  return (
    <div className="min-h-[calc(100dvh-4rem)]">
      <SaveStatus />

      <main
        style={{ "--pw": "clamp(152.5px, calc((100dvh - 112px) * 0.4765625), 305px)" } as React.CSSProperties}
        className="mx-auto grid max-w-6xl gap-10 px-5 py-8 pb-28 sm:px-8 lg:grid-cols-[minmax(0,1fr)_calc(40px_+_var(--pw)/2_+_(100%_-_80px)_*_0.225)] lg:gap-x-0 lg:pb-10"
      >
        <div className="min-w-0 lg:-mt-2">{profile ? children : <Skeleton />}</div>



        {profile && (
          <aside className="hidden lg:block">
            <div className="sticky top-16 -mt-8 flex h-[calc(100dvh-4rem)] items-center pl-10">
              <div className="absolute left-[calc(80px_+_var(--pw))] top-6 hidden w-28 min-[1200px]:block">
                <ThemePicker value={profile.theme} onChange={(theme) => update({ theme })} />
              </div>
              <div className="shrink-0">
                <MyPhone profile={profile} onUpdate={update} />
              </div>
            </div>
          </aside>
        )}

        {!profile && (
          <>
            <aside className="hidden lg:block">
              <div className="sticky top-20 space-y-3">
                <div className="mx-auto h-4 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="mx-auto h-[560px] w-[270px] animate-pulse rounded-[2.75rem] bg-neutral-200 dark:bg-neutral-800" />
              </div>
            </aside>
          </>
        )}
      </main>

      {profile && (
        <>
          <button
            onClick={() => setPreviewOpen(true)}
            className={`${primaryBtn} fixed bottom-5 left-1/2 z-30 -translate-x-1/2 shadow-lg lg:hidden`}
          >
            <FiEye /> Preview
          </button>
          {previewOpen && (
            <div className="fixed inset-0 z-40 grid place-items-center bg-black/60 p-4 lg:hidden">
              <button
                onClick={() => setPreviewOpen(false)}
                aria-label="Close preview"
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-neutral-900 shadow"
              >
                <FiX />
              </button>
              <MyPhone profile={profile} onUpdate={update} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}