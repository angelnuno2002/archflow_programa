import { Suspense } from "react";
import { AuthShell } from "@/components/ui/auth-she7ll";
import { Button } from "@/components/ui/button";
import { requestLoginLink } from "@/lib/auth-actions";
import Link  from "next/link";

const MESSAGES: Record<string, string> = {
  AccessDenied: "Ese correo no tiene acceso. Usa el correo con el que te invitó el estudio.",
  Verification: "El enlace venció o ya se usó. Pide uno nuevo.",
};

async function ErrorMessage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  if (!error) return null;

  return (
    <p role="alert" className="flex items-start gap-2 text-sm text-amber-800">
      <svg
        viewBox="0 0 20 20"
        className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden
      >
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6v5M10 14v.01" />
      </svg>
      <span>{MESSAGES[error] ?? "No pudimos enviarte el enlace. Inténtalo de nuevo."}</span>
    </p>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <AuthShell>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900">Entra a tu cuenta</h1>
        <p className="text-neutral-500">Usa el correo con el que te invitó el estudio.</p>
      </div>

      <form action={requestLoginLink} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-neutral-900">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="tu@correo.com"
            className="h-12 w-full rounded-lg border border-neutral-300 bg-white px-4 text-base outline-none focus:border-[#1f4b7b] focus:ring-2 focus:ring-[#1f4b7b]/20"
          />
        </div>

        <Suspense fallback={null}>
          <ErrorMessage searchParams={searchParams} />
        </Suspense>

        <Button
          type="submit"
          className="h-12 w-full rounded-lg bg-[#1f4b7b] text-base font-semibold text-white hover:bg-[#183c63]"
        >
          Entrar
        </Button>

        <p className="text-sm text-neutral-500">
          No necesitas contraseña: te enviamos un enlace de acceso por correo.
        </p>
      </form>

      <form action={requestLoginLink} className="space-y-4">
        {/* ...campo de correo, error y botón Entrar... */}
      </form>

      <p className="text-sm text-neutral-500">
        ¿Primera vez?{" "}
        <Link href="/registro" className="font-medium text-tinta hover:underline">
          Solicita acceso
        </Link>
      </p>
      
    </AuthShell>
    
  );
}