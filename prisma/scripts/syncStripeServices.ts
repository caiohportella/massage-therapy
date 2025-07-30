import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

async function main() {
  const products = await stripe.products.list({ active: true, limit: 100 });

  for (const product of products.data) {
    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
      limit: 10,
    });

    // Para simplificação, vamos considerar o primeiro price como padrão
    const price = prices.data[0];

    if (!price) continue;

    const duration = price.metadata.duration
      ? parseInt(price.metadata.duration, 10)
      : 60;

    await prisma.service.upsert({
      where: { productId: product.id },
      update: {
        name: product.name,
        description: product.description ?? "",
        price: price.unit_amount ?? 0,
        image: product.images?.[0] || null,
        duration,
      },
      create: {
        name: product.name,
        description: product.description ?? "",
        price: price.unit_amount ?? 0,
        image: product.images?.[0] || null,
        productId: product.id,
        duration,
      },
    });
  }

  console.log("✅ Serviços sincronizados com sucesso do Stripe.");
}

main().catch((err) => {
  console.error("❌ Erro ao sincronizar serviços:", err);
  process.exit(1);
});
