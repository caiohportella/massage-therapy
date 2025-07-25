"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// 1. Adicionar a nova prop `backgroundSize` à interface
interface SectionHeaderProps {
  title: string;
  background: string;
  align?: "center" | "left";
  backgroundSize?: string;
}

export function SectionHeader({
  title,
  background,
  align = "center",
  // 2. Definir um valor padrão para a nova prop
  backgroundSize = "text-[clamp(4rem,10vw,10rem)]",
}: SectionHeaderProps) {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 relative px-4",
        isCentered ? "text-center items-center" : "text-left items-start"
      )}
    >
      {/* Wrapper título + background */}
      <div className="relative w-full">
        {/* Background */}
        <span
          className={cn(
            `
              absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              font-background 
              text-accent/10 
              [text-stroke:1px_var(--color-accent)]
              pointer-events-none 
              select-none 
              z-0
              whitespace-nowrap
            `,
            // 3. Aplicar a classe de tamanho dinamicamente
            backgroundSize, 
            !isCentered && "left-0 -translate-x-0"
          )}
        >
          {background.toUpperCase()}
        </span>

        {/* Título */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative z-10 text-3xl md:text-4xl font-bold text-foreground"
        >
          {title}
        </motion.h2>
      </div>
    </div>
  );
}