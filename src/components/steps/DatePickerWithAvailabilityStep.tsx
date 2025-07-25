"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

import { Calendar } from "@/components/ui/calendar";

import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/store/booking-store";
import { cn } from "@/lib/utils";
import { BookingCalendar } from "../elements/BookingCalendar";

export function DatePickerWithAvailabilityStep() {
  const selectedDate = useBookingStore((s) => s.selectedDate);
  const selectedTime = useBookingStore((s) => s.selectedTime);
  const setSelectedDate = useBookingStore((s) => s.setSelectedDate);
  const setSelectedTime = useBookingStore((s) => s.setSelectedTime);
  const nextStep = useBookingStore((s) => s.nextStep);

  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);

  const currentMonth = selectedDate ?? new Date();

  // Buscar datas indisponíveis (baseado na API que consulta Google Calendar)
  useEffect(() => {
    async function fetchUnavailableDates() {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1; // +1 porque mês começa em 0

      const res = await fetch(
        `/api/calendar/unavailable-times?year=${year}&month=${month}`
      );
      const data = await res.json();

      const dates = data.unavailable.map(
        (dateStr: string) => new Date(dateStr)
      );
      setUnavailableDates(dates);
    }

    fetchUnavailableDates();
  }, [currentMonth]);

  // Buscar horários disponíveis para a data selecionada
  useEffect(() => {
    if (!selectedDate) return;

    setLoadingTimes(true);
    fetch(
      `/api/calendar/available-times?date=${format(selectedDate, "yyyy-MM-dd")}`
    )
      .then((res) => res.json())
      .then((data) => {
        setAvailableTimes(data.available ?? []);
      })
      .catch(() => {
        setAvailableTimes([]);
      })
      .finally(() => setLoadingTimes(false));
  }, [selectedDate]);

  function handleConfirm() {
    if (selectedDate && selectedTime) {
      nextStep();
    }
  }

  return (
    <motion.div
      animate={{
        maxWidth: selectedDate ? "80rem" : "26rem",
        minHeight: selectedDate ? "36rem" : "auto",
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="
        w-full 
        rounded-[var(--radius-lg)] 
        border border-border 
        backdrop-blur-xl 
        bg-foreground/5 
        p-8 
        flex 
        flex-col 
        md:flex-row 
        gap-8
      "
    >
      {/* Calendário */}
      <div
        className={cn(
          "w-full",
          selectedDate
            ? "md:w-1/2"
            : "flex justify-center items-center min-h-[340px]"
        )}
      >
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-foreground text-center md:text-left">
            Selecione uma data
          </h3>

          <BookingCalendar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
      </div>

      {/* Horários */}
      <AnimatePresence mode="wait">
        {selectedDate && (
          <motion.div
            key={selectedDate.toDateString()}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full md:w-1/2 flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-foreground">
                {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </h3>
              <p className="text-muted-foreground">
                Selecione um horário disponível
              </p>
            </div>

            {loadingTimes ? (
              <p className="text-muted-foreground">Carregando horários...</p>
            ) : availableTimes.length === 0 ? (
              <p className="text-muted-foreground">
                Nenhum horário disponível para este dia.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {availableTimes.map((time) => (
                  <Button
                    key={time}
                    variant={time === selectedTime ? "default" : "outline"}
                    onClick={() => setSelectedTime(time)}
                    className="w-full"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
