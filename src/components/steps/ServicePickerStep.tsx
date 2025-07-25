"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { useBookingStore } from "@/store/booking-store";
import { SERVICES } from "@/lib/constants";

export function ServicePickerStep() {
  const selectedDate = useBookingStore((s) => s.selectedDate);
  const selectedTime = useBookingStore((s) => s.selectedTime);

  const selectedServices = useBookingStore((s) => s.selectedServices);
  const setServices = useBookingStore((s) => s.setServices);

  const formattedDate = selectedDate
    ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR })
    : "";

  function toggleService(service: string) {
    if (selectedServices.includes(service)) {
      setServices(selectedServices.filter((s) => s !== service));
    } else {
      setServices([...selectedServices, service]);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full flex flex-col gap-6 relative"
    >
      {/* Data/hora para mobile: acima do título */}
      {selectedDate && selectedTime && (
        <div className="flex flex-col-reverse md:hidden gap-1 items-start px-4">
          <div className="flex items-center">
            <Calendar className="text-accent/50" />
            <span className="text-sm text-muted-foreground pl-2">
              {formattedDate}
            </span>
            <span className="ml-2 text-base font-semibold text-accent">
              {selectedTime}
            </span>
          </div>
        </div>
      )}

      {/* Data/hora para desktop: canto superior direito */}
      {selectedDate && selectedTime && (
        <div className="absolute top-0 right-0 flex-col items-end p-4 z-10 hidden md:flex">
          <span className="text-sm text-muted-foreground">
            {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </span>
          <span className="text-base font-semibold text-accent">
            {selectedTime}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold text-foreground">
          Escolha os serviços desejados
        </h3>
        <p className="text-muted-foreground">
          Você pode selecionar um ou mais serviços
        </p>
      </div>

      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          xl:grid-cols-4 
          gap-6
        "
      >
        {SERVICES.map((service) => {
          const isSelected = selectedServices.includes(service.name);
          return (
            <button
              key={service.name}
              onClick={() => toggleService(service.name)}
              className={cn(
                "group cursor-pointer select-none rounded-[var(--radius-lg)] border shadow-sm transition-all",
                isSelected
                  ? "border-accent bg-accent/10"
                  : "border-border hover:bg-foreground/5"
              )}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col h-full"
              >
                {/* Image */}
                <div className="w-full h-40 relative rounded-t-[var(--radius-lg)] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 p-4 flex-1">
                  <h3 className="text-base font-semibold text-foreground">
                    {service.name}
                  </h3>
                  <p className="text-sm text-muted-foreground flex-1">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
