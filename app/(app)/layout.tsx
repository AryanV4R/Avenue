"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { FiCheck, FiEye, FiX } from "react-icons/fi";
import MyPhone from "@/components/MyPhone";
import PhoneSlot from "@/components/PhoneSlot";
import ThemePicker from "@/components/dashboard/ThemePicker";
import { Card } from "@/components/dashboard/ui";
import { closeBtn, primaryBtn } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/profile-context";
import { supabase } from "@/lib/supabase";
import { PLATFORMS } from "@/lib/platforms";
import { THEME_LIST } from "@/lib/themes";

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
  const fill = "bg-neutral-200 dark:bg-neutral-800";
  const dot = "bg-neutral-300/70 dark:bg-neutral-700";

  if (path === "/profile") {
    return (
      <div className="space-y-6">
        <Card>
          <div className="animate-pulse space-y-5">
            <div className="relative flex flex-col items-center gap-2">
              <div className={`${fill} h-24 w-24 rounded-full`} />
              <div className="h-5" />
              <div className={`${fill} absolute right-0 top-0 h-10 w-10 rounded-full`} />
            </div>
            <div className="space-y-1.5">
              <div className={`${fill} h-4 w-24 rounded`} />
              <div className={`${fill} h-[42px] rounded-xl`} />
            </div>
            <div className="space-y-1.5">
              <div className={`${fill} h-4 w-14 rounded`} />
              <div className={`${fill} h-[52px] rounded-xl`} />
            </div>
            <div className="space-y-1.5">
              <div className={`${fill} h-4 w-10 rounded`} />
              <div className={`${fill} h-[82px] rounded-xl`} />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const tile = `flex flex-col items-center gap-1.5 rounded-xl border border-transparent ${fill} px-1 pb-2 pt-3 text-[11px] font-medium`;

  return (
    <div className="space-y-6">
      <section>
        <div className="space-y-5 lg:grid lg:grid-cols-2 lg:items-start lg:gap-10 lg:space-y-0">
          <Card>
            <div className="grid animate-pulse grid-cols-4 gap-2">
              {["Link", ...PLATFORMS.map((p) => p.label)].map((label, i) => (
                <div key={i} className={tile}>
                  <span className={`${dot} h-5 w-5 rounded-md`} />
                  <span className="w-full truncate text-center text-transparent">{label}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <div className="animate-pulse space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`${fill} h-[58px] rounded-2xl`} />
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-3 min-[1200px]:hidden">
        <div className={`${fill} h-7 w-28 animate-pulse rounded-lg`} />
        <Card>
          <div className="grid animate-pulse grid-cols-4 gap-3 lg:flex lg:flex-col">
            {THEME_LIST.map((t) => (
              <div
                key={t.id}
                className={`flex flex-col items-center gap-2 rounded-2xl border border-transparent ${fill} p-3 text-xs font-medium lg:w-28`}
              >
                <span className={`${dot} h-10 w-10 rounded-full`} />
                <span className="text-transparent">{t.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const { profile, update, load } = useProfile();
  const { ready, loggedIn } = useAuth();
  const router = useRouter();
  const [previewOpen, setPreviewOpen] = useState(false);
  const started = useRef(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
                <PhoneSlot />
              </div>
            </div>
          </aside>
        )}

        {!profile && (
          <aside className="hidden lg:block">
            <div className="sticky top-16 -mt-8 flex h-[calc(100dvh-4rem)] items-center pl-10">
              <div className="absolute left-[calc(80px_+_var(--pw))] top-6 hidden w-28 min-[1200px]:block">
                <div className="flex animate-pulse flex-col gap-3">
                  {THEME_LIST.map((t) => (
                    <div
                      key={t.id}
                      className="flex w-28 flex-col items-center gap-2 rounded-2xl border border-transparent bg-neutral-200 p-3 text-xs font-medium dark:bg-neutral-800"
                    >
                      <span className="h-10 w-10 rounded-full bg-neutral-300/70 dark:bg-neutral-700" />
                      <span className="text-transparent">{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="shrink-0 animate-pulse bg-neutral-200 dark:bg-neutral-800"
                style={{ width: "var(--pw)", aspectRatio: "305 / 640", borderRadius: "14.43% / 6.875%" }}
              />
            </div>
          </aside>
        )}
      </main>

      {profile && mounted && createPortal(
        <>
          <button
            onClick={() => setPreviewOpen(true)}
            className={`${primaryBtn} fixed bottom-5 left-1/2 z-30 -translate-x-1/2 shadow-lg lg:hidden`}
          >
            <FiEye /> Preview
          </button>
          {previewOpen && (
            <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 px-4 pb-24 pt-4 backdrop-blur-sm lg:hidden">
              <button
                onClick={() => setPreviewOpen(false)}
                aria-label="Close preview"
                className={`${closeBtn} fixed bottom-5 left-1/2 -translate-x-1/2`}
              >
                <FiX className="transition-transform group-hover:rotate-90" />
              </button>
              <MyPhone profile={profile} onUpdate={update} />
            </div>
          )}
        </>,
        document.body
      )}
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}