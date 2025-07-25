import { getAvailableSlotsForDate } from "@/lib/schedule";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get("year") ?? "");
  const month = parseInt(searchParams.get("month") ?? "");

  if (!year || !month) {
    return NextResponse.json(
      { error: "Parâmetros year e month são obrigatórios" },
      { status: 400 }
    );
  }

  const unavailable: string[] = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const datesInMonth = Array.from({ length: 31 }, (_, i) => {
    const date = new Date(year, month - 1, i + 1);
    return date.getMonth() === month - 1 ? date : null;
  }).filter(Boolean) as Date[];

  await Promise.all(
    datesInMonth.map(async (date) => {
      const isoDate = date.toISOString().split("T")[0];

      if (date < today) {
        unavailable.push(isoDate);
        return;
      }

      const available = await getAvailableSlotsForDate(isoDate);

      if (available.length === 0) {
        unavailable.push(isoDate);
      }
    })
  );

  return NextResponse.json({ unavailable });
}
