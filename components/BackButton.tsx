import Link from "next/link";
import { FiX } from "react-icons/fi";

interface Props {
  href?: string;
  label?: string;
  /** Show the label next to the arrow on sm+ screens (pill style). */
  showLabel?: boolean;
}

export default function BackButton({
  href = "/dashboard",
  label = "Dashboard",
  showLabel = false,
}: Props) {
  return (
    <Link
      href={href}
      aria-label={`Close and go back to ${label}`}
      title={`Close and go back to ${label}`}
      className={`group inline-flex h-10 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-100 active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 ${
        showLabel ? "w-10 sm:w-auto sm:px-4" : "w-10"
      }`}
    >
      <FiX className="transition-transform group-hover:rotate-90" />
      {showLabel && <span className="hidden sm:inline">{label}</span>}
    </Link>
  );
}