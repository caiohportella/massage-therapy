"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";
import { isSameDay, getMonth, getYear, parseISO } from "date-fns";
import { useCalendarStore } from "@/store/calendar-store";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined, isAvailable: boolean, isUserInteraction: boolean) => void;
}

export function BookingCalendar({
  selectedDate: propSelectedDate,
  onDateChange,
}: BookingCalendarProps) {
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([] as Date[]);
  const [unavailableDatesLoaded, setUnavailableDatesLoaded] = useState(false); // New state
  const [mounted, setMounted] = useState(false);
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | undefined>(propSelectedDate);
  const [currentMonth, setCurrentMonth] = useState<Date>(propSelectedDate || new Date()); // New state for current month

  const { getCachedDates, setDates } = useCalendarStore();

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    setUnavailableDatesLoaded(false); // Reset when month changes

    const yearVal = getYear(currentMonth);
    const monthIdx = getMonth(currentMonth);
    const key = `${yearVal}-${monthIdx + 1}`;

    const cachedDates = getCachedDates(key);
    if (cachedDates) {
      setUnavailableDates(cachedDates);
      setUnavailableDatesLoaded(true); // Set true if from cache
      return;
    }

    fetch(
      `/api/calendar/unavailable-times?year=${yearVal}&month=${
        monthIdx + 1
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        const dates = data.unavailable.map((dateStr: string) => parseISO(dateStr));
        setUnavailableDates(dates);
        setDates(key, dates);
        setUnavailableDatesLoaded(true); // Set true after fetching
      })
      .catch((error) => {
        console.error("Error fetching unavailable dates:", error);
        setUnavailableDatesLoaded(true); // Still set to true to unblock rendering
      });
  }, [currentMonth, mounted, getCachedDates, setDates]); // Depend on currentMonth

  // Removed Auto-advance logic
  // useEffect(() => {
  //   if (mounted && unavailableDatesLoaded && internalSelectedDate && isSameDay(internalSelectedDate, today)) {
  //     const isTodayUnavailable = unavailableDates.some((d) =>
  //       isSameDay(d, today)
  //     );

  //     console.log("Auto-advance check: Today unavailable?", isTodayUnavailable, "unavailableDates:", unavailableDates);

  //     if (isTodayUnavailable) {
  //       console.log("Today is unavailable, attempting to auto-advance.");
  //       let nextAvailableDay = addDays(today, 1);
  //       let found = false;

  //       for (let i = 0; i < 30; i++) { // Check up to next 30 days
  //         const isDayUnavailable = unavailableDates.some((d) =>
  //           isSameDay(d, nextAvailableDay)
  //         );
  //         const isDayPast = nextAvailableDay < today;
  //         const isSunday = nextAvailableDay.getDay() === 0;

  //         console.log(`Checking day ${nextAvailableDay.toDateString()}: Unavailable=${isDayUnavailable}, Past=${isDayPast}, Sunday=${isSunday}`);

  //         if (!isDayUnavailable && !isDayPast && !isSunday) {
  //           found = true;
  //           break;
  //         }
  //         nextAvailableDay = addDays(nextAvailableDay, 1);
  //       }

  //       if (found) {
  //         console.log("Found next available day:", nextAvailableDay.toDateString());
  //         onDateChange(nextAvailableDay, true, false); // Auto-advance, not user interaction
  //         setInternalSelectedDate(nextAvailableDay); // Update internal state
  //       } else {
  //         console.log("No available day found within 30 days.");
  //       }
  //     }
  //   }
  // },
  // [unavailableDates, mounted, internalSelectedDate, onDateChange, today, unavailableDatesLoaded]
  // );

  return (
    <div className="flex flex-col gap-4">
      {mounted && !unavailableDatesLoaded && (
        <div className="flex items-center justify-center h-48">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      {mounted && unavailableDatesLoaded && (
        <Calendar
          mode="single"
          selected={internalSelectedDate}
          onSelect={(date) => {
            setInternalSelectedDate(date);
            if (date) {
              const isSelectedDateDisabled = date.getDay() === 0 || date < today || unavailableDates.some((d) => isSameDay(d, date));
              onDateChange(date, !isSelectedDateDisabled, true); // User interaction
            } else {
              onDateChange(undefined, false, true); // User interaction, unselected
            }
          }}
          defaultMonth={currentMonth} // Use currentMonth for default display
          onMonthChange={setCurrentMonth} // Update currentMonth when user navigates
          disabled={(date) => {
            const isDisabled = date.getDay() === 0 || date < today || unavailableDates.some((d) => isSameDay(d, date));
            return isDisabled;
          }}
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
        />
      )}
    </div>
  );
}
