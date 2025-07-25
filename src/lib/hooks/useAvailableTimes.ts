import { NextResponse } from "next/server";
import { getTimeSlotsForDate } from "@/lib/schedule";
import { getBusyTimes } from "@/lib/GoogleCalendar";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { error: "Parâmetro 'date' é obrigatório (yyyy-MM-dd)" },
      { status: 400 }
    );
  }

  const today = new Date();
  const requestedDate = new Date(date);
  today.setHours(0, 0, 0, 0);
  requestedDate.setHours(0, 0, 0, 0);

  // 🔥 Bloqueia datas no passado
  if (requestedDate < today) {
    return NextResponse.json({ available: [] });
  }

  const busy = await getBusyTimes(date);
  const allSlots = getTimeSlotsForDate(date);

  const available = allSlots.filter((slot) => {
    const [hour, minute] = slot.split(":").map(Number);
    const start = new Date(
      `${date}T${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}:00`
    );
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const hasConflict = busy.some((b) => {
      if (!b.start || !b.end) return false;
      const busyStart = new Date(b.start);
      const busyEnd = new Date(b.end);
      const bufferStart = new Date(busyStart.getTime() - 15 * 60 * 1000);
      const bufferEnd = new Date(busyEnd.getTime() + 15 * 60 * 1000);

      return start < bufferEnd && end > bufferStart;
    });

    return !hasConflict;
  });

  return NextResponse.json({ available });
}
