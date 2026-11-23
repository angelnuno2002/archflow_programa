"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { logout } from "@/lib/auth-actions";
import { Logo } from "./logo";

export function AppHeader({
  email,
  tier,
  showClients,
  showRequests,
}: {
  email: string;
  tier: string;
  showClients: boolean;
  showRequests: boolean;
  
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const initials = email.slice(0, 2).toUpperCase();
  const linkClass = "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-neutral-100";

  return (
    <>
      <header className="border-b bg-white px-6 py-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="side-panel"
          aria-label="Abrir menú"
          className="text-[#1f4b7b] hover:opacity-80"
        >
          <Logo />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)} aria-hidden />
      )}

      <aside
        id="side-panel"
        inert={!open}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-xl transition-transform duration-200 ${
         open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1f4b7b] text-sm font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium" title={email}>
              {email}
            </p>
            <span className="mt-1 inline-block rounded-full bg-[#1f4b7b]/10 px-2 py-0.5 text-xs font-semibold text-[#1f4b7b]">
              {tier}
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          <Link href="/dashboard" onClick={() => setOpen(false)} className={linkClass}>
            Panel
          </Link>
          <Link href="/projects" onClick={() => setOpen(false)} className={linkClass}>
            Proyectos
          </Link>
          {showClients && (
            <Link href="/clients" onClick={() => setOpen(false)} className={linkClass}>
              Clientes
            
          {showRequests && (
          <Link href="/solicitudes" onClick={() => setOpen(false)} className={linkClass}>
            Solicitudes
        </Link>
)}
              
            </Link>
            
            
          )}
        </nav>

        <form action={logout} className="border-t p-3">
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Cerrar sesión
          </button>
        </form>
      </aside>
    </>
  );
}