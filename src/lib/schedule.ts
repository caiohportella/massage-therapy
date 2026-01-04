import { addMinutes, format, isBefore, isSameDay, addHours, startOfDay as dateFnsStartOfDay, endOfDay as dateFnsEndOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { calendar } from "./GoogleCalendar";
import { CALENDAR_ID, SLOT_DURATION, SLOT_PADDING, TIMEZONE } from "./constants";
import { BusyTime } from "@/lib/types";
import { prisma } from "./prisma";

if (!CALENDAR_ID) throw new Error("GOOGLE_CALENDAR_ID não definido.");

export async function getAvailableSlotsForDate(date: Date) {
  // Normalize to start of day without mutating the original date
  const normalizedDate = dateFnsStartOfDay(new Date(date));
  const dayOfWeek = normalizedDate.getDay(); // 0 = domingo, 1 = segunda, ...

  // 1. Buscar os horários configurados para esse dia da semana
  const workingHours = await prisma.workingHours.findMany({
    where: { dayOfWeek },
  });

  if (!workingHours.length) {
    return [];
  }

  // 2. Buscar os horários ocupados no Google Calendar
  const startOfDay = dateFnsStartOfDay(normalizedDate);
  const endOfDay = dateFnsEndOfDay(normalizedDate);

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      timeZone: TIMEZONE,
      items: [{ id: CALENDAR_ID }],
    },
  });

  const busySlots = res.data.calendars?.[CALENDAR_ID!]?.busy as BusyTime[] ?? [];

  // 3. Gerar todos os slots disponíveis com base nos working hours
  const slots: string[] = [];

  // Get current time in São Paulo timezone for accurate comparison
  const nowInTimezone = toZonedTime(new Date(), TIMEZONE);
  const cutoffTime = addHours(nowInTimezone, 2); // Current time + 2 hours for booking cut-off
  const isToday = isSameDay(normalizedDate, nowInTimezone);

  for (const period of workingHours) {
    const slotStart = new Date(startOfDay.getTime() + period.startTime * 60_000);
    const slotEnd = new Date(startOfDay.getTime() + period.endTime * 60_000);

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

      if (!overlap && !isPastForTodayWithBuffer) {
        slots.push(format(currentSlotStart, "HH:mm"));
      }

      current = addMinutes(current, SLOT_DURATION + SLOT_PADDING);
    }
  }

  return slots;
}

