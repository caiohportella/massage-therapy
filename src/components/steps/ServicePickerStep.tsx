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

  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

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
      {/* Mobile: Compact vertical list */}
      <div className="block md:hidden">
        <div className="flex flex-col gap-2">
          {services.map((service) => {
            const alreadySelected = selectedServices.some(
              (s) => s.productId === service.id
            );
            const isExpanded = expandedServiceId === service.id;
            const hasMultipleDurations = service.durations.length > 1;
            const selectedOption = selectedOptions[service.id] ?? service.durations[0]?.label;
            const currentDuration = service.durations.find(d => d.label === selectedOption) ?? service.durations[0];

            return (
              <div
                key={service.id}
                className={`
                  border rounded-lg p-3 bg-background transition-all
                  ${alreadySelected ? 'border-primary ring-1 ring-primary/30' : 'border-border'}
                  ${service.durations.length === 0 ? 'opacity-50' : ''}
                `}
              >
                {/* Main row - always visible */}
                <div
                  className="flex items-center justify-between gap-3 cursor-pointer"
                  onClick={() => {
                    if (service.durations.length === 0) {
                      toast.error("Não é possível selecionar este serviço: nenhum preço BRL ativo.");
                      return;
                    }

                    if (hasMultipleDurations && !alreadySelected) {
                      // Toggle expand for multi-duration services
                      setExpandedServiceId(isExpanded ? null : service.id);
                    } else {
                      // Direct toggle for single-duration services
                      if (alreadySelected) {
                        setSelectedServices(
                          selectedServices.filter((s) => s.productId !== service.id)
                        );
                        toast.success("Serviço removido");
                      } else {
                        handleSelectService(service);
                        toast.success("Serviço adicionado");
                      }
                    }
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{service.name}</h4>
                    {currentDuration && (
                      <p className="text-xs text-muted-foreground">
                        {hasMultipleDurations && !alreadySelected ? (
                          <span className="text-primary">Toque para ver opções</span>
                        ) : (
                          <span>{currentDuration.label} — R$ {currentDuration.price.toFixed(2)}</span>
                        )}
                      </p>
                    )}
                    {service.durations.length === 0 && (
                      <p className="text-xs text-red-500">Indisponível</p>
                    )}
                  </div>

                  {/* Selection indicator */}
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                    ${alreadySelected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30'}
                  `}>
                    {alreadySelected && (
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Expanded section for duration selection */}
                {isExpanded && hasMultipleDurations && !alreadySelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 pt-3 border-t border-border"
                  >
                    <p className="text-xs text-muted-foreground mb-2">Escolha a duração:</p>
                    <div className="flex flex-col gap-1.5">
                      {service.durations.map((duration) => (
                        <button
                          key={duration.label}
                          className={`
                            w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                            ${selectedOptions[service.id] === duration.label
                              ? 'bg-primary/10 text-primary border border-primary/30'
                              : 'bg-muted/50 hover:bg-muted'}
                          `}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOptions((prev) => ({
                              ...prev,
                              [service.id]: duration.label,
                            }));
                          }}
                        >
                          <span className="font-medium">{duration.label}</span>
                          <span className="text-muted-foreground ml-2">— R$ {duration.price.toFixed(2)}</span>
                        </button>
                      ))}
                    </div>
                    <Button
                      className="w-full mt-3"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectService(service);
                        setExpandedServiceId(null);
                      }}
                    >
                      Adicionar serviço
                    </Button>
                  </motion.div>
                )}

                {/* Show remove button for selected multi-duration services */}
                {alreadySelected && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{selectedOptions[service.id] ?? service.durations[0]?.label}</span>
                      <button
                        className="text-red-500 hover:text-red-600 font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedServices(
                            selectedServices.filter((s) => s.productId !== service.id)
                          );
                          toast.success("Serviço removido");
                        }}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selection summary */}
        {selectedServices.length > 0 && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm font-medium text-primary">
              {selectedServices.length} serviço{selectedServices.length > 1 ? 's' : ''} selecionado{selectedServices.length > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Total: R$ {selectedServices.reduce((sum, s) => sum + s.price, 0).toFixed(2)}
            </p>
          </div>
        )}
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
