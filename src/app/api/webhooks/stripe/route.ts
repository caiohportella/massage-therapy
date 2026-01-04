import { NextRequest } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { calendar } from "@/lib/GoogleCalendar";
import { sendWhatsAppMessage } from "@/lib/twilio";
import { formatConfirmationMessage } from "@/lib/whatsapp-messages/FormatConfirmationMessage";
import { SelectedService } from "@/lib/types";
import { TIMEZONE } from "@/lib/constants";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_KEY!
    );
  } catch (err) {
    console.error("❌ Erro ao validar assinatura Stripe:", err);
    return new Response("Webhook signature verification failed", {
      status: 400,
    });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    if (
      !metadata?.date ||
      !metadata?.time ||
      !metadata?.selectedServices ||
      !metadata?.personalData
    ) {
      console.warn("❗ Dados ausentes nos metadados.");
      return new Response("Dados de agendamento ausentes", { status: 400 });
    }

    try {
      // Extrair dados
      const personalData = JSON.parse(metadata.personalData);
      const services = JSON.parse(metadata.selectedServices);

      // Parse time components
      const [hours, minutes] = metadata.time.split(":").map(Number);

      // Create a date string that will be interpreted in São Paulo timezone
      // Format: YYYY-MM-DDTHH:MM:SS (without timezone suffix, so Google Calendar uses the specified timeZone)
      const startDateTimeStr = `${metadata.date}T${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;

      const serviceRecords = await Promise.all(
        services.map(async (s: SelectedService) => {
          const price = await stripe.prices.retrieve(s.priceId);

          const match = price.nickname?.match(/(\d+)\s*min/);

          if (!match) {
            throw new Error(`Duração não encontrada em ${price.id}`);
          }

          const duration = parseInt(match[1]);

          return { productId: s.productId, duration };
        })
      );

      const totalMinutes = serviceRecords.reduce(
        (sum, s) => sum + (s.duration || 0),
        0
      );

      // Calculate end time
      const endHours = hours + Math.floor((minutes + totalMinutes) / 60);
      const endMinutes = (minutes + totalMinutes) % 60;
      const endDateTimeStr = `${metadata.date}T${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}:00`;

      // For database storage, create proper Date objects in UTC
      const startForDb = new Date(`${metadata.date}T${metadata.time}:00-03:00`);

      // Criar ou atualizar usuário
      const user = await prisma.user.upsert({
        where: { email: personalData.email },
        update: {
          name: personalData.fullName,
          phone: personalData.phone,
          address: personalData.address,
          number: personalData.number,
          complement: personalData.complement,
          district: personalData.district,
          city: personalData.city,
          state: personalData.state,
          zipCode: personalData.zipCode,
        },
        create: {
          name: personalData.fullName,
          email: personalData.email,
          phone: personalData.phone,
          address: personalData.address,
          number: personalData.number,
          complement: personalData.complement,
          district: personalData.district,
          city: personalData.city,
          state: personalData.state,
          zipCode: personalData.zipCode,
        },
      });

      // Criar booking
      const booking = await prisma.booking.create({
        data: {
          totalAmount: session.amount_total ? session.amount_total / 100 : 0,
          userId: user.id,
          date: new Date(metadata.date),
          time: metadata.time,
          paymentStatus: "paid",
          services: {
            create: services.map((s: SelectedService) => ({
              service: { connect: { productId: s.productId } },
            })),
          },
          paymentIntentId: session.payment_intent as string,
          scheduledAt: startForDb,
        },
        include: {
          services: { include: { service: true } },
        },
      });

      // Criar evento no Google Calendar
      // Use datetime strings without timezone suffix - Google Calendar will use the timeZone parameter
      await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID!,
        requestBody: {
          summary: `Atendimento - ${user.name}`,
          description: `Serviços contratados: ${booking.services
            .map((s) => s.service.name)
            .join(", ")}`,
          start: {
            dateTime: startDateTimeStr,
            timeZone: TIMEZONE,
          },
          end: {
            dateTime: endDateTimeStr,
            timeZone: TIMEZONE,
          },
        },
      });

      // Enviar mensagem WhatsApp
      const message = formatConfirmationMessage({
        name: user.name,
        date: metadata.date,
        time: metadata.time,
        services: booking.services.map((s) => s.service.name),
      });

      await sendWhatsAppMessage({
        to: user.phone,
        message,
      });

      console.log("✅ Agendamento completo com sucesso.");
    } catch (error) {
      console.error("❌ Erro ao processar agendamento:", error);
      return new Response("Erro interno", { status: 500 });
    }
  }

  return new Response("OK", { status: 200 });
}
