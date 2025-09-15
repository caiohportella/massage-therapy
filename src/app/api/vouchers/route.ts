import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export const revalidate = 0; // Disable caching for this API route

// Define a local interface to extend Stripe.Coupon with expires_at
interface CouponWithExpiry extends Stripe.Coupon {
  expires_at: number | null;
}

export async function GET() {
  try {
    const coupons = await stripe.coupons.list({
      limit: 100, // Adjust as needed
    });

    // console.log("Raw coupons from Stripe:", coupons.data);

    const currentTime = Math.floor(Date.now() / 1000); // Current Unix timestamp

    const activeVouchers = coupons.data
      .filter((coupon) => {
        // Cast coupon to CouponWithExpiry to access expires_at
        const typedCoupon = coupon as CouponWithExpiry;
        // A coupon is active if it does not expire, or if expires_at is in the future
        return !typedCoupon.expires_at || typedCoupon.expires_at > currentTime;
      })
      .map((coupon) => ({
        id: coupon.id,
        name: coupon.name || "",
        amount_off: coupon.amount_off,
        percent_off: coupon.percent_off,
        currency: coupon.currency,
        duration: coupon.duration,
        duration_in_months: coupon.duration_in_months,
        livemode: coupon.livemode,
        metadata: coupon.metadata,
        expires_at: (coupon as CouponWithExpiry).expires_at,
        // Add any other fields you need from the coupon object
      }));

    return NextResponse.json({ vouchers: activeVouchers });
  } catch (error) {
    console.error("Error fetching vouchers from Stripe:", error);
    return NextResponse.json(
      { error: "Failed to fetch vouchers." },
      { status: 500 }
    );
  }
}
