import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/permissions";
import { AppShell } from "@/components/ui/app-shell";
import { Button } from "@/components/ui/button";
import { ROLE_LABEL } from "@/lib/user-info";
import { approveUser, rejectUser } from "@/lib/admin-actions";

async function Requests() {
  await requireSuperAdmin();
  const pending = await prisma.user.findMany({
    where: { status: "PENDIENTE" },
    orderBy: { createdAt: "asc" },
  });

  if (pending.length === 0) {
    return <p className="text-grafito-2">No hay solicitudes pendientes.</p>;
  }

  return (
    <ul className="grid gap-3">
      {pending.map((u) => (
        <li
          key={u.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-linea bg-white p-4"
        >
          <div>
            <p className="font-semibold">{u.email}</p>
            <p className="text-sm text-grafito-2">
              Pide acceso como {ROLE_LABEL[u.role]} · {u.createdAt.toLocaleDateString("es-MX")} ·{" "}
              {u.emailVerified ? "correo verificado" : "correo sin verificar"}
            </p>
          </div>
          <div className="flex gap-2">
            <form action={approveUser.bind(null, u.id)}>
              <Button type="submit">Aprobar</Button>
            </form>
            <form action={rejectUser.bind(null, u.id)}>
              <Button type="submit" variant="outline">
                Rechazar
              </Button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function RequestsPage() {
  return (
    <AppShell>
      <h1 className="wide text-4xl font-semibold tracking-tight">Solicitudes</h1>
      <Suspense fallback={<p>Cargando…</p>}>
        <Requests />
      </Suspense>
    </AppShell>
  );
}