"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "../ui/button";
import { createPixPayment } from "@/app/actions/abacate-pay";
import { useState } from "react";
import { Loader2 } from "lucide-react";
// import { GlassBackground } from "@/components/layout/GlassBackground";

export function HeroSection() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleTestPixPayment() {
    setIsLoading(true);

    try {
      // Fake product for testing - R$1.00 (100 centavos)
      const products = [
        {
          externalId: "test-product-001",
          name: "Produto Teste",
          description: "Produto de teste para validar integração Pix",
          quantity: 1,
          price: 100, // R$1.00 in centavos
        },
      ];

      // Fake customer for testing
      const customer = {
        name: "Cliente Teste",
        taxId: "39709528831",
        cellphone: "(11) 99999-9999",
        email: "teste@exemplo.com",
      };

      const response = await createPixPayment(products, customer);

      if ("error" in response && response.error) {
        console.error("Erro ao criar pagamento:", response.error);
        setIsLoading(false);
        return;
      }

      // Redirect to AbacatePay checkout page
      if ("data" in response && response.data?.url) {
        window.location.href = response.data.url;
      } else {
        console.error("URL de pagamento não encontrada");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Erro ao processar pagamento:", err);
      setIsLoading(false);
    }
  }

  return (
    <section className="relative w-full py-24 md:py-32">
      {/* <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/hero_background.png"
          alt="Shiatsu Hero"
          width={1910}
          height={720}
          className="
              opacity-5 
              w-full h-full
              pointer-events-none 
              select-none
            "
        />
      </div> */}

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

            {/* CTA Button - Test Pix Payment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              viewport={{ amount: 0.3 }}
            >
              <Button
                onClick={handleTestPixPayment}
                disabled={isLoading}
                className="cursor-pointer"
              >
                {isLoading ? (
                  <>
                    Processando...
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  </>
                ) : (
                  "Testar Pagamento Pix (R$1,00)"
                )}
              </Button>
            </motion.div>
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