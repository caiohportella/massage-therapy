import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage } from "@/lib/twilio";
import { formatReminderMessage } from "@/lib/whatsapp-messages/FormatReminderMessage";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // necessário para cron da Vercel

export async function GET() {
  const now = new Date();
  const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  const lowerBound = new Date(twoHoursFromNow.getTime() - 5 * 60 * 1000); // margem de 5min
  const upperBound = new Date(twoHoursFromNow.getTime() + 5 * 60 * 1000);

  const bookings = await prisma.booking.findMany({
    where: {
      scheduledAt: {
        gte: lowerBound,
        lte: upperBound,
      },
      reminderSent: false,
    },
    include: {
      user: true,
      services: {
        include: { service: true },
      },
    },
  });

  for (const booking of bookings) {
    const message = formatReminderMessage({
      name: booking.user.name,
      date: booking.date.toISOString().split("T")[0],
      time: booking.time,
      services: booking.services.map((s) => s.service.name),
    });

    await sendWhatsAppMessage({
      to: booking.user.phone,
      message,
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { reminderSent: true },
    });

    await prisma.reminderLog.create({
      data: {
        bookingId: booking.id,
        userId: booking.user.id,
        type: "2h antes",
      },
    });

    console.log(`✅ Lembrete enviado para ${booking.user.phone}`);
  }

  return NextResponse.json({ success: true, count: bookings.length });
}
