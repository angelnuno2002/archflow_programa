import { Suspense, type ReactNode } from "react";
import { AppShell } from "@/components/ui/app-shell";
import { requireStaff } from "@/lib/permissions";

async function StaffOnly({ children }: { children: ReactNode }) {
  await requireStaff();
  return <>{children}</>;
}

export default function ClientsPage() {
  return (
    <AppShell>
      <h1 className="text-4xl font-bold tracking-tight">Clientes</h1>
      <Suspense fallback={null}>
        <StaffOnly>
          <p className="text-neutral-600">
            Próximamente: aquí verás a los clientes enlazados con tu cuenta.
          </p>
        </StaffOnly>
      </Suspense>
    </AppShell>
  );
}