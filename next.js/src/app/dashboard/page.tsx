import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function SessionInfo() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <p>Sesión iniciada como {session.user.email}</p>;
}

export default function DashboardPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <Suspense fallback={<p>Cargando…</p>}>
        <SessionInfo />
      </Suspense>
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
    </main>
  );
}