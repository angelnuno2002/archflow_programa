import { prisma } from "@/lib/db";

export type UserTier = "Super admin" | "Arquitecto admin" | "Usuario";

export async function getUserInfo(userId: string, email: string) {
  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, isStaff: true },
  });
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const isSuper = !!adminEmail && email.toLowerCase() === adminEmail;
  const tier: UserTier = isSuper ? "Super admin" : me?.isStaff ? "Arquitecto admin" : "Usuario";
  return { name: me?.name ?? null, isStaff: isSuper || !!me?.isStaff, tier };
}