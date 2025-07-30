"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Check, Copy } from "lucide-react";

interface ServiceCardProps {
  name: string;
  description?: string;
  observation?: string;
  image: string;
  coupon: string;
}

export function VoucherCard({
  name,
  description,
  observation,
  image,
  coupon,
}: ServiceCardProps) {
  const [copied, setCopied] = useState(false);

  const copyCoupon = async () => {
    try {
      await navigator.clipboard.writeText(coupon);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar cupom:", error);
    }
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="
        min-w-[280px] max-w-[320px] flex-shrink-0 
        flex flex-col 
        rounded-[var(--radius-lg)] 
        bg-foreground 
        border border-border 
        shadow-md
        min-h-[420px]"
    >
      {/* Image */}
      <div className="w-full h-40 relative rounded-t-[var(--radius-lg)] overflow-hidden">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-6 flex-1">
        <h3 className="text-lg font-semibold text-background">{name}</h3>
        <p className="text-sm text-background/70">{description}</p>
        <br />
        <p className="text-sm text-background/70">{observation}</p>
      </div>

      {/* Coupon Code */}
      <div className="p-6 bg-background rounded-b-[var(--radius-lg)] flex flex-col items-start gap-2">
        <p className="text-sm font-medium text-foreground">Código do Cupom:</p>
        <div className="flex items-cneter gap-2">
          <p className="text-lg font-bold text-foreground">{coupon}</p>
          <button
            onClick={copyCoupon}
            className="text-sm text-blue-500 hover:underline"
          >
            {copied ? (
              <Check className="text-accent w-4 h-4" />
            ) : (
              <Copy className="text-accent w-4 h-4 cursor-pointer" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
