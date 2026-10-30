"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiUser, FiGrid, FiHome, FiSettings } from "react-icons/fi";
import { cn } from "@/lib/utils";

const base =
  "inline-flex h-9 items-center justify-center gap-2 rounded-full px-3 text-sm font-medium transition active:scale-[0.98] sm:px-4";
const idle =
  "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-900 dark:hover:text-white";
const active = "bg-accent/15 text-accent";

export default function NavLinks({ handle }: { handle?: string | null }) {
  const path = usePathname();

  const items = [
    { href: "/", label: "Home", icon: FiHome, on: path === "/" },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: FiGrid,
      on: path.startsWith("/dashboard"),
    },
    {
      href: "/profile",
      label: "Profile",
      icon: FiSettings,
      on: path === "/profile",
      desktopOnly: true,
    },
  ];
  if (handle) {
    items.push({
      href: `/${handle}`,
      label: "My Page",
      icon: FiUser,
      on: path === `/${handle}`,
    });
  }

  return (
    <>
      {items.map(({ href, label, icon: Icon, on, desktopOnly }) => (
        <Link
          key={href}
          href={href}
          aria-label={label}
          aria-current={on ? "page" : undefined}
          className={cn(base, on ? active : idle, desktopOnly && "max-md:hidden")}
        >
          <Icon size={16} />
          <span className="hidden sm:inline">{label}</span>
        </Link>
      ))}
    </>
  );
}