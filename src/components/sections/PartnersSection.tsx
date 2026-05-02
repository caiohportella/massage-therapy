"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeader } from "../elements/SectionHeader";

const partners = [
  {
    name: "Edilaine Fantini",
    logo: "/partners/fantini.png",
  },
  {
    name: "Sakura",
    logo: "/partners/sakura.png",
  },
];

export function PartnersSection() {
  return (
    <section id="partners" className="w-full py-24 md:py-32">
      <div className="container mx-auto px-4 flex flex-col gap-16">
        <SectionHeader
          title="Nossos Parceiros"
          background="Parceiros"
          align="center"
        />

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 md:mt-32">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Card wrapper to match the logo's cream background */}
              <div className="
                relative 
                w-48 h-24 md:w-72 md:h-40
                rounded-2xl 
                bg-card 
                border border-border/50 
                overflow-hidden 
                shadow-lg 
                hover:shadow-2xl hover:border-accent
                transition-all duration-500
                flex items-center justify-center
                p-24
              ">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
