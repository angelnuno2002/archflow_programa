import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { requireMember } from "@/lib/permissions";
import { archiveProject } from "../actions";
import { PhasesEditor } from "./phases-editor";
import { MembersPanel } from "./members-panel";
import { Button } from "@/components/ui/button";


function formatDate(date: Date) {
  return date.toLocaleDateString("es-MX", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { project, membership } = await requireMember(id);
  const isArchitect = membership.role === "ARQUITECTO";
  const isClient = membership.role === "CLIENTE";

  const phases = await prisma.phase.findMany({
    where: { projectId: id },
    orderBy: { order: "asc" },
  });
  const members = isClient
    ? []
    : await prisma.projectMember.findMany({
        where: { projectId: id },
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "asc" },
      });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        {project.description && (
          <p className="text-muted-foreground">{project.description}</p>
        )}
        <p className="text-sm text-muted-foreground">Tu rol: {membership.role}</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Fases</h2>
        {isArchitect ? (
          <PhasesEditor projectId={project.id} phases={phases} />
        ) : (
          <ol className="space-y-2">
            {phases.map((phase) => (
              <li key={phase.id} className="rounded-lg border p-3">
                {phase.order}. {phase.name}
                {phase.dueDate && (
                  <span className="text-sm text-muted-foreground">
                    {" "}· entrega {formatDate(phase.dueDate)}
                  </span>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

      {!isClient && (
        <section className="space-y-2">
          <h2 className="text-lg font-medium">Equipo y cliente</h2>
          <MembersPanel
            projectId={project.id}
            members={members}
            canInvite={isArchitect}
          />
        </section>
      )}

      {isArchitect && (
        <form action={archiveProject.bind(null, project.id)}>
          <Button type="submit" variant="outline">
            Archivar proyecto
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Suspense fallback={<p>Cargando…</p>}>
        <ProjectDetail params={params} />
      </Suspense>
    </main>
  );
}