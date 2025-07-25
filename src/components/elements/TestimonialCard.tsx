// src/components/elements/testimonial-card.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";

// Interface para as propriedades do nosso card
interface TestimonialCardProps {
  name: string;
  message: string;
  role: string;
  avatar: string;
}

export function TestimonialCard({
  name,
  message,
  role,
  avatar,
}: TestimonialCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="relative flex flex-col gap-6 w-full h-fit rounded-[var(--radius-lg)] bg-card border border-border p-6 shadow-md"
    >
      {/* Ícone de Aspas */}
      <Quote className="size-8 text-accent/50" />

      {/* Ícone de Aspas invertido no canto inferior direito */}
      <div className="absolute bottom-4 right-4 pointer-events-none">
        <Quote className="size-8 text-accent/50 rotate-180" />
      </div>

      {/* Mensagem do depoimento */}
      <p className="text-background text-base leading-relaxed flex-1">
        {message}
      </p>

      {/* Rodapé do Card com Avatar e Nome */}
      <footer className="flex items-center gap-4 mt-auto">
        <div className="relative size-12 rounded-full overflow-hidden border-2 border-accent">
          <Image
            src={avatar}
            alt={`Foto de ${name}`}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <cite className="font-semibold text-background not-italic">
            {name}
          </cite>
          <span className="text-sm text-background">{role}</span>
        </div>
      </footer>
    </motion.div>
  );
}
