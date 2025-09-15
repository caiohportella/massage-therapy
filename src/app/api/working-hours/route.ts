import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Listar todos
export async function GET() {
  const hours = await prisma.workingHours.findMany({
    orderBy: { dayOfWeek: "asc" },
  });
  return NextResponse.json(hours);
}

// Criar ou editar
export async function POST(req: Request) {
  const body = await req.json();
  const { id, dayOfWeek, startTime, endTime } = body;

  if (id) {
    // Atualiza
    const updated = await prisma.workingHours.update({
      where: { id },
      data: { dayOfWeek, startTime, endTime },
    });
    return NextResponse.json(updated);
  } else {
    // Cria
    const created = await prisma.workingHours.create({
      data: { dayOfWeek, startTime, endTime },
    });
    return NextResponse.json(created);
  }
}
