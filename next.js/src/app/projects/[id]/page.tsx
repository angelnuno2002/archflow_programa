import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { requireMember } from "@/lib/permissions";
import { archiveProject } from "../actions";
import { Button } from "@/components/ui/button";

async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { project, membership } = await requireMember(id);
  const phases = await prisma.phase.findMany({
    where: { projectId: id },
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        {project.description && <p className="text-muted-foreground">{project.description}</p>}
        <p className="text-sm text-muted-foreground">Tu rol: {membership.role}</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Fases</h2>
        <ol className="space-y-2">
          {phases.map((phase) => (
            <li key={phase.id} className="rounded-lg border p-3">
              {phase.order}. {phase.name}
              {phase.dueDate && (
                <span className="text-sm text-muted-foreground">
                  {" "}· entrega {phase.dueDate.toLocaleDateString("es-MX")}
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>

      {membership.role === "ARQUITECTO" && (
        <form action={archiveProject.bind(null, project.id)}>
          <Button type="submit" variant="outline">Archivar proyecto</Button>
        </form>
      )}
    </div>
  );
}

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Suspense fallback={<p>Cargando…</p>}>
        <ProjectDetail params={params} />
      </Suspense>
    </main>
  );
}