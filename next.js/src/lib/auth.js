import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  pages: { signIn: "/login" },
  providers: [
    Resend({
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier, url, provider }) {
        if (process.env.NODE_ENV === "development") {
          console.log(`\nEnlace de acceso para ${identifier}:\n${url}\n`);
          return;
        }
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: provider.from,
            to: identifier,
            subject: "Tu acceso a ArchFlow",
            html: `<p>Entra a ArchFlow: <a href="${url}">iniciar sesión</a></p>`,
          }),
        });
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase();
      if (!email) return false;
      if (email === process.env.ADMIN_EMAIL?.toLowerCase()) return true;
      return !!(await prisma.user.findUnique({ where: { email } }));
    },
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});