import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// Mock services for development when no Stripe BRL prices are configured
const MOCK_SERVICES = [
  {
    id: "mock_1",
    name: "Massagem Relaxante",
    description: "Técnica suave para aliviar tensões, melhorar o sono e proporcionar bem-estar geral.",
    image: "/services/relaxante.jpg",
    durations: [
      { label: "30 minutos", price: 80, priceId: "mock_price_1a", duration: 30 },
      { label: "60 minutos", price: 150, priceId: "mock_price_1b", duration: 60 },
    ],
  },
  {
    id: "mock_2",
    name: "Drenagem Linfática",
    description: "Técnica que estimula o sistema linfático, reduzindo inchaços e melhorando a circulação.",
    image: "/services/drenagem.webp",
    durations: [
      { label: "60 minutos", price: 180, priceId: "mock_price_2", duration: 60 },
    ],
  },
  {
    id: "mock_3",
    name: "Massagem Desportiva",
    description: "Indicada para atletas, ajuda na prevenção de lesões, recuperação muscular e melhora de desempenho.",
    image: "/services/desportiva.jpg",
    durations: [
      { label: "45 minutos", price: 120, priceId: "mock_price_3a", duration: 45 },
      { label: "60 minutos", price: 160, priceId: "mock_price_3b", duration: 60 },
    ],
  },
  {
    id: "mock_4",
    name: "Reflexologia Podal",
    description: "Terapia milenar com estímulos em pontos dos pés para equilibrar funções do corpo.",
    image: "/services/reflexo.jpg",
    durations: [
      { label: "40 minutos", price: 100, priceId: "mock_price_4", duration: 40 },
    ],
  },
  {
    id: "mock_5",
    name: "Zen Shiatsu",
    description: "Terapia japonesa que utiliza pressão em pontos específicos do corpo para aliviar dores e tensões.",
    image: "/services/zen.jpg",
    durations: [
      { label: "60 minutos", price: 170, priceId: "mock_price_5", duration: 60 },
    ],
  },
  {
    id: "mock_6",
    name: "Ventosaterapia",
    description: "Técnica que utiliza ventosas para aliviar dores, melhorar a circulação e desintoxicar o corpo.",
    image: "/services/ventosa.webp",
    durations: [
      { label: "30 minutos", price: 90, priceId: "mock_price_6", duration: 30 },
    ],
  },
];

export async function GET() {
  try {
    const products = await stripe.products.list({ active: true, limit: 100 });

    const productDetails = await Promise.all(
      products.data.map(async (product) => {
        const prices = await stripe.prices.list({
          product: product.id,
          active: true,
          currency: "brl", // Filter prices by BRL
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

    // In development, if no products have BRL prices, use mock data
    const hasValidProducts = productDetails.some((p) => p.durations.length > 0);

    if (!hasValidProducts && process.env.NODE_ENV === "development") {
      console.log("⚠️ No Stripe products with BRL prices found. Using mock data for development.");
      return NextResponse.json(MOCK_SERVICES);
    }

    return NextResponse.json(productDetails);
  } catch (err) {
    console.error("Erro ao buscar produtos do Stripe:", err);

    // In development, fallback to mock data on error
    if (process.env.NODE_ENV === "development") {
      console.log("⚠️ Stripe error. Using mock data for development.");
      return NextResponse.json(MOCK_SERVICES);
    }

    return NextResponse.json(
      { error: "Erro ao carregar produtos Stripe" },
      { status: 500 }
    );
  }
}
