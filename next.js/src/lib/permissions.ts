import { redirect, notFound } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { ProjectRole } from "@/generated/prisma/enums";

// Sesión iniciada, aunque el registro aún no esté aprobado
export async function requireSignedIn() {
  await connection();
  const session = await auth();
  const userId = session?.user?.id;
  if (!session?.user || !userId) redirect("/login");
  return { ...session.user, id: userId };
}

// Sesión iniciada y registro aprobado
export async function requireUser() {
  const user = await requireSignedIn();
  const me = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, status: true },
  });
  if (!me) redirect("/login");
  if (me.status !== "APROBADO") redirect("/espera");
  return { ...user, role: me.role };
}

export async function requireStaff() {
  const user = await requireUser();
  if (user.role === "CLIENTE") notFound();
  return user;
}

export async function requireSuperAdmin() {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN") notFound();
  return user;
}

export async function requireMember(projectId: string, roles?: ProjectRole[]) {
  const user = await requireUser();

  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: user.id } },
    include: { project: true },
  });

  if (!membership) notFound();
  if (roles && !roles.includes(membership.role)) notFound();

  return { user, membership, project: membership.project };
}