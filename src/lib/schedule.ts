import { addMinutes, format, isBefore, isSameDay, addHours } from "date-fns";
import { calendar } from "./GoogleCalendar";
import { CALENDAR_ID, SLOT_DURATION, SLOT_PADDING, TIMEZONE } from "./constants";
import { BusyTime } from "@/lib/types"; // Removed WorkingHour from import
import { prisma } from "./prisma";

if (!CALENDAR_ID) throw new Error("GOOGLE_CALENDAR_ID não definido.");

export async function getAvailableSlotsForDate(date: Date) {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  // console.log("getAvailableSlotsForDate called for date:", normalizedDate.toDateString(), normalizedDate.toISOString());
  const dayOfWeek = normalizedDate.getDay(); // 0 = domingo, 1 = segunda, ...
  // console.log("Day of week:", dayOfWeek);

  // 1. Buscar os horários configurados para esse dia da semana
  const workingHours = await prisma.workingHours.findMany({
    where: { dayOfWeek },
  });
  // console.log("Working hours for dayOfWeek", dayOfWeek, ":", workingHours);

  if (!workingHours.length) {
    // console.log("No working hours found, returning empty array.");
    return [];
  }

  // 2. Buscar os horários ocupados no Google Calendar
  const startOfDay = new Date(normalizedDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(normalizedDate.setHours(23, 59, 59, 999));
  // console.log("startOfDay:", startOfDay.toISOString(), "endOfDay:", endOfDay.toISOString());

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      timeZone: TIMEZONE,
      items: [{ id: CALENDAR_ID }],
    },
  });

  const busySlots = res.data.calendars?.[CALENDAR_ID!]?.busy as BusyTime[] ?? [];
  // console.log("Busy slots from Google Calendar:", busySlots);

  // 3. Gerar todos os slots disponíveis com base nos working hours
  const slots: string[] = [];
  const now = new Date();
  const cutoffTime = addHours(now, 2); // Current time + 2 hours for booking cut-off
  const isToday = isSameDay(normalizedDate, now);

  for (const period of workingHours) {
    // console.log("Processing working period:", period);
    const slotStart = new Date(
      startOfDay.getTime() + period.startTime * 60_000
    );
    const slotEnd = new Date(startOfDay.getTime() + period.endTime * 60_000);
    // console.log("Period slotStart:", slotStart.toISOString(), "Period slotEnd:", slotEnd.toISOString());

    let current = slotStart;

    while (addMinutes(current, SLOT_DURATION) <= slotEnd) {
      const currentSlotStart = current;
      const currentSlotEnd = addMinutes(current, SLOT_DURATION);

      const overlap = busySlots.some(
        (busy) =>
          new Date(busy.start) < currentSlotEnd && new Date(busy.end) > currentSlotStart
      );

      // Filter out past slots for today's date only, considering a 2-hour buffer
      const isPastForTodayWithBuffer = isToday && isBefore(currentSlotStart, cutoffTime);

      // console.log(`    Slot ${format(currentSlotStart, "HH:mm")}-${format(currentSlotEnd, "HH:mm")}: overlap=${overlap}, isPastForTodayWithBuffer=${isPastForTodayWithBuffer}`);

      if (!overlap && !isPastForTodayWithBuffer) {
        slots.push(format(currentSlotStart, "HH:mm"));
        // console.log("      Slot added:", format(currentSlotStart, "HH:mm"));
      }

      current = addMinutes(current, SLOT_DURATION + SLOT_PADDING);
    }
  }

  // console.log("Final generated slots:", slots);
  return slots;
}
