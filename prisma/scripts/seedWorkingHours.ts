import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

// Helpers
const hour = (h: number, m: number = 0) => h * 60 + m;

const workingHours: { dayOfWeek: number; startTime: number; endTime: number }[] = [
  // Segunda a sexta: manhã (08:00–12:00) e tarde (14:00–18:00)
  ...[1, 2, 3, 4, 5].flatMap((day) => [
    { dayOfWeek: day, startTime: hour(8), endTime: hour(12) },
    { dayOfWeek: day, startTime: hour(14), endTime: hour(20) },
  ]),

  // Sábado: apenas manhã (08:00–12:00)
  { dayOfWeek: 6, startTime: hour(8), endTime: hour(12) },
];

async function main() {
  await prisma.workingHours.deleteMany(); // Limpa todos os horários anteriores
  await prisma.workingHours.createMany({ data: workingHours });
  console.log("Horários inseridos com sucesso.");
}

main()
  .catch((e) => {
    console.error("Erro ao inserir horários:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
