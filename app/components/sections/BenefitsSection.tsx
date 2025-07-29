"use client";

import { motion } from "framer-motion";
import { ActivityIcon, HandHeartIcon, SmileIcon } from "lucide-react";
import { SectionHeader } from "../elements/SectionHeader";

export function BenefitsSection() {
  return (
    <section className="w-full py-24 md:py-32">
      <div className="container mx-auto px-4 flex flex-col gap-4">
        <SectionHeader
          title="Por que fazer massoterapia?"
          background="Benefícios"
          align="center"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 mt-16"
        >
          <div className="flex flex-col items-center">
            <SmileIcon className="w-12 h-12 mb-4 text-accent" />
            <h3 className="text-2xl text-white font-bold mb-2">Relaxamento</h3>
            <p className="text-center">
              Com a massoterapia, você pode relaxar e aliviar o estresse do dia
              a dia, melhorando sua qualidade de vida.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <HandHeartIcon className="w-12 h-12 mb-4 text-accent" />
            <h3 className="text-2xl text-white font-bold mb-2">Bem-estar</h3>
            <p className="text-center">
              A massoterapia pode melhorar a circulação sanguínea, aliviar dores
              musculares e melhorar a qualidade do sono.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <ActivityIcon className="w-12 h-12 mb-4 text-accent" />
            <h3 className="text-2xl text-white font-bold mb-2">Emocional</h3>
            <p className="text-center">
              A massoterapia pode ajudar a aliviar a ansiedade e a depressão,
              melhorando sua saúde mental.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
