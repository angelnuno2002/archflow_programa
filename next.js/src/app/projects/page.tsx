import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/permissions";
import { logout } from "@/lib/auth-actions";
import { restoreProject, deleteProject } from "./actions";
import { Button } from "@/components/ui/button";

async function NewProjectLink() {
  const user = await requireUser();
  const me = await prisma.user.findUnique({
    where: { id: user.id },
    select: { isStaff: true },
  });
  if (!me?.isStaff) return null;
  return (
    <Link
      href="/projects/new"
      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
    >
      Nuevo proyecto
    </Link>
  );
}

async function ProjectList({ status }: { status: "ACTIVO" | "ARCHIVADO" }) {
  const user = await requireUser();
  const memberships = await prisma.projectMember.findMany({
    where: { userId: user.id, project: { status } },
    include: { project: true },
    orderBy: { project: { createdAt: "desc" } },
  });

  if (memberships.length === 0) {
    return (
      <p className="text-muted-foreground">
        {status === "ACTIVO" ? "Aún no tienes proyectos." : "No hay proyectos archivados."}
      </p>
    );
  }

  return (
    <ul className="grid gap-3">
      {memberships.map(({ project, role }) => (
        <li
          key={project.id}
          className="flex items-center justify-between gap-2 rounded-lg border p-4"
        >
          <Link href={`/projects/${project.id}`} className="flex-1 hover:underline">
            <p className="font-medium">{project.name}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </Link>

          {status === "ARCHIVADO" && role === "ARQUITECTO" && (
            <div className="flex items-start gap-2">
              <form action={restoreProject.bind(null, project.id)}>
                <Button type="submit" variant="outline">
                  Restaurar
                </Button>
              </form>
              <details className="relative">
                <summary className="cursor-pointer list-none rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                  Eliminar
                </summary>
                <form
                  action={deleteProject.bind(null, project.id)}
                  className="absolute right-0 z-10 mt-2 w-64 space-y-2 rounded-lg border bg-background p-3 shadow-md"
                >
                  <p className="text-sm">
                    Se borrará <strong>{project.name}</strong> con sus fases y su equipo. No se
                    puede deshacer.
                  </p>
                  <Button type="submit" className="w-full bg-red-600 text-white hover:bg-red-700">
                    Sí, eliminar definitivamente
                  </Button>
                </form>
              </details>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            ← Dashboard
          </Link>
          <h1 className="text-2xl font-semibold">Proyectos</h1>
        </div>
        <div className="flex items-center gap-2">
          <Suspense fallback={null}>
            <NewProjectLink />
          </Suspense>
          <form action={logout}>
            <Button type="submit" variant="outline">
              Cerrar sesión
            </Button>
          </form>
        </div>
      </div>

      <section className="space-y-3">
        <Suspense fallback={<p>Cargando…</p>}>
          <ProjectList status="ACTIVO" />
        </Suspense>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Archivados</h2>
        <Suspense fallback={<p>Cargando…</p>}>
          <ProjectList status="ARCHIVADO" />
        </Suspense>
      </section>
    </main>
  );
}