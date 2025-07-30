"use client";

import { SectionHeader } from "../elements/SectionHeader";
import { Button } from "@/components/ui/button";
import { VoucherCard } from "../elements/VoucherCard";

export function VouchersSection() {
  return (
    <section className="w-full py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 flex flex-col gap-8 md:gap-24">
        <SectionHeader
          title="Compre com desconto"
          background="Vouchers"
          backgroundSize="text-[clamp(3rem,8vw,8rem)]"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 place-items-center">
          {/* Combo Promocional fixo */}
          <div className="flex flex-col items-center">
            <VoucherCard
              name="Promoção 3x1 - Detox"
              description="Pacote especial para você aproveitar o melhor serviço detox. Nele, ofereço drenagem linfática manual, massagem relaxante e massagem modeladora."
              observation="Disponivel apenas para pagamentos à vista. Válido até 01/08."
              image="/services/detox.jpg"
              coupon="DETOX40"
            />

            <Button
              className="mt-4 cursor-pointer"
              onClick={() =>
                (window.location.href =
                  "https://buy.stripe.com/9B63cv0mS4Sx9aC3yVe7m01")
              }
            >
              Comprar
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
