"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ActionButton } from "@/components/elements/ActionButton";
import { SectionHeader } from "../elements/SectionHeader";

export function AboutSection() {
  return (
    <section className="w-full py-24 md:py-32">
      <div className="container mx-auto px-4 flex flex-col gap-16">
        {/* Title */}
        <SectionHeader title="Quem sou eu" background="Sobre" align="center" />

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="
              relative 
              w-full h-64 
              md:w-[400px] md:h-[500px] 
              rounded-[var(--radius-lg)] 
              overflow-hidden"
          >
            <Image src="/ritha.png" alt="About" fill className="object-cover" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <p className="text-muted-foreground text-base md:text-2xl leading-relaxed">
              Sendo formada em massoterapia pelo Senac Jundiaí, sou
              massoterapeuta há 1 ano e meio, tendo concluído cursos de renome
              dentro da área da medicina chinesa. Atualmente, atendo em
              domicílio, em clínicas parceiras e na minha residência.
            </p>
            <p className="text-muted-foreground text-base md:text-2xl leading-relaxed">
              Atuo com técnicas de massagem relaxante, terapêutica, drenagem
              linfática, shiatsu e reflexologia.
            </p>

            <div className="mt-24 text-start">
              <ActionButton href="/contact" span="Entre em contato" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
