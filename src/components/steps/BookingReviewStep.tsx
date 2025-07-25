"use client";

import { useBookingStore } from "@/store/booking-store";
import { SERVICES } from "@/lib/constants";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function BookingReviewStep() {
  const { selectedDate, selectedTime, selectedServices, personalData } =
    useBookingStore();

  // Lista de serviços com preço
  const serviceList = selectedServices.map((service) => {
    const serviceData = SERVICES.find((s) => s.name === service);
    return {
      ...serviceData,
      price: serviceData?.price ?? 0,
    };
  });

  const subtotal = serviceList.reduce((acc, item) => acc + item.price, 0);

  // Frete (placeholder, será dinâmico no backend)
  const deliveryFee: number = 0;

  const total = subtotal + deliveryFee;

  return (
    <Card className="relative overflow-visible">
      <CardHeader className="flex flex-col items-start pb-2 pt-6 px-6">
        <div className="w-full flex items-start justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <span>📝</span>
            Revisão e Confirmação
          </CardTitle>
          <Image
            src="/logo-receipt.png"
            alt="Logo"
            width={96}
            height={48}
            className="w-20 h-10 object-contain text-black"
            priority
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 px-6 pb-8">
        {/* Data e horário */}
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <span>📅</span>Data e horário
          </h3>
          <p className="text-accent font-medium">
            {selectedDate?.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}{" "}
            <span className="text-muted-foreground">às</span>{" "}
            <span className="text-accent font-bold">{selectedTime}</span>
          </p>
        </div>

        <Separator />

        {/* Serviços */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold flex items-center gap-2">
            <span>💆‍♀️</span>Serviços selecionados
          </h3>
          {serviceList.map((service) => (
            <div
              key={service.name}
              className="flex justify-between items-center"
            >
              <span>{service.name}</span>
              <span className="font-semibold text-accent">
                {service.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          ))}

          <Separator className="my-2" />

          <div className="flex justify-between font-semibold">
            <span>Subtotal</span>
            <span>
              {subtotal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        </div>

        <Separator />

        {/* Endereço */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold flex items-center gap-2">
            <span>📍</span>Endereço
          </h3>
          <p>
            {personalData.address}, {personalData.number}
            {personalData.complement && ` - ${personalData.complement}`}
            <br />
            {personalData.district} - {personalData.city} / {personalData.state}
            <br />
            CEP {personalData.zipCode}
          </p>

          <div className="flex justify-between">
            <span>Frete</span>
            <span className="font-semibold text-accent">
              {deliveryFee === 0
                ? "A calcular"
                : deliveryFee.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
            </span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between font-bold text-lg items-center">
          <span>
            <span className="mr-2">💰</span>Total
          </span>
          <span className="text-accent">
            {total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
