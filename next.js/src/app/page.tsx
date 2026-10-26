import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Entrar a ArchFlow</h1>
      <form
        className="flex flex-col gap-3"
        action={async (formData: FormData) => {
          "use server";
          await signIn("resend", {
            email: formData.get("email") as string,
            redirectTo: "/dashboard",
          });
        }}
      >
        <Input name="email" type="email" placeholder="tu@correo.com" required />
        <Button type="submit">Enviarme el enlace</Button>
      </form>
    </main>
  );
}