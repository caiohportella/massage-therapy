"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ServiceCardProps {
  name: string;
  description?: string;
  image: string;
}

export function ServiceCard({ name, description, image }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="select-none cursor-grab active:cursor-grabbing
        min-w-[280px] max-w-[320px] flex-shrink-0 
        flex flex-col 
        rounded-[var(--radius-lg)] 
        bg-foreground 
        border border-border 
        shadow-md
        min-h-[420px]"
    >
      {/* Image */}
      <div className="w-full h-60 relative rounded-t-[var(--radius-lg)] overflow-hidden">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-6 flex-1">
        <h3 className="text-lg font-semibold text-background">{name}</h3>
        <p className="text-md text-background/70">{description}</p>
      </div>
    </motion.div>
  );
}
