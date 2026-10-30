import type { ReactNode } from "react";

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
      {description && <p className="mt-1.5 text-sm text-neutral-500">{description}</p>}
    </div>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-card sm:p-5 dark:border-neutral-800 dark:bg-neutral-900">
      {children}
    </section>
  );
}
