import Link from "next/link";
import { FiX } from "react-icons/fi";
import { closeBtn } from "@/components/ui";

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
      className={`${closeBtn} ${showLabel ? "sm:w-auto sm:px-4" : ""}`}
    >
      <FiX className="transition-transform group-hover:rotate-90" />
      {showLabel && <span className="hidden sm:inline">{label}</span>}
    </Link>
  );
}