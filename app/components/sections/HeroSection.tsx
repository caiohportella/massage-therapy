"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { GlassBackground } from "@/components/layout/GlassBackground";

export function HeroSection() {
  return (
    <section className="relative w-full py-24 md:py-32">
      {/* Glassmorphism + Logo no fundo */}
      <GlassBackground className="z-0">
        {/* <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Logo Background"
            width={600}
            height={600}
            className="
              opacity-5 
              w-[400px] md:w-[600px] 
              pointer-events-none 
              select-none
            "
          />
        </div> */}
      </GlassBackground>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24 mt-12">
          {/* Texto */}
          <div className="flex flex-col justify-center items-center md:items-start flex-1 gap-6">
            {/* Label */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ amount: 0.3 }}
              className="text-base md:text-lg text-accent font-mono"
            >
              Massoterapeuta Integrativa
            </motion.span>

            {/* Título */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              viewport={{ amount: 0.3 }}
              className="text-4xl md:text-5xl font-bold font-background text-foreground max-w-[600px]"
            >
              Ritha Portella
            </motion.h1>

            {/* Descrição */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              viewport={{ amount: 0.3 }}
              className="text-base text-center md:text-start md:text-lg text-muted-foreground max-w-[500px] mt-2"
            >
           Atendimentos terapêuticos que despertam o equilíbrio, aliviam tensões e reconectam você à sua essência. 
           Um espaço de acolhimento, cura e bem-estar energético.
            </motion.p>
          </div>

          {/* Imagem */}
          <div className="flex justify-center w-full md:flex-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ amount: 0.3 }}
              className="
                relative 
                w-full h-96 
                md:w-[400px] md:h-[500px] 
                rounded-[var(--radius-lg)] 
                overflow-hidden
                border border-border
                shadow-lg
              "
            >
              <Image
                src="/ritha.png"
                alt="Foto Ritha Portella"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};