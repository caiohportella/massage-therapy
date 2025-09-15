"use client";

import { SectionHeader } from "../elements/SectionHeader";
import { Button } from "@/components/ui/button";
import { VoucherCard } from "../elements/VoucherCard";
import { useEffect, useState } from "react";
import Stripe from "stripe";

interface Voucher {
  id: string;
  name: string;
  amount_off: number | null;
  percent_off: number | null;
  currency: string | null;
  expires_at: number | null;
  // Add any other fields you need
  description?: string;
  observation?: string;
  image?: string;
  coupon?: string; // This will be the coupon code for display/use
}

interface CouponWithExpiry extends Stripe.Coupon {
  expires_at: number;
}

export function VouchersSection() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Directly fetch vouchers without using the calendar store cache
    fetch("/api/vouchers")
      .then((res) => res.json())
      .then((data) => {
        // Map Stripe coupon data to VoucherCard props
        const mappedVouchers: Voucher[] = data.vouchers.map((v: Stripe.Coupon) => ({ // Use Stripe.Coupon type
          id: v.id,
          name: v.name,
          amount_off: v.amount_off,
          percent_off: v.percent_off,
          currency: v.currency,
          expires_at: (v as CouponWithExpiry).expires_at,
          // Assuming description, observation, image, coupon can come from metadata or be hardcoded defaults if not available
          description: v.metadata?.description || "Compre este voucher com desconto!",
          observation: (v as CouponWithExpiry).expires_at
            ? `Válido até ${new Date((v as CouponWithExpiry).expires_at * 1000).toLocaleDateString()}`
            : "Sem data de expiração",
          image: v.metadata?.image || "/services/detox.jpg", // Default image
          coupon: v.id, // Using coupon ID as the display coupon for now
        }));
        setVouchers(mappedVouchers);
      })
      .catch(() => { // Removed 'error' parameter as it's not used
        // console.error("Failed to fetch vouchers:", error);
        setVouchers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="w-full py-24 md:py-32 bg-background flex items-center justify-center">
        <div className="flex items-center justify-center h-48">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </section>
    );
  }

  if (vouchers.length === 0) {
    return null; // Don't render the section if no active vouchers
  }

  return (
    <section className="w-full py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 flex flex-col gap-8 md:gap-24">
        <SectionHeader
          title="Compre com desconto"
          background="Vouchers"
          backgroundSize="text-[clamp(3rem,8vw,8rem)]"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 place-items-center">
          {vouchers.map((voucher) => (
            <div key={voucher.id} className="flex flex-col items-center">
              <VoucherCard
                name={voucher.name}
                description={voucher.description}
                observation={voucher.observation}
                image={voucher.image ?? ''}
                coupon={voucher.coupon ?? ''}
              />
              <Button
                className="mt-4 cursor-pointer"
                onClick={() =>
                  // You might need a dynamic Stripe checkout link or a generic link to a page where the coupon can be applied
                  (window.location.href = `https://buy.stripe.com/your-product-link?prefilled_promo_code=${voucher.coupon}`)
                }
              >
                Comprar
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
