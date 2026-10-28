import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth-actions";

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

async function ProjectList() {
  const user = await requireUser();
  const memberships = await prisma.projectMember.findMany({
    where: { userId: user.id, project: { status: "ACTIVO" } },
    include: { project: true },
    orderBy: { project: { createdAt: "desc" } },
  });

  if (memberships.length === 0) return <p>Aún no tienes proyectos.</p>;

  return (
    <ul className="grid gap-3">
      {memberships.map(({ project, role }) => (
        <li key={project.id}>
          <Link
            href={`/projects/${project.id}`}
            className="block rounded-lg border p-4 hover:bg-muted"
          >
            <p className="font-medium">{project.name}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
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
    </main>
  );
}