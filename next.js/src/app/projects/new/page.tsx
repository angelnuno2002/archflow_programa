import { Suspense } from "react";
import { requireStaff } from "@/lib/permissions";
import { createProject } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function StaffOnly({ children }: { children: React.ReactNode }) {
  await requireStaff();
  return <>{children}</>;
}

export default function NewProjectPage() {
  return (
    <main className="mx-auto max-w-md space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Nuevo proyecto</h1>
      <Suspense fallback={<p>Cargando…</p>}>
        <StaffOnly>
          <form action={createProject} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" required minLength={3} maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Input id="description" name="description" maxLength={500} />
            </div>
            <Button type="submit">Crear proyecto</Button>
          </form>
        </StaffOnly>
      </Suspense>
    </main>
  );
}