import Link from "next/link";
import { AuthShell } from "@/components/ui/auth-shell";

export default function CheckEmailPage() {
  return (
    <AuthShell>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900">Revisa tu correo</h1>
        <p className="text-neutral-500">
          Te enviamos un enlace para entrar a ArchFlow. Ábrelo desde este mismo navegador.
        </p>
      </div>
      <Link href="/login" className="inline-block text-sm font-medium text-[#1f4b7b] hover:underline">
        ← Usar otro correo
      </Link>
    </AuthShell>
  );
}