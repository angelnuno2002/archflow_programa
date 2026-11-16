import { prisma } from "@/lib/db";
import type { UserRole } from "@/generated/prisma/enums";

export const ROLE_LABEL: Record<UserRole, string> = {
  SUPER_ADMIN: "Super admin",
  ADMIN: "Administrador",
  ARQUITECTO: "Arquitecto",
  CLIENTE: "Cliente",
};

export async function getUserInfo(userId: string) {
  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, role: true },
  });
  const role = me?.role ?? "CLIENTE";
  return { name: me?.name ?? null, role, tier: ROLE_LABEL[role], isStaff: role !== "CLIENTE" };
}