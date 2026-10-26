import { prisma } from "./src/db";

async function main() {
  console.log("Iniciando...");
  const user = await prisma.user.create({
    data: { email: "hola@test.com", name: "Prueba" },
  });
  console.log("Creado:", user);
  console.log("Todos:", await prisma.user.findMany());
}

main()
  .catch((e) => console.error("Error:", e))
  .finally(() => prisma.$disconnect());