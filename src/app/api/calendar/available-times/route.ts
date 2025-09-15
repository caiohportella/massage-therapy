import { NextResponse } from "next/server";
import { getAvailableSlotsForDate } from "@/lib/schedule";
import { parseISO } from "date-fns";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date");

  if (!dateStr) {
    return NextResponse.json(
      { error: "Parâmetro 'date' é obrigatório (yyyy-MM-dd)" },
      { status: 400 }
    );
  }

  const date = parseISO(dateStr);
  // console.log("available-times: Date object created from param:", date.toDateString(), date.toISOString());

  const available = await getAvailableSlotsForDate(date);
  // console.log("available-times: Slots returned by getAvailableSlotsForDate:", available);

  return NextResponse.json({ available });
}
