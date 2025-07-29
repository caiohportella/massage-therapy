"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";
import { useCalendarStore } from "@/store/calendar-store";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export function BookingCalendar({
  selectedDate,
  onDateChange,
}: BookingCalendarProps) {
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [mounted, setMounted] = useState(false);

  const getCachedDates = useCalendarStore((s) => s.getCachedDates);
  const isFetched = useCalendarStore((s) => s.isFetched);
  const setDates = useCalendarStore((s) => s.setDates);

  const fetchUnavailableDates = useRef<
    ((year: number, month: number) => void) | null
  >(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    fetchUnavailableDates.current = (year: number, month: number) => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        const key = `${year}-${month}`;
        if (isFetched(key)) {
          const cached = getCachedDates(key);
          if (cached) {
            setUnavailableDates(cached);
            return;
          }
        }

        fetch(`/api/calendar/unavailable-times?year=${year}&month=${month}`)
          .then((res) => res.json())
          .then((data) => {
            const dates = data.unavailable.map((d: string) => new Date(d));
            setDates(key, dates);
            setUnavailableDates(dates);
          });
      }, 1000);
    };

    // cleanup se necessário
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isFetched, getCachedDates, setDates]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;

    fetchUnavailableDates.current?.(year, month);
  }, [selectedDate]);

  return (
    <div className="flex flex-col gap-4">
      {mounted && (
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateChange}
          defaultMonth={selectedDate}
          disabled={(date) =>
            date < new Date(new Date().setHours(0, 0, 0, 0)) ||
            unavailableDates.some(
              (d) => d.toDateString() === date.toDateString()
            )
          }
          showOutsideDays={false}
          captionLayout="dropdown"
          locale={ptBR}
          modifiers={{ unavailable: unavailableDates }}
          modifiersClassNames={{
            unavailable:
              "[&>button]:line-through opacity-50 pointer-events-none",
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
            fetchUnavailableDates.current?.(year, month);
          }}
        />
      )}
    </div>
  );
}
