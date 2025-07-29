import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/schemas/BookingSchema";
import { NextResponse } from "next/server";
import { getTimeSlotsForDate } from "@/lib/schedule";
import { createGoogleCalendarEvent, getBusyTimes } from "@/lib/GoogleCalendar";
import { APPOINTMENT_LOCATION } from "@/lib/constants";
import { sendWhatsAppMessage } from "@/lib/twilio";
import { formatCancellationMessage } from "@/lib/whatsapp-messages/FormatCancellationMessage";
import { formatConfirmationMessage } from "@/lib/whatsapp-messages/FormatConfirmationMessage";
import { formatReminderMessage } from "@/lib/whatsapp-messages/FormatReminderMessage";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const dateString = data.date;
    const time = data.time;

    const now = new Date();
    const selectedDate = new Date(`${dateString}T${time}`);

    const diffInMs = selectedDate.getTime() - now.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    // 🔥 Antecedência mínima e máxima
    if (diffInHours < 1) {
      return NextResponse.json(
        {
          error:
            "Agendamento deve ser feito com pelo menos 1 hora de antecedência.",
        },
        { status: 400 }
      );
    }

    if (diffInHours > 24 * 20) {
      return NextResponse.json(
        { error: "Agendamento deve ser feito no máximo 20 dias antes." },
        { status: 400 }
      );
    }

    // 🔥 Valida se o horário existe nos horários permitidos
    const allowedTimeSlots = getTimeSlotsForDate(dateString);

    if (!allowedTimeSlots.includes(time)) {
      return NextResponse.json(
        { error: "Horário inválido ou fora do horário de atendimento." },
        { status: 400 }
      );
    }

    // 🔥 Verifica no Google Calendar se já existem ocupações
    const busyTimes = await getBusyTimes(dateString);

    if (busyTimes.length >= 5) {
      return NextResponse.json(
        { error: "Limite de 5 atendimentos para esse dia atingido." },
        { status: 400 }
      );
    }

    const [hour, minute] = time.split(":").map(Number);

    const slotStart = new Date(
      `${dateString}T${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}:00`
    );
    const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000); // Atendimento de 1 hora

    const hasConflict = busyTimes.some(
      (busy: {
        start: string | number | Date;
        end: string | number | Date;
      }) => {
        if (!busy.start || !busy.end) return false;

        const busyStart = new Date(busy.start);
        const busyEnd = new Date(busy.end);

        const bufferStart = new Date(busyStart.getTime() - 15 * 60 * 1000);
        const bufferEnd = new Date(busyEnd.getTime() + 15 * 60 * 1000);

        return slotStart < bufferEnd && slotEnd > bufferStart;
      }
    );

    if (hasConflict) {
      return NextResponse.json(
        { error: "Horário indisponível devido a outro agendamento próximo." },
        { status: 400 }
      );
    }

    // Cria ou encontra o usuário
    const user = await prisma.user.upsert({
      where: { email: data.user.email },
      update: {},
      create: {
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        address: data.user.address,
        number: data.user.number,
        complement: data.user.complement,
        district: data.user.district,
        city: data.user.city,
        state: data.user.state,
        zipCode: data.user.zipCode,
      },
    });

    // Cria o booking no banco
    const booking = await prisma.booking.create({
      data: {
        date: new Date(data.date),
        time: data.time,
        userId: user.id,
        totalAmount: data.totalAmount,
        services: {
          create: data.services.map((serviceId) => ({
            service: { connect: { id: serviceId } },
          })),
        },
      },
      include: {
        services: { include: { service: true } },
        user: true,
      },
    });

    await createGoogleCalendarEvent({
      date: data.date,
      time: data.time,
      name: data.user.name,
      services: booking.services.map((s: any) => s.service.name),
    });

    const message = formatConfirmationMessage({
      name: user.name,
      date: booking.date.toISOString().split("T")[0],
      time: booking.time,
      services: booking.services.map((s: any) => s.service.name),
    });

    sendWhatsAppMessage({
      to: data.user.phone,
      message,
    }).catch((err) => {
      console.error("Erro ao enviar WhatsApp:", err);
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar booking:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
