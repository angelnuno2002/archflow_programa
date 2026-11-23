"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { signIn } from "@/lib/auth";
import { sendEmail, escapeHtml } from "@/lib/email";

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Correo inválido"),
  role: z.enum(["CLIENTE", "ARQUITECTO", "ADMIN"], { message: "Elige qué eres" }),
});

export async function register(formData: FormData) {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const { email, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({ data: { email, role, status: "PENDIENTE" } });

    if (process.env.ADMIN_EMAIL) {
      const url = `${process.env.APP_URL ?? "http://localhost:3000"}/solicitudes`;
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: "Nueva solicitud de registro en ArchFlow",
        html: `<p>${escapeHtml(email)} pidió acceso como <strong>${role}</strong>.</p><p><a href="${url}">Revisar solicitudes</a></p>`,
      }).catch(console.error);
    }
  }

  // Envía el enlace de acceso: así se verifica que el correo es suyo
  await signIn("resend", { email, redirectTo: "/dashboard" });
}