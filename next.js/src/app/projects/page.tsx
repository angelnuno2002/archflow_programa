import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/permissions";
import { AppShell } from "@/components/ui/app-shell";
import { ProjectList } from "@/components/ui/project-list";

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
      className="rounded-md bg-[#1f4b7b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#183c63]"
    >
      Nuevo proyecto
    </Link>
  );
}

export default function ProjectsPage() {
  return (
    <AppShell>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-4xl font-bold tracking-tight">Proyectos</h1>
        <Suspense fallback={null}>
          <NewProjectLink />
        </Suspense>
      </div>

      <section className="space-y-3">
        <Suspense fallback={<p>Cargando…</p>}>
          <ProjectList status="ACTIVO" />
        </Suspense>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Archivados</h2>
        <Suspense fallback={<p>Cargando…</p>}>
          <ProjectList status="ARCHIVADO" />
        </Suspense>
      </section>
    </AppShell>
  );
}