import { NextRequest } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { calendar } from "@/lib/GoogleCalendar";
import { sendWhatsAppMessage } from "@/lib/twilio";
import { formatConfirmationMessage } from "@/lib/whatsapp-messages/FormatConfirmationMessage";
import { Service } from "@/lib/types";

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

      const start = new Date(`${metadata.date}T${metadata.time}`);

      const serviceRecords = await Promise.all(
        services.map(async (s: any) => {
          const found = await prisma.service.findUnique({
            where: { id: s.productId }, // ou use `stripeProductId` se alterar o schema
          });

          if (!found) {
            console.error(`❌ Serviço não encontrado para ID: ${s.productId}`);
            throw new Error("Serviço inválido no agendamento.");
          }

          return { ...found, duration: s.duration }; // inclui a duração recebida do Stripe
        })
      );

      const totalMinutes = serviceRecords.reduce(
        (sum, s) => sum + (s.duration || 0),
        0
      );
      const end = new Date(start.getTime() + totalMinutes * 60 * 1000);

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
          date: new Date(metadata.date),
          time: metadata.time,
          totalAmount: session.amount_total ? session.amount_total / 100 : 0,
          userId: user.id,
          services: {
            create: services.map((s: Service) => ({
              service: { connect: { id: s.id } },
            })),
          },
        },
        include: {
          services: { include: { service: true } },
        },
      });

      // Criar evento no Google Calendar
      await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID!,
        requestBody: {
          summary: `Atendimento - ${user.name}`,
          description: `Serviços contratados: ${booking.services
            .map((s) => s.service.name)
            .join(", ")}`,
          start: {
            dateTime: start.toISOString(),
            timeZone: "America/Sao_Paulo",
          },
          end: {
            dateTime: end.toISOString(),
            timeZone: "America/Sao_Paulo",
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
