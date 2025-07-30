import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const { name, services, date, time, personalData, selectedServices } =
    await req.json();

  try {
    const lineItems = [];

    for (const service of services) {
      // Se vier priceId diretamente, use
      if (service.priceId) {
        lineItems.push({
          price: service.priceId,
          quantity: service.quantity || 1,
        });
      } else if (service.productId) {
        // Se vier apenas o productId, resolva o priceId
        const prices = await stripe.prices.list({
          product: service.productId,
          active: true,
          limit: 1,
        });

        if (!prices.data.length) {
          return NextResponse.json(
            { error: `Produto ${service.productId} sem preço ativo.` },
            { status: 400 }
          );
        }

        lineItems.push({
          price: prices.data[0].id,
          quantity: service.quantity || 1,
        });
      } else {
        return NextResponse.json(
          { error: "Cada serviço deve conter priceId ou productId." },
          { status: 400 }
        );
      }
    }

    console.log("Line items:", lineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      metadata: {
        name,
        date,
        time,
        selectedServices: JSON.stringify(selectedServices),
        personalData: JSON.stringify(personalData),
      },
      success_url: `${req.headers.get(
        "origin"
      )}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erro ao criar sessão de pagamento:", error);
    return NextResponse.json(
      { error: "Erro ao criar sessão de pagamento." },
      { status: 500 }
    );
  }
}
