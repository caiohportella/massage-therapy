"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  href: string;
  span: string;
  className?: string;
  target?: string;
}

export function ActionButton({ href, span, target }: ActionButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn("relative inline-flex group self-start")}
    >
      <Link
        href={href}
        target={target}
        className="
          relative z-10 px-6 py-3
          rounded-full
          border border-border
          text-foreground font-medium
          transition-colors
          whitespace-nowrap
          overflow-hidden
        "
      >
        <span className="relative z-10">{span.toLowerCase()}</span>

        {/* Background animado */}
        <span
          className="
            absolute inset-0
            bg-accent
            rounded-full
            scale-x-0
            origin-left
            transition-transform
            duration-300
            ease-in-out
            group-hover:scale-x-100
            z-0
          "
        />
      </Link>
    </motion.div>
  );
}
