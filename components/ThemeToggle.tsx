"use client";

import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("linkbio:theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200 text-neutral-700 transition hover:bg-neutral-100 active:scale-95 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
    >
      {dark ? <FiSun /> : <FiMoon />}
    </button>
  );
}
