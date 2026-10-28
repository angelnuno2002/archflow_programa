"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireMember } from "@/lib/permissions";
import { sendEmail, escapeHtml } from "@/lib/email";

const inviteSchema = z.object({
  email: z.string().trim().toLowerCase().email("Correo inválido"),
  role: z.enum(["CLIENTE", "COLABORADOR"]),
});

export async function inviteMember(projectId: string, formData: FormData) {
  const { project } = await requireMember(projectId, ["ARQUITECTO"]);

  const parsed = inviteSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const { email, role } = parsed.data;

  const invited = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  const existing = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: invited.id } },
  });
  if (existing) throw new Error("Esa persona ya es miembro del proyecto");

  await prisma.projectMember.create({
    data: { projectId, userId: invited.id, role },
  });

  const loginUrl = `${process.env.APP_URL ?? "http://localhost:3000"}/login`;
  try {
    await sendEmail({
      to: email,
      subject: `Te invitaron al proyecto ${project.name}`,
      html: `<p>Te invitaron a colaborar en el proyecto <strong>${escapeHtml(project.name)}</strong> en ArchFlow.</p>
<p>Entra con este mismo correo y recibirás un enlace de acceso:</p>
<p><a href="${loginUrl}">${loginUrl}</a></p>`,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Se añadió a la persona, pero no se pudo enviar el correo de invitación");
  }

  revalidatePath(`/projects/${projectId}`);
}

export async function removeMember(memberId: string) {
  const member = await prisma.projectMember.findUnique({ where: { id: memberId } });
  if (!member) throw new Error("Miembro no encontrado");

  await requireMember(member.projectId, ["ARQUITECTO"]);
  if (member.role === "ARQUITECTO") throw new Error("No se puede quitar a un arquitecto");

  await prisma.projectMember.delete({ where: { id: memberId } });
  revalidatePath(`/projects/${member.projectId}`);
}