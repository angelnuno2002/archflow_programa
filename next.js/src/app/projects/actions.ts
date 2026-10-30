"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireStaff, requireMember } from "@/lib/permissions";

const createProjectSchema = z.object({
  name: z.string().trim().min(3, "El nombre necesita al menos 3 caracteres").max(100),
  description: z.string().trim().max(500).optional(),
});

const DEFAULT_PHASES = [
  "Anteproyecto",
  "Renders 1ra etapa",
  "Proyecto ejecutivo",
  "Renders finales",
];

export async function createProject(formData: FormData) {
  const user = await requireStaff();

  const parsed = createProjectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const project = await prisma.project.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      members: { create: { userId: user.id, role: "ARQUITECTO" } },
      phases: {
        create: DEFAULT_PHASES.map((name, i) => ({ name, order: i + 1 })),
      },
    },
  });

  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}

export async function archiveProject(projectId: string) {
  await requireMember(projectId, ["ARQUITECTO"]);

  await prisma.project.update({
    where: { id: projectId },
    data: { status: "ARCHIVADO", archivedAt: new Date() },
  });

  revalidatePath("/projects");
  redirect("/projects");
}
export async function restoreProject(projectId: string) {
  await requireMember(projectId, ["ARQUITECTO"]);

  await prisma.project.update({
    where: { id: projectId },
    data: { status: "ACTIVO", archivedAt: null },
  });

  revalidatePath("/projects");
}

export async function deleteProject(projectId: string) {
  const { project } = await requireMember(projectId, ["ARQUITECTO"]);
  if (project.status !== "ARCHIVADO") {
    throw new Error("Solo se pueden eliminar proyectos archivados");
  }

  await prisma.project.delete({ where: { id: projectId } });
  revalidatePath("/projects");
}