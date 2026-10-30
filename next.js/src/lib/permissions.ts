import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { ProjectRole } from "@/generated/prisma/enums";
import { connection } from "next/server";

export async function requireUser() {
  await connection();
  const session = await auth();
  const userId = session?.user?.id;
  if (!session?.user || !userId) redirect("/login");
  return { ...session.user, id: userId };
}
export async function requireStaff() {
  const user = await requireUser();
  const me = await prisma.user.findUnique({
    where: { id: user.id },
    select: { isStaff: true },
  });
  if (!me?.isStaff) notFound();
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