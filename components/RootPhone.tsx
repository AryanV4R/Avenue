"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import MyPhone from "@/components/MyPhone";
import { useProfile } from "@/lib/profile-context";

const GLIDE =
  "left 350ms cubic-bezier(0.22, 1, 0.36, 1), top 350ms cubic-bezier(0.22, 1, 0.36, 1)";

/** Poori site me ek hi phone. Route badalne pe remount nahi hota, bas slot pe move hota hai. */
export default function RootPhone() {
  const { profile, update } = useProfile();
  const path = usePathname();
  const on = path === "/" || path.startsWith("/dashboard") || path === "/profile";
  const box = useRef<HTMLDivElement>(null);
  const placed = useRef(false);

  useEffect(() => {
    let raf = 0;
    let want = false; // agle sync me glide chahiye ya nahi

    const run = () => {
      const el = box.current;
      if (!el) return;
      const r = document.getElementById("phone-slot")?.getBoundingClientRect();
      if (!r || !r.width) {
        el.style.visibility = "hidden";
        placed.current = false;
        want = false;
        return;
      }
      // Page animation chal rahi ho to slot transform ke saath hil raha hota hai, ruko
      const moving = document
        .querySelector(".page-fade")
        ?.getAnimations()
        .some((a) => a.playState === "running");
      if (moving) return;

      el.style.transition = want && placed.current ? GLIDE : "none";
      el.style.left = r.left + "px";
      el.style.top = r.top + "px";
      el.style.visibility = "visible";
      placed.current = true;
      want = false;
    };

    const queue = (glide: boolean) => {
      want = want || glide;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(run);
    };

    const onSlot = () => queue(true);
    const onScroll = () => queue(false);
    const onAnimEnd = (e: Event) => {
      if ((e.target as Element).classList?.contains("page-fade")) queue(true);
    };

    const ro = new ResizeObserver(() => queue(false));
    ro.observe(document.body);
    window.addEventListener("phone-slot", onSlot);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("animationend", onAnimEnd, true);
    document.addEventListener("animationcancel", onAnimEnd, true);
    queue(false);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("phone-slot", onSlot);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("animationend", onAnimEnd, true);
      document.removeEventListener("animationcancel", onAnimEnd, true);
    };
  }, []);

  return (
    <div ref={box} className={`invisible fixed z-20 ${on ? "" : "hidden"}`}>
      {profile && <MyPhone profile={profile} onUpdate={update} />}
    </div>
  );
}