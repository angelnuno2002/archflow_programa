import { Suspense, type ReactNode } from "react";
import { requireUser } from "@/lib/permissions";
import { getUserInfo } from "@/lib/user-info";
import { AppHeader } from "./app-header";
import { Logo } from "./logo";
import { requireSignedIn } from "@/lib/permissions";

async function Header() {
  const user = await requireSignedIn();
  const info = await getUserInfo(user.id);
  const email = user.email;

  return (
    <AppHeader
    email={email}
    tier={info.tier}
    showClients={info.isStaff}
    showRequests={info.role === "SUPER_ADMIN"}
  />
);
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Suspense
        fallback={
          <header className="border-b bg-white px-6 py-4">
            <Logo className="text-[#1f4b7b]" />
          </header>
        }
      >
        <Header />
      </Suspense>
      <main className="mx-auto max-w-6xl space-y-8 p-6">{children}</main>
    </div>
  );
}