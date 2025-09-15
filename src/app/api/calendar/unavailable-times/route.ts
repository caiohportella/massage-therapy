import { NextRequest, NextResponse } from "next/server";
import { eachDayOfInterval, format, parseISO } from "date-fns";
import { getAvailableSlotsForDate } from "@/lib/schedule";

export async function GET(req: NextRequest) {
  const url = new URL(
    req.url,
    `http://${req.headers.get("host") || "localhost:3000"}`
  );
  const searchParams = url.searchParams;
  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month")); // 1-indexed

  if (!year || !month) {
    return NextResponse.json(
      { error: "Parâmetros 'year' e 'month' são obrigatórios." },
      { status: 400 }
    );
  }

  const today = new Date();
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);

  today.setHours(0, 0, 0, 0);

  const days = eachDayOfInterval({ start: monthStart, end: monthEnd }).filter(
    (day) => parseISO(format(day, "yyyy-MM-dd")) >= today // Use parseISO to ensure correct date comparison
  );
  const unavailableDates: string[] = [];

  for (const day of days) {
    const formattedDate = format(day, "yyyy-MM-dd");

    try {
      const availableSlots = await getAvailableSlotsForDate(day);

      if (availableSlots.length === 0) {
        unavailableDates.push(formattedDate);
      }
    } catch (error) { // Changed 'err' to 'error' and used it
      console.error(`Erro ao buscar slots disponíveis para ${formattedDate}:`, error);
    }
  }

  // console.log("API /unavailable-times returning:", { unavailable: unavailableDates });
  return NextResponse.json({ unavailable: unavailableDates });
}
