import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

async function SessionInfo() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <p>Sesión iniciada como {session.user.email}</p>;
}

export default function DashboardPage() {
  return (
    <main className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <Suspense fallback={<p>Cargando…</p>}>
        <SessionInfo />
      </Suspense>
      <div className="flex gap-2">
        <Link
          href="/projects"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Ir a proyectos
        </Link>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <Button type="submit" variant="outline">
            Cerrar sesión
          </Button>
        </form>
      </div>
    </main>
  );
}