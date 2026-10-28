import type { ProjectRole } from "@/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inviteMember, removeMember } from "../member-actions";

type Member = {
  id: string;
  role: ProjectRole;
  user: { name: string | null; email: string };
};

export function MembersPanel({
  projectId,
  members,
  canInvite,
}: {
  projectId: string;
  members: Member[];
  canInvite: boolean;
}) {
  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {members.map((member) => (
          <li
            key={member.id}
            className="flex items-center justify-between gap-2 rounded-lg border p-3"
          >
            <div>
              <p className="font-medium">{member.user.name ?? member.user.email}</p>
              <p className="text-sm text-muted-foreground">
                {member.user.name && `${member.user.email} · `}
                {member.role}
              </p>
            </div>
            {canInvite && member.role !== "ARQUITECTO" && (
              <form action={removeMember.bind(null, member.id)}>
                <Button type="submit" variant="outline">
                  Quitar
                </Button>
              </form>
            )}
          </li>
        ))}
      </ul>

      {canInvite && (
        <form
          action={inviteMember.bind(null, projectId)}
          className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed p-3"
        >
          <Input
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            required
            className="min-w-56 flex-1"
          />
          <select
            name="role"
            defaultValue="CLIENTE"
            className="h-9 rounded-md border bg-transparent px-3 text-sm"
          >
            <option value="CLIENTE">Cliente</option>
            <option value="COLABORADOR">Colaborador</option>
          </select>
          <Button type="submit">Invitar</Button>
        </form>
      )}
    </div>
  );
}