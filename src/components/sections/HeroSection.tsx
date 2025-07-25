"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { GlassBackground } from "@/components/layout/GlassBackground";
import { ActionButton } from "../elements/ActionButton";

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

      <div className="container mx-auto px-4 gap-16 items-center relative z-10">
        {/* Texto */}
        <div className="flex flex-col justify-center items-center mt-12 gap-6">
          {/* Label */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ amount: 0.3 }}
            className="text-base md:text-lg text-accent font-mono"
          >
            Massoterapeuta Holística
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
            className="text-base md:text-lg text-muted-foreground max-w-[500px] mt-2"
          >
            Atendimentos que promovem equilíbrio, bem-estar e alívio do
            estresse. Cuidando de você de forma integral — física, emocional e
            energética.
          </motion.p>

          {/* Botão */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            viewport={{ amount: 0.3 }}
          >
            <ActionButton href="/about" span="sobre mim" />
          </motion.div>
        </div>

        {/* Imagem */}
        {/* <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ amount: 0.3 }}
            className="
            relative 
            w-full h-64 
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
        </div> */}
      </div>
    </section>
  );
}
