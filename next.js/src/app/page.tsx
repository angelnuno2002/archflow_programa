import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

async function Redirector(): Promise<null> {
  const session = await auth();
  redirect(session?.user ? "/projects" : "/login");
  return null;
}

export default function Home() {
  return (
    <Suspense fallback={<p>Cargando…</p>}>
      <Redirector />
    </Suspense>
  );
}