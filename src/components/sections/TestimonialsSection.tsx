"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/elements/SectionHeader";
import { TestimonialCard } from "@/components/elements/TestimonialCard";

const testimonials = [
  {
    name: "Ana Souza",
    role: "Cliente",
    avatar: "/avatars/ana.png",
    message:
      "Me senti completamente renovada após a sessão. Atendimento incrível, recomendo demais!",
  },
  {
    name: "Carlos Oliveira",
    role: "Cliente",
    avatar: "/avatars/carlos.png",
    message:
      "Profissional excelente, atenciosa e muito competente. Saí muito mais leve e relaxado.",
  },
  {
    name: "Juliana Lima",
    role: "Cliente",
    avatar: "/avatars/juliana.png",
    message:
      "Experiência maravilhosa! Ambiente acolhedor e técnica impecável. Recomendo de olhos fechados.",
  },
  {
    name: "Juliana Sousa",
    role: "Cliente",
    avatar: "/avatars/juliana.png",
    message:
      "Experiência maravilhosa! Ambiente acolhedor e técnica impecável. Recomendo de olhos fechados.",
  },
];

export function TestimonialSection() {
  return (
    <section className="w-full py-24 md:py-32">
      <div className="container mx-auto px-4 flex flex-col gap-16">
        {/* Header */}
        <SectionHeader
          title="O que meus clientes dizem"
          background="Depoimentos"
          backgroundSize="text-[clamp(3rem,8vw,8rem)]"
        />

        {/* Grid de Depoimentos */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.name}
              name={testimonial.name}
              role={testimonial.role}
              message={testimonial.message}
              avatar={testimonial.avatar}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
