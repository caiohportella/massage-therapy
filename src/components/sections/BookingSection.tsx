"use client";

import { useBookingStore } from "@/store/booking-store";
import { motion, AnimatePresence } from "framer-motion";

import { SectionHeader } from "@/components/elements/SectionHeader";
import { MultiStepForm } from "@/components/elements/MultiStepForm";

export function BookingSection() {
  const step = useBookingStore((state) => state.step);
  const selectedDate = useBookingStore((state) => state.selectedDate);

  const isDateSelected = !!selectedDate;
  const isServiceStep = step >= 2;

  return (
    <section className="w-full py-24 md:py-32">
      <div className="container mx-auto px-4 flex flex-col gap-24 items-center">
        <SectionHeader title="Agende sua sessão" background="Booking" />

        <motion.div
          layout
          animate={{
            maxWidth: isDateSelected || isServiceStep ? "80rem" : "26rem",
            minHeight: isServiceStep
              ? "48rem"
              : isDateSelected
              ? "36rem"
              : "auto",
          }}
          transition={{ duration: 1.2, ease: [0.25, 0.8, 0.25, 1] }}
          className="
            w-full 
            rounded-[var(--radius-lg)] 
            border border-border 
            backdrop-blur-xl 
            bg-foreground/5 
            p-8 
            flex 
            flex-col 
            gap-8
            overflow-hidden
          "
        >
          <AnimatePresence mode="wait">
            <MultiStepForm />
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
