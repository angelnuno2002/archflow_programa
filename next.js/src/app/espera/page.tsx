import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/ui/auth-shell";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { requireSignedIn } from "@/lib/permissions";
import { logout } from "@/lib/auth-actions";

async function Status() {
  const user = await requireSignedIn();
  const me = await prisma.user.findUnique({
    where: { id: user.id },
    select: { status: true },
  });
  if (me?.status === "APROBADO") redirect("/dashboard");
  const rejected = me?.status === "RECHAZADO";

  return (
    <>
      <div className="space-y-2">
        <h1 className="wide text-4xl font-semibold tracking-tight text-grafito">
          {rejected ? "Solicitud rechazada" : "Solicitud en revisión"}
        </h1>
        <p className="text-grafito-2">
          {rejected
            ? "El estudio no aprobó tu acceso. Si crees que es un error, contacta con el estudio."
            : "Un administrador debe confirmar tu registro. Te avisaremos por correo cuando esté listo."}
        </p>
      </div>
      <form action={logout}>
        <Button type="submit" variant="outline">
          Cerrar sesión
        </Button>
      </form>
    </>
  );
}

export default function WaitingPage() {
  return (
    <AuthShell>
      <Suspense fallback={<p>Cargando…</p>}>
        <Status />
      </Suspense>
    </AuthShell>
  );
}