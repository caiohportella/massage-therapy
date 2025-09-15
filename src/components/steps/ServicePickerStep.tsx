"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useServiceStore } from "@/store/service-store";
import { useBookingStore } from "@/store/booking-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Service } from "@/lib/types";

export function ServicePickerStep() {
  const { services, isFetched, setServices } = useServiceStore();
  const { selectedServices, setServices: setSelectedServices } =
    useBookingStore();

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (isFetched) return;

    fetch("/api/stripe/products")
      .then((res) => res.json())
      .then(setServices)
      .catch(() => toast.error("Erro ao carregar serviços"));
  }, [isFetched, setServices]);

  const handleSelectService = (service: Service) => {
    const selectedLabel =
      selectedOptions[service.id] ?? service.durations[0].label;

    const selectedDuration = service.durations.find(
      (d) => d.label === selectedLabel
    );

    if (!selectedDuration) return;

    const newService = {
      productId: service.id,
      name: service.name,
      price: selectedDuration.price,
      priceId: selectedDuration.priceId,
      quantity: 1,
      durationLabel: selectedDuration.label,
      duration: selectedDuration.duration ?? 60,
    };

    setSelectedServices([...selectedServices, newService]);
    toast.success("Serviço adicionado ao agendamento");
  };

  if (!services) {
    return (
      <div className="flex items-center justify-center h-48">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Mobile: Scroll horizontal */}
      <div className="block md:hidden">
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-2">
            {services.map((service) => {
              const alreadySelected = selectedServices.some(
                (s) => s.productId === service.id
              );

              return (
                <div
                  key={service.id}
                  className="min-w-[85vw] shrink-0 border rounded-xl p-4 shadow-sm bg-background flex flex-col justify-between"
                >
                  <div className="space-y-4 flex-grow">
                    {service.image && (
                      <Image
                        src={service.image}
                        alt={service.name}
                        width={400}
                        height={200}
                        className="rounded-md object-cover w-full h-[180px]"
                      />
                    )}
                    <h3 className="text-xl font-semibold">{service.name}</h3>
                    {service.durations.length > 1 ? (
                      <Select
                        onValueChange={(value) =>
                          setSelectedOptions((prev) => ({
                            ...prev,
                            [service.id]: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha a duração" />
                        </SelectTrigger>
                        <SelectContent>
                          {service.durations.map((duration) => (
                            <SelectItem
                              key={duration.label}
                              value={duration.label}
                            >
                              {duration.label} — R$ {duration.price.toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : service.durations.length === 1 ? (
                      <p className="text-muted-foreground text-sm">
                        {service.durations[0].label} — R${" "}
                        {service.durations[0].price.toFixed(2)}
                      </p>
                    ) : (
                      <p className="text-red-500 text-sm">Nenhum preço BRL ativo configurado.</p>
                    )}
                  </div>

                  <Button
                    className="w-full mt-6"
                    variant={alreadySelected ? "destructive" : "default"}
                    onClick={() => {
                      if (alreadySelected) {
                        setSelectedServices(
                          selectedServices.filter(
                            (s) => s.productId !== service.id
                          )
                        );
                        toast.success("Serviço removido do agendamento");
                      } else if (service.durations.length > 0) {
                        handleSelectService(service);
                      } else {
                        toast.error("Não é possível selecionar este serviço: nenhum preço BRL ativo.");
                      }
                    }}
                    disabled={service.durations.length === 0} // Disable button if no durations
                  >
                    {alreadySelected
                      ? "Remover serviço"
                      : service.durations.length === 0
                      ? "Indisponível"
                      : "Selecionar serviço"}
                  </Button>
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Desktop: grid padrão */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-6 mt-4">
        {services.map((service) => {
          const alreadySelected = selectedServices.some(
            (s) => s.productId === service.id
          );

          return (
            <div
              key={service.id}
              className="border rounded-xl p-4 shadow-sm bg-background h-full flex flex-col justify-between"
            >
              <div className="space-y-4 flex-grow">
                {service.image && (
                  <Image
                    src={service.image}
                    alt={service.name}
                    width={400}
                    height={200}
                    className="rounded-md object-cover w-full h-[180px]"
                  />
                )}
                <h3 className="text-xl font-semibold">{service.name}</h3>
                {service.durations.length > 1 ? (
                  <Select
                    onValueChange={(value) =>
                      setSelectedOptions((prev) => ({
                        ...prev,
                        [service.id]: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha a duração" />
                    </SelectTrigger>
                    <SelectContent>
                      {service.durations.map((duration) => (
                        <SelectItem key={duration.label} value={duration.label}>
                          {duration.label} — R$ {duration.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : service.durations.length === 1 ? (
                  <p className="text-muted-foreground text-sm">
                    {service.durations[0].label} — R${" "}
                    {service.durations[0].price.toFixed(2)}
                  </p>
                ) : (
                  <p className="text-red-500 text-sm">Nenhum preço BRL ativo configurado.</p>
                )}
              </div>

              <Button
                className="w-full mt-6 cursor-pointer"
                variant={alreadySelected ? "destructive" : "default"}
                onClick={() => {
                  if (alreadySelected) {
                    setSelectedServices(
                      selectedServices.filter((s) => s.productId !== service.id)
                    );
                    toast.success("Serviço removido do agendamento");
                  } else if (service.durations.length > 0) {
                    handleSelectService(service);
                  } else {
                    toast.error("Não é possível selecionar este serviço: nenhum preço BRL ativo.");
                  }
                }}
                disabled={service.durations.length === 0}
              >
                {alreadySelected
                  ? "Remover serviço"
                  : service.durations.length === 0
                  ? "Indisponível"
                  : "Selecionar serviço"}
              </Button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
