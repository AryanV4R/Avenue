"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiCheck, FiChevronRight, FiCopy, FiEdit2 } from "react-icons/fi";
import PhonePreview from "@/components/PhonePreview";
import PhoneSlot from "@/components/PhoneSlot";
import ChangeHandleModal from "@/components/ChangeHandleModal";
import Footer from "@/components/Footer";
import { heroBtn, iconBtn } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { DOMAIN } from "@/lib/config";
import { sanitizeHandle, validateHandleFormat } from "@/lib/handle";
import { isHandleAvailable } from "@/lib/storage";
import type { Profile } from "@/lib/types";
/** Sample page shown in the hero phone. Purely decorative, never saved. */
const DEMO: Profile = {
  id: "demo",
  ownerId: "demo",
  handle: "avenue.in",
  displayName: "Avenue",
  bio: "One clean page for all your links and socials.",
  avatar: "",
  theme: "dark",
  socials: [
    { id: "s1", platform: "instagram", value: "avenue" },
    { id: "s2", platform: "youtube", value: "avenue" },
    { id: "s3", platform: "discord", value: "avenue" },
    { id: "s4", platform: "twitch", value: "avenue" },
  ],
  links: [
    { id: "l1", title: "Create your page", url: DOMAIN, enabled: true, clicks: 0 },
    { id: "l2", title: "Claim your handle", url: DOMAIN, enabled: true, clicks: 0 },
    { id: "l3", title: "Share one link everywhere", url: DOMAIN, enabled: true, clicks: 0 },
  ],
  updatedAt: 0,
};

export default function Landing() {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { ready, loggedIn, user, profile: myProfile, setProfile: setMyProfile } = useAuth();
  const myHandle = ready ? myProfile?.handle || null : undefined;
  const [demoAvatar, setDemoAvatar] = useState("");
  const [editingHandle, setEditingHandle] = useState(false);
  const [copied, setCopied] = useState(false);

  async function claim(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!handle) return router.push(loggedIn ? "/dashboard" : "/signup");

    const fmt = validateHandleFormat(handle);
    if (fmt) return setError(fmt);

setBusy(true);
const ok = await isHandleAvailable(handle, myProfile?.id);
setBusy(false);
if (!ok) return setError("That handle is already taken");
if (!loggedIn) {
  try {
    localStorage.setItem("linkbio:pending-handle", handle);
  } catch {}
  return router.push("/signup");
}
router.push(`/dashboard?handle=${handle}`);
  }
  async function copyLink() {
    const url = `${window.location.origin}/${myHandle}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  function handleChanged(p: Profile) {
    setMyProfile(p);
    setEditingHandle(false);
  }
    const checking = loggedIn === null || myHandle === undefined;

  const meta: Record<string, string | undefined> = user?.user_metadata ?? {};
  const accountName: string = meta.full_name || meta.name || user?.email?.split("@")[0] || "";
  const accountAvatar: string = meta.avatar_url || meta.picture || "";
  const phoneProfile: Profile =
    loggedIn
        ? {
            ...DEMO,
            displayName: accountName || DEMO.displayName,
            handle: handle || "handle",
            bio: "Your bio goes here.",
            avatar: accountAvatar,
          }
        : { ...DEMO, avatar: demoAvatar };
  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl grid-rows-[1fr_auto] items-center gap-6 px-5 pb-0 pt-4 sm:px-8 lg:grid-rows-none lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20 lg:py-0">
        <div className="text-left">
          <h1 className="text-balance font-display text-[2.5rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl">
            One link for <span className="text-accent">everything</span> you are.
          </h1>
          <p className="mt-4 max-w-[19rem] text-balance text-[15px] leading-relaxed text-neutral-400 sm:max-w-md lg:mt-5 lg:text-lg lg:text-neutral-500">
            Your socials and links on one clean page.
          </p>

          {myHandle === undefined || loggedIn === null ? (
            <div className="mx-auto mt-8 w-full max-w-md animate-pulse space-y-3 lg:mx-0 lg:mt-10">
              <div className="h-[50px] rounded-full bg-neutral-200/60 dark:bg-neutral-800/60" />
              <div className="h-[52px] rounded-full bg-neutral-200/60 dark:bg-neutral-800/60" />
            </div>
          ) : loggedIn && myHandle ? (
            <div className="mx-auto mt-8 w-full max-w-md space-y-3 lg:mx-0 lg:mt-10">
              <div className="flex items-center rounded-full border border-neutral-200 bg-white pl-5 pr-2 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <span className="min-w-0 flex-1 truncate py-3.5 text-left text-sm">
                  <span className="text-neutral-400">{DOMAIN}/</span>
                  {myHandle}
                </span>
                <button onClick={copyLink} aria-label="Copy page link" className={iconBtn}>
                  {copied ? <FiCheck /> : <FiCopy />}
                </button>
                <button
                  onClick={() => setEditingHandle(true)}
                  aria-label="Change username"
                  className={iconBtn}
                >
                  <FiEdit2 />
                </button>
              </div>
              <Link href="/dashboard" className={`${heroBtn} w-full py-3.5 text-base`}>
                Go to Dashboard <FiChevronRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ) : (
            <form onSubmit={claim} className="mx-auto mt-8 w-full max-w-md space-y-3 lg:mx-0 lg:mt-10">
              <div className="flex items-center rounded-full border border-neutral-200 bg-white pl-5 pr-2 shadow-sm transition focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15 dark:border-neutral-800 dark:bg-neutral-900">
                <span className="text-sm text-neutral-400">{DOMAIN}/</span>
                <input
                  value={handle}
                  onChange={(e) => {
                    setHandle(sanitizeHandle(e.target.value));
                    setError(null);
                  }}
                  placeholder="handle"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="w-full bg-transparent py-3.5 pl-0.5 text-sm outline-none"
                />
              </div>
              {error && <p className="text-left text-sm text-red-500">{error}</p>}
              <button disabled={busy} className={`${heroBtn} w-full py-3.5 text-base`}>
                Claim your handle
              </button>
            </form>
          )}
        </div>

        <div
          className={`relative hidden transition-opacity duration-500 lg:block lg:self-center ${
            checking ? "opacity-0" : "opacity-100"
          }`}
        >
          {loggedIn && myProfile ? (
            <PhoneSlot />
          ) : (
            <PhonePreview
              profile={phoneProfile}
              onAvatarChange={loggedIn ? undefined : setDemoAvatar}
            />
          )}
        </div>

        <div
          aria-hidden
          className="relative h-60 overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)] lg:hidden"
        >
          <PhonePreview
            profile={loggedIn && myProfile ? { ...myProfile, avatar: myProfile.avatar || accountAvatar } : phoneProfile}
          />
        </div>
      </section>
      <Footer />
      {editingHandle && myProfile && user && (
        <ChangeHandleModal
          profile={myProfile}
          userId={user.id}
          onClose={() => setEditingHandle(false)}
          onChanged={handleChanged}
        />
      )}
    </main>
  );
}
