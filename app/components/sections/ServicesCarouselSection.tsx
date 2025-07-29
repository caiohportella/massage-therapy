"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ServiceCard } from "@/components/elements/ServiceCard";
import { motion } from "framer-motion";
import { SectionHeader } from "../elements/SectionHeader";
import { SERVICES } from "@/lib/constants";

export function ServicesCarouselSection() {
  const [emblaRef] = useEmblaCarousel({
    loop: false,
    align: "start",
  });

  return (
    <section className="relative w-full py-24 md:py-32">
      <div className="container mx-auto px-4 flex flex-col gap-8 md:gap-24">
        {/* Cabeçalho */}
        <SectionHeader
          title="Minhas especialidades"
          background="Técnicas"
        />

        {/* Carrossel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="overflow-hidden"
          ref={emblaRef}
        >
          <div className="flex gap-6">
            {SERVICES.map((service) => (
              <div
                key={service.name}
                className="flex-shrink-0 min-w-[280px] max-w-[320px]"
              >
                <ServiceCard
                  name={service.name}
                  description={service.description}
                  image={service.image}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
