"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export function BookingCalendar({
  selectedDate,
  onDateChange,
}: BookingCalendarProps) {
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);

  const [captionLayout, setCaptionLayout] =
    useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
      "dropdown"
    );

  useEffect(() => {
    async function fetchUnavailableDates() {
      const current = selectedDate ?? new Date();
      const year = current.getFullYear();
      const month = current.getMonth() + 1; // API espera month 1-indexado

      const res = await fetch(
        `/api/calendar/unavailable-times?year=${year}&month=${month}`
      );

      const data = await res.json();
      const dates = data.unavailable.map((d: string) => new Date(d));

      setUnavailableDates(dates);
    }

    fetchUnavailableDates();
  }, [selectedDate]);

  return (
    <div className="flex flex-col gap-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateChange}
        defaultMonth={selectedDate}
        disabled={unavailableDates}
        showOutsideDays={false}
        captionLayout={captionLayout}
        locale={ptBR}
        modifiers={{
          unavailable: unavailableDates,
        }}
        modifiersClassNames={{
          unavailable: "[&>button]:line-through opacity-50 pointer-events-none",
        }}
        className={cn(
          "bg-transparent p-0",
          "[--cell-size:2.5rem] md:[--cell-size:3rem]",
          "[&_.rdp-day_selected]:bg-accent [&_.rdp-day_selected]:text-accent-foreground",
          "[&_.rdp-day_today]:border [&_.rdp-day_today]:border-accent"
        )}
        onMonthChange={(date) => {
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          fetch(`/api/calendar/unavailable-times?year=${year}&month=${month}`)
            .then((res) => res.json())
            .then((data) => {
              const dates = data.unavailable.map((d: string) => new Date(d));
              setUnavailableDates(dates);
            });
        }}
      />
    </div>
  );
}
