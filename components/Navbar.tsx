"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavLinks from "@/components/NavLinks";
import ThemeToggle from "@/components/ThemeToggle";
import UserMenu from "@/components/UserMenu";
import { ghostBtn, primaryBtn } from "@/components/ui";
import { APP_NAME } from "@/lib/config";
import { useAuth } from "@/lib/auth-context";

const bar = "animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800";

export default function Navbar() {
  const path = usePathname();
  const { ready, loggedIn, profile } = useAuth();

  const show = path === "/" || path.startsWith("/dashboard") || path === "/profile";
  if (!show) return null;

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-neutral-50/70 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/70">
      <nav className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 sm:px-8">
        <div className="flex min-w-0 items-center">
          <Link href="/" className="font-display text-lg font-semibold tracking-tight">
            {APP_NAME}
            <span className="text-accent">.</span>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-1 sm:gap-2">
          {!ready && <div className={`${bar} h-9 w-40`} />}
          {ready && loggedIn && <NavLinks handle={profile?.handle || null} />}
        </div>

        <div className="flex items-center justify-end gap-2">
          <div id="nav-extra" className="flex items-center" />
          <ThemeToggle />
          {!ready && <div className={`${bar} h-9 w-9`} />}
          {ready && loggedIn && <UserMenu />}
          {ready && !loggedIn && (
            <>
              <Link href="/signin" className={ghostBtn}>
                Sign in
              </Link>
              <Link href="/signup" className={primaryBtn}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}