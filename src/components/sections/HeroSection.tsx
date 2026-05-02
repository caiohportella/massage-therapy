"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Leaf } from "lucide-react";
import { ActionButton } from "@/components/elements/ActionButton";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center py-24 md:py-32 overflow-hidden">
      {/* Background Blobs for Visual Interest */}
      <div className="absolute top-1/4 -left-20 md:left-10 w-[20rem] md:w-[30rem] h-[20rem] md:h-[30rem] bg-accent/15 rounded-full mix-blend-screen filter blur-[80px] md:blur-[120px] opacity-70 animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 md:right-10 w-[15rem] md:w-[25rem] h-[15rem] md:h-[25rem] bg-secondary/15 rounded-full mix-blend-screen filter blur-[60px] md:blur-[100px] opacity-60 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 lg:gap-28">
          {/* Texto */}
          <div className="flex flex-col justify-center items-center md:items-start flex-1 gap-6 text-center md:text-left">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-sm"
            >
              <Leaf className="w-4 h-4 text-accent" />
              <span className="text-sm md:text-base text-accent font-medium tracking-wide">
                Massoterapeuta Integrativa
              </span>
            </motion.div>

            {/* Título */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl lg:text-7xl font-mono text-foreground drop-shadow-md tracking-tight max-w-[600px] leading-tight"
            >
              Ritha Portella
            </motion.h1>

            {/* Descrição */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-base md:text-lg text-muted-foreground max-w-[500px] leading-relaxed"
            >
              Atendimentos terapêuticos que despertam o equilíbrio, aliviam tensões e reconectam você à sua essência.
              Um espaço de acolhimento, cura e bem-estar energético.
            </motion.p>
            
            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true }}
              className="mt-4"
            >
              <ActionButton href="#booking" span="Agende sua Sessão" />
            </motion.div>
          </div>

          {/* Imagem */}
          <div className="flex justify-center w-full md:flex-1 relative mt-10 md:mt-0">
            {/* Decorador tracejado no fundo da imagem */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[105%] border-2 border-dashed border-accent/30 rounded-t-full rounded-b-3xl -z-10"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="
                relative 
                w-full max-w-[380px] h-[450px]
                md:max-w-none md:w-[420px] md:h-[550px] 
                rounded-t-full rounded-b-3xl
                overflow-hidden
                border-[6px] border-background/80
                ring-1 ring-accent/30
                shadow-2xl shadow-accent/10
              "
            >
              <Image
                src="/ritha.png"
                alt="Foto Ritha Portella"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 rounded-t-full rounded-b-3xl ring-1 ring-inset ring-black/10 pointer-events-none" />
            </motion.div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
              className="
                absolute -bottom-6 md:bottom-12 
                -right-2 md:-right-8 
                bg-background/90 backdrop-blur-xl 
                border border-accent/20 
                px-5 py-4 rounded-2xl 
                shadow-2xl shadow-black/30 
                flex items-center gap-4
                z-20
              "
            >
              <div className="bg-accent/20 p-3 rounded-full text-accent shadow-inner">
                <Leaf className="w-6 h-6" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-foreground text-lg leading-none mb-1">Bem-estar</span>
                <span className="text-muted-foreground text-sm leading-none">Físico e Emocional</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};