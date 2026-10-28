"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireMember } from "@/lib/permissions";

const phaseSchema = z.object({
  name: z.string().trim().min(2, "El nombre necesita al menos 2 caracteres").max(80),
  dueDate: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida")]),
});

// Guardamos la fecha a mediodía UTC para que no se corra de día por la zona horaria
function parseDue(value: string) {
  return value ? new Date(`${value}T12:00:00.000Z`) : null;
}

function parseForm(formData: FormData) {
  const parsed = phaseSchema.safeParse({
    name: formData.get("name"),
    dueDate: formData.get("dueDate") ?? "",
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  return parsed.data;
}

// El proyecto se deduce de la fase en la base de datos, nunca de lo que mande el navegador
async function phaseWithAccess(phaseId: string) {
  const phase = await prisma.phase.findUnique({ where: { id: phaseId } });
  if (!phase) throw new Error("Fase no encontrada");
  await requireMember(phase.projectId, ["ARQUITECTO"]);
  return phase;
}

export async function addPhase(projectId: string, formData: FormData) {
  await requireMember(projectId, ["ARQUITECTO"]);
  const data = parseForm(formData);

  const last = await prisma.phase.aggregate({
    where: { projectId },
    _max: { order: true },
  });

  await prisma.phase.create({
    data: {
      projectId,
      name: data.name,
      order: (last._max.order ?? 0) + 1,
      dueDate: parseDue(data.dueDate),
    },
  });
  revalidatePath(`/projects/${projectId}`);
}

export async function updatePhase(phaseId: string, formData: FormData) {
  const phase = await phaseWithAccess(phaseId);
  const data = parseForm(formData);

  await prisma.phase.update({
    where: { id: phaseId },
    data: { name: data.name, dueDate: parseDue(data.dueDate) },
  });
  revalidatePath(`/projects/${phase.projectId}`);
}

export async function deletePhase(phaseId: string) {
  const phase = await phaseWithAccess(phaseId);

  await prisma.$transaction(async (tx) => {
    await tx.phase.delete({ where: { id: phaseId } });
    // Renumera las que quedan para que el orden sea 1, 2, 3…
    const rest = await tx.phase.findMany({
      where: { projectId: phase.projectId },
      orderBy: { order: "asc" },
    });
    for (const [i, p] of rest.entries()) {
      if (p.order !== i + 1) {
        await tx.phase.update({ where: { id: p.id }, data: { order: i + 1 } });
      }
    }
  });
  revalidatePath(`/projects/${phase.projectId}`);
}

export async function movePhase(phaseId: string, direction: "up" | "down") {
  if (direction !== "up" && direction !== "down") throw new Error("Dirección inválida");
  const phase = await phaseWithAccess(phaseId);

  await prisma.$transaction(async (tx) => {
    const phases = await tx.phase.findMany({
      where: { projectId: phase.projectId },
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });

    const from = phases.findIndex((p) => p.id === phaseId);
    const to = direction === "up" ? from - 1 : from + 1;
    if (from === -1 || to < 0 || to >= phases.length) return;

    // Intercambia la fase con su vecina
    [phases[from], phases[to]] = [phases[to], phases[from]];

    // Renumera todo como 1, 2, 3… según la posición final
    for (const [i, p] of phases.entries()) {
      if (p.order !== i + 1) {
        await tx.phase.update({ where: { id: p.id }, data: { order: i + 1 } });
      }
    }
  });

  revalidatePath(`/projects/${phase.projectId}`);
}