const TZ = "America/Mexico_City";

function todayISO() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
}

export function daysUntil(due: Date) {
  const dueDay = Date.parse(`${due.toISOString().slice(0, 10)}T00:00:00Z`);
  const today = Date.parse(`${todayISO()}T00:00:00Z`);
  return Math.round((dueDay - today) / 86_400_000);
}

export type DueTone = "red" | "yellow" | "green";

// Pasada → rojo, 7 días o menos → amarillo, más de 7 → verde
export function dueTone(days: number): DueTone {
  if (days < 0) return "red";
  if (days <= 7) return "yellow";
  return "green";
}

export function formatDay(date: Date) {
  return date.toLocaleDateString("es-MX", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hourCycle: "h23", timeZone: TZ }).format(
      new Date(),
    ),
  );
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}