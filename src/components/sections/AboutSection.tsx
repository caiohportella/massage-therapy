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
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-24 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="
              relative 
              w-full h-96 
              md:w-[400px] md:h-[500px] 
              rounded-[var(--radius-lg)] 
              overflow-hidden
              "
          >
            <Image src="/about.jpg" alt="About" fill className="object-cover" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <p className="text-muted-foreground text-base md:text-[22px] leading-relaxed">
              Sou Ritha Portella, massoterapeuta integrativa, apaixonada pelo
              poder do toque e pela sabedoria milenar da Medicina Tradicional
              Chinesa. <br /> <br />
              Sendo formada em massoterapia pelo Senac Jundiaí, atuo como
              massoterapeuta desde 2021, tendo concluído cursos de renome dentro
              da área da medicina chinesa. <br /> <br />
              Minha missão é promover bem-estar físico, equilíbrio emocional e
              presença interior, unindo técnicas terapêuticas com uma escuta
              atenta e um olhar individualizado para cada pessoa que passa por
              minhas mãos. <br /> <br />
              Acredito que cuidar do corpo é também cuidar da alma, e que cada
              dor ou tensão traz uma mensagem do que precisa ser olhado com mais
              carinho e consciência. <br /> <br />
              Atendo mulheres e homens que desejam aliviar dores, ansiedade,
              estresse, inchaços e desconfortos — mas, acima de tudo, que
              desejam se reconectar com seu corpo e com sua
              própria energia vital.
            </p>

            <div className="mt-6 text-center md:text-start">
              <ActionButton
                href="https://wa.me/5511946469989"
                span="Entre em contato"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
