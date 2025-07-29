"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";
import { debounce } from "@/lib/utils";
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
  const [captionLayout, _] =
    useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
      "dropdown"
    );

  const getCachedDates = useCalendarStore((s) => s.getCachedDates);
  const isFetched = useCalendarStore((s) => s.isFetched);
  const setDates = useCalendarStore((s) => s.setDates);

  const fetchUnavailableDatesRef = useRef(
    debounce(async (year: number, month: number) => {
      const key = `${year}-${month}`;
      if (isFetched(key)) {
        const cached = getCachedDates(key);
        if (cached) setUnavailableDates(cached);
        return;
      }
      const res = await fetch(
        `/api/calendar/unavailable-times?year=${year}&month=${month}`
      );
      const data = await res.json();
      const dates = data.unavailable.map((d: string) => new Date(d));
      setDates(key, dates);
      setUnavailableDates(dates);
    }, 87400)
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    fetchUnavailableDatesRef.current(year, month);
  }, [getCachedDates, isFetched, setDates]);

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
          captionLayout={captionLayout}
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
            fetchUnavailableDatesRef.current(year, month);
          }}
        />
      )}
    </div>
  );
}
