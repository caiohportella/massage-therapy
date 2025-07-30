import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const bookings = await prisma.booking.findMany({
    orderBy: { date: "desc" },
    include: {
      user: true,
      services: { include: { service: true } },
      reminderLogs: true,
    },
  });

  return NextResponse.json(bookings);
}
