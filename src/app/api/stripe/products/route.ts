import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    const products = await stripe.products.list({ active: true, limit: 100 });

    const productDetails = await Promise.all(
      products.data.map(async (product) => {
        const prices = await stripe.prices.list({
          product: product.id,
          active: true,
          limit: 10, // permitir múltiplos preços
        });

        const durations = prices.data.map((price) => {
          const defaultDuration = price.metadata.duration
            ? parseInt(price.metadata.duration, 10)
            : 60;
          return {
            label: price.nickname ?? "Sem nome",
            price: (price.unit_amount || 0) / 100,
            priceId: price.id,
            duration: defaultDuration,
          };
        });

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          image: product.images?.[0] || null,
          durations,
        };
      })
    );

    return NextResponse.json(productDetails);
  } catch (err) {
    console.error("Erro ao buscar produtos do Stripe:", err);
    return NextResponse.json(
      { error: "Erro ao carregar produtos Stripe" },
      { status: 500 }
    );
  }
}
