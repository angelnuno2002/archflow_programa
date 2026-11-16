import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/permissions";
import { restoreProject, deleteProject } from "@/app/projects/actions";
import { Button } from "@/components/ui/button";

export async function ProjectList({ status }: { status: "ACTIVO" | "ARCHIVADO" }) {
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
          className="flex items-center justify-between gap-2 rounded-lg border bg-white p-4"
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