import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/permissions";
import { getUserInfo } from "@/lib/user-info";
import { AppShell } from "@/components/ui/app-shell";
import { ProjectList } from "@/components/ui/project-list";
import { daysUntil, dueTone, formatDay, greeting, type DueTone } from "@/lib/date";

// Mientras no existan versiones (entrega 2), la tabla muestra filas de ejemplo.
// Ponlo en false para ver el estado vacío real.
const SHOW_SAMPLES = true;

const SAMPLE_WAITING = [
  { id: "s1", name: "Fachada norte", project: "Residencia Los Pinos", version: 3, waitDays: 9 },
  { id: "s2", name: "Planta baja", project: "Residencia Los Pinos", version: 2, waitDays: 4 },
  { id: "s3", name: "Vestíbulo de acceso", project: "Torre Comercial Central", version: 1, waitDays: 1 },
];

const TONES: Record<DueTone, string> = {
  red: "bg-red-100 text-red-800",
  yellow: "bg-amber-100 text-amber-800",
  green: "bg-green-100 text-green-800",
};

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function Stat({ label, value, className = "" }: { label: string; value: number; className?: string }) {
  return (
    <div className="p-4">
      <p className="text-sm text-neutral-600">{label}</p>
      <p className={`text-4xl font-bold ${className}`}>{value}</p>
    </div>
  );
}

function VersionBadge({ n }: { n: number }) {
  return (
    <span className="relative inline-flex h-8 w-9 items-center justify-center text-[#1f4b7b]">
      <svg
        viewBox="0 0 36 32"
        className="absolute inset-0 h-full w-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M18 3 L34 29 H2 Z" />
      </svg>
      <span className="relative mt-2 text-sm font-semibold">{n}</span>
    </span>
  );
}

async function DashboardContent() {
  const user = await requireUser();
  const email = user.email ?? "";
  const info = await getUserInfo(user.id, email);

  const memberships = await prisma.projectMember.findMany({
    where: { userId: user.id, project: { status: "ACTIVO" } },
    select: {
      project: {
        select: {
          id: true,
          name: true,
          phases: { select: { id: true, name: true, dueDate: true } },
        },
      },
    },
  });

  const phases = memberships
    .flatMap(({ project }) =>
      project.phases.map((p) => ({
        id: p.id,
        name: p.name,
        projectId: project.id,
        projectName: project.name,
        dueDate: p.dueDate,
        days: daysUntil(p.dueDate),
      })),
    )
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  const activeProjects = memberships.length;
  const dueSoon = phases.filter((p) => p.days >= 0 && p.days <= 7).length;
  const waiting = SHOW_SAMPLES ? SAMPLE_WAITING : [];
  const displayName = info.name ?? email.split("@")[0];

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            {greeting()}, {displayName}
          </h1>
          <p className="mt-1 text-neutral-600">
            Tienes {plural(activeProjects, "proyecto activo", "proyectos activos")} y{" "}
            {plural(dueSoon, "entrega", "entregas")} en los próximos 7 días.
          </p>
        </div>
        <button
          type="button"
          disabled
          title="Disponible en la entrega 2"
          className="rounded-lg bg-[#1f4b7b] px-5 py-3 text-sm font-semibold text-white opacity-60"
        >
          ⬆ Subir archivos
        </button>
      </div>

      <section className="grid grid-cols-2 divide-x divide-y rounded-xl border bg-white lg:grid-cols-4 lg:divide-y-0">
        <Stat label="Proyectos activos" value={activeProjects} />
        <Stat label="Esperando al cliente" value={waiting.length} className="text-[#1f6fb5]" />
        <Stat label="Requieren cambios" value={0} className="text-amber-700" />
        <Stat label="Entregas en 7 días" value={dueSoon} className="text-red-800" />
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <section className="space-y-3">
          <h2 className="text-xl font-bold">Esperando al cliente</h2>
          {waiting.length === 0 ? (
            <p className="text-neutral-500">Aún no hay entregables esperando al cliente.</p>
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="text-neutral-600">
                    <tr className="border-b">
                      <th className="p-3 font-normal">Entregable</th>
                      <th className="p-3 font-normal">Versión</th>
                      <th className="p-3 font-normal">Espera</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waiting.map((row) => (
                      <tr key={row.id} className="border-b last:border-0">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="h-10 w-14 shrink-0 rounded border bg-white"
                              aria-hidden
                            />
                            <div>
                              <p className="font-semibold">{row.name}</p>
                              <p className="text-neutral-500">{row.project}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <VersionBadge n={row.version} />
                        </td>
                        <td
                          className={`p-3 font-semibold ${row.waitDays > 7 ? "text-red-800" : ""}`}
                        >
                          {plural(row.waitDays, "día", "días")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-neutral-500">
                Datos de ejemplo hasta que existan las versiones (entrega 2).
              </p>
            </>
          )}
        </section>

        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="text-xl font-bold">Fechas de entrega</h2>
            {phases.length === 0 ? (
              <p className="text-neutral-500">Aún no hay fechas de entrega.</p>
            ) : (
              <ul className="space-y-2">
                {phases.slice(0, 6).map((phase) => (
                  <li key={phase.id} className="flex items-center gap-3 border-b pb-2 last:border-0">
                    <div
                      className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-md ${TONES[dueTone(phase.days)]}`}
                    >
                      <span className="text-xl font-bold leading-none">
                        {phase.days < 0 ? `−${Math.abs(phase.days)}` : phase.days}
                      </span>
                      <span className="text-xs font-semibold">
                        {Math.abs(phase.days) === 1 ? "día" : "días"}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{phase.name}</p>
                      <p className="truncate text-sm text-neutral-500">
                        {phase.projectName} · {formatDay(phase.dueDate)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">Actividad reciente</h2>
            <p className="text-neutral-500">
              Aquí aparecerán los comentarios y las aprobaciones de tus proyectos.
            </p>
          </section>
        </div>
      </div>

      <section className="space-y-3 border-t pt-6">
        <h2 className="text-xl font-bold">Archivados</h2>
        <Suspense fallback={<p>Cargando…</p>}>
          <ProjectList status="ARCHIVADO" />
        </Suspense>
      </section>
    </>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <Suspense fallback={<p>Cargando…</p>}>
        <DashboardContent />
      </Suspense>
    </AppShell>
  );
}