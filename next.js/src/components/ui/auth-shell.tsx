import type { ReactNode } from "react";
import { Logo } from "./logo";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#1f4b7b] p-10 text-white lg:flex">
        <Logo />
        <svg
          viewBox="0 0 360 360"
          className="pointer-events-none absolute -bottom-6 -right-10 h-[27rem] w-[27rem] text-white/20"
          fill="none"
          stroke="currentColor"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M170 30 L320 330 H20 Z" />
          <path d="M95 215 H345" />
          <path d="M300 170 L346 215" />
          <path d="M300 250 L346 215" />
        </svg>
        <p className="relative max-w-sm text-lg leading-snug">
          Renders y planos de tu proyecto, cada versión en su sitio y cada comentario en el punto
          exacto.
        </p>
      </aside>

      <section className="flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-sm space-y-6">
          <Logo className="text-[#1f4b7b] lg:hidden" />
          {children}
        </div>
      </section>
    </main>
  );
}