"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/permissions";
import { sendEmail } from "@/lib/email";

async function decide(userId: string, status: "APROBADO" | "RECHAZADO") {
  await requireSuperAdmin();

  // Solo actúa sobre solicitudes todavía pendientes
  const user = await prisma.user.update({
    where: { id: userId, status: "PENDIENTE" },
    data: { status },
  });

  const url = `${process.env.APP_URL ?? "http://localhost:3000"}/login`;
  await sendEmail({
    to: user.email,
    subject: status === "APROBADO" ? "Tu acceso a ArchFlow fue aprobado" : "Tu solicitud en ArchFlow",
    html:
      status === "APROBADO"
        ? `<p>Ya puedes entrar a ArchFlow: <a href="${url}">iniciar sesión</a></p>`
        : `<p>Tu solicitud de acceso no fue aprobada.</p>`,
  }).catch(console.error);

  revalidatePath("/solicitudes");
}

export async function approveUser(userId: string) {
  await decide(userId, "APROBADO");
}

export async function rejectUser(userId: string) {
  await decide(userId, "RECHAZADO");
}