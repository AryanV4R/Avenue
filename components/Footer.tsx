const links = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms" },
  { href: "#", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 px-5 py-6 sm:px-8 dark:border-neutral-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-neutral-500 sm:flex-row">
        <span>© {new Date().getFullYear()} Avenue</span>
        <nav className="flex gap-5">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="transition hover:text-neutral-300">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}