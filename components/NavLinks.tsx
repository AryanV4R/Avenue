"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiExternalLink, FiGrid, FiHome } from "react-icons/fi";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition active:scale-[0.98] sm:px-4";
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
      on: path.startsWith("/dashboard") || path === "/profile",
    },
  ];
  if (handle) {
    items.push({
      href: `/${handle}`,
      label: "My Page",
      icon: FiExternalLink,
      on: path === `/${handle}`,
    });
  }

  return (
    <>
      {items.map(({ href, label, icon: Icon, on }) => (
        <Link
          key={href}
          href={href}
          aria-label={label}
          aria-current={on ? "page" : undefined}
          className={cn(base, on ? active : idle)}
        >
          <Icon size={16} />
          <span className="hidden sm:inline">{label}</span>
        </Link>
      ))}
    </>
  );
}