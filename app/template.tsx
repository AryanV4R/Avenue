"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const OUT_MS = 180;

export default function Template({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Template remount na ho (same group ke pages) to page-out class hatao, page-in dobara chalega
  useEffect(() => {
    ref.current?.classList.remove("page-out");
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;

      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return;

      const el = ref.current;
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      el.classList.add("page-out");
      setTimeout(() => router.push(url.pathname + url.search + url.hash), OUT_MS);
    }
    // capture = true, taaki Link ke apne click se pehle chale
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return (
    <div className="page-stage">
      <div ref={ref} className="page-fade">
        {children}
      </div>
    </div>
  );
}