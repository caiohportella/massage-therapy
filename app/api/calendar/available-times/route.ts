import { NextResponse } from "next/server";
import { getAvailableSlotsForDate } from "@/lib/schedule";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { error: "Parâmetro 'date' é obrigatório (yyyy-MM-dd)" },
      { status: 400 }
    );
  }

  const available = await getAvailableSlotsForDate(date);

  return NextResponse.json({ available });
}
