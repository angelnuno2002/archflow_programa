import Link from "next/link";
import { AuthShell } from "@/components/ui/auth-shell";
import { Button } from "@/components/ui/button";
import { register } from "@/lib/register-actions";

const ROLES = [
  { value: "CLIENTE", title: "Cliente", text: "Reviso y apruebo los renders de mi proyecto." },
  { value: "ARQUITECTO", title: "Arquitecto", text: "Subo versiones y atiendo comentarios." },
  { value: "ADMIN", title: "Administrador", text: "Coordino los proyectos y el equipo del estudio." },
];

export default function RegisterPage() {
  return (
    <AuthShell>
      <div className="space-y-2">
        <h1 className="wide text-4xl font-semibold tracking-tight text-grafito">Solicita acceso</h1>
        <p className="text-grafito-2">Un administrador revisará tu solicitud.</p>
      </div>

      <form action={register} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-grafito">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="tu@correo.com"
            className="h-12 w-full rounded-md border border-linea bg-white px-4 text-base outline-none focus:border-tinta focus:ring-2 focus:ring-tinta/20"
          />
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-grafito">¿Qué eres?</legend>
          {ROLES.map((r) => (
            <label key={r.value} className="block cursor-pointer">
              <input type="radio" name="role" value={r.value} required className="peer sr-only" />
              <span className="block rounded-md border border-linea bg-white p-3 peer-checked:border-tinta peer-checked:ring-2 peer-checked:ring-tinta/20 peer-focus-visible:ring-2 peer-focus-visible:ring-tinta/40">
                <span className="block font-semibold">{r.title}</span>
                <span className="block text-sm text-grafito-2">{r.text}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <Button type="submit" className="h-12 w-full text-base font-semibold">
          Continuar
        </Button>
        <p className="text-sm text-grafito-2">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-tinta hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}