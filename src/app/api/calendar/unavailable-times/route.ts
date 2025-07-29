import { NextRequest, NextResponse } from "next/server";
import { getBusyTimes } from "@/lib/GoogleCalendar";
import { eachDayOfInterval, format } from "date-fns";

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

  // Verifica se a data está dentro dos 20 dias permitidos (conforme regra anterior)
  const today = new Date();
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);

  today.setHours(0, 0, 0, 0);

  const days = eachDayOfInterval({ start: monthStart, end: monthEnd }).filter(
    (day) => day >= today
  );
  const unavailableDates: string[] = [];

  // Checar cada dia individualmente (pode ser paralelo, mas limitado para evitar burst)
  for (const day of days) {
    const formattedDate = format(day, "yyyy-MM-dd");

    try {
      const busy = await getBusyTimes(formattedDate);

      // Regra: se já houverem 5 atendimentos ou mais → dia indisponível
      if (busy.length >= 5) {
        unavailableDates.push(formattedDate);
      }
    } catch (err) {
      console.error(`Erro ao buscar busy times para ${formattedDate}:`, err);
    }
  }

  return NextResponse.json({ unavailable: unavailableDates });
}
