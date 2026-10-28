import type { Phase } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addPhase, updatePhase, deletePhase, movePhase } from "../phase-actions";

export function PhasesEditor({
  projectId,
  phases,
}: {
  projectId: string;
  phases: Phase[];
}) {
  return (
    <div className="space-y-3">
      {phases.map((phase, index) => (
        <div
          key={phase.id}
          className="flex flex-wrap items-center gap-2 rounded-lg border p-3"
        >
          <div className="flex items-center gap-1">
            <form action={movePhase.bind(null, phase.id, "up")}>
              <Button
                type="submit"
                variant="outline"
                className="px-2"
                disabled={index === 0}
                aria-label="Subir fase"
              >
                ↑
              </Button>
            </form>
            <form action={movePhase.bind(null, phase.id, "down")}>
              <Button
                type="submit"
                variant="outline"
                className="px-2"
                disabled={index === phases.length - 1}
                aria-label="Bajar fase"
              >
                ↓
              </Button>
            </form>
          </div>

          <form
            action={updatePhase.bind(null, phase.id)}
            className="flex flex-1 flex-wrap items-center gap-2"
          >
            <span className="w-6 text-sm font-medium">{phase.order}.</span>
            <Input
              name="name"
              defaultValue={phase.name}
              required
              minLength={2}
              maxLength={80}
              className="min-w-48 flex-1"
            />
            <Input
              name="dueDate"
              type="date"
              defaultValue={phase.dueDate?.toISOString().slice(0, 10) ?? ""}
              className="w-40"
            />
            <Button type="submit">Guardar</Button>
          </form>

          <form action={deletePhase.bind(null, phase.id)}>
            <Button type="submit" variant="outline">
              Eliminar
            </Button>
          </form>
        </div>
      ))}

      <form
        action={addPhase.bind(null, projectId)}
        className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed p-3"
      >
        <Input
          name="name"
          placeholder="Nueva fase"
          required
          minLength={2}
          maxLength={80}
          className="min-w-48 flex-1"
        />
        <Input name="dueDate" type="date" className="w-40" />
        <Button type="submit" variant="outline">
          Añadir fase
        </Button>
      </form>
    </div>
  );
}