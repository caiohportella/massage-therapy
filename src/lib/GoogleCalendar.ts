import { google } from "googleapis";
import { APPOINTMENT_LOCATION, SLOT_DURATION, SLOT_PADDING } from "./constants";
import { BusyTime } from "./types";


const calendarId = process.env.GOOGLE_CALENDAR_ID;
const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;

const busyCache = new Map<string, { timestamp: number; data: BusyTime[] }>();

if (!calendarId || !privateKey || !clientEmail) {
  throw new Error("Faltam variáveis de ambiente do Google Calendar.");
}

const auth = new google.auth.JWT({
  email: clientEmail,
  key: privateKey,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

export const calendar = google.calendar({ version: "v3", auth });

export async function getBusyTimes(date: string) {
  const now = Date.now();
  // const cached = busyCache.get(date);

  // Se estiver no cache e for recente (< 1 dia)
  // if (cached && now - cached.timestamp < 86_400_000) {
  //   return cached.data;
  // }

  const day = new Date(date);
  const start = new Date(day.setHours(0, 0, 0, 0)).toISOString();
  const end = new Date(day.setHours(23, 59, 59, 999)).toISOString();

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: start,
      timeMax: end,
      timeZone: "America/Sao_Paulo",
      items: [{ id: calendarId as string }],
    },
  });

  const busyRaw = res.data.calendars?.[calendarId as string]?.busy || [];
  const busy: BusyTime[] = busyRaw
    .filter((b) => typeof b.start === "string" && typeof b.end === "string")
    .map((b) => ({
      start: b.start as string,
      end: b.end as string,
    }));

  busyCache.set(date, { timestamp: now, data: busy });

  return busy;
}

/**
 * Check if a specific time slot has conflicts
 */
export async function checkForConflicts({
  date,
  time,
  durationMinutes,
}: {
  date: string;
  time: string;
  durationMinutes: number;
}): Promise<{ hasConflict: boolean; conflictingEvents: BusyTime[] }> {
  const [hour, minute] = time.split(":").map(Number);
  const startDate = new Date(`${date}T${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      timeZone: "America/Sao_Paulo",
      items: [{ id: calendarId as string }],
    },
  });

  const busyRaw = res.data.calendars?.[calendarId as string]?.busy || [];
  const conflictingEvents: BusyTime[] = busyRaw
    .filter((b) => typeof b.start === "string" && typeof b.end === "string")
    .map((b) => ({
      start: b.start as string,
      end: b.end as string,
    }));

  return {
    hasConflict: conflictingEvents.length > 0,
    conflictingEvents,
  };
}

/**
 * Get available time slots for the next several days
 */
export async function getAvailableSlots({
  startDate,
  durationMinutes,
  daysToCheck = 7,
  slotsToReturn = 5,
}: {
  startDate: string;
  durationMinutes: number;
  daysToCheck?: number;
  slotsToReturn?: number;
}): Promise<{ date: string; time: string }[]> {
  const availableSlots: { date: string; time: string }[] = [];
  const workingHours = { start: 8, end: 18 }; // 8 AM to 6 PM
  const slotDuration = durationMinutes + SLOT_PADDING;

  for (let dayOffset = 0; dayOffset < daysToCheck && availableSlots.length < slotsToReturn; dayOffset++) {
    const checkDate = new Date(startDate);
    checkDate.setDate(checkDate.getDate() + dayOffset);

    // Skip Sundays (0)
    if (checkDate.getDay() === 0) continue;

    const dateStr = checkDate.toISOString().split("T")[0];
    const busyTimes = await getBusyTimes(dateStr);

    // Generate all possible slots for the day
    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (availableSlots.length >= slotsToReturn) break;

        const slotStart = new Date(`${dateStr}T${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`);
        const slotEnd = new Date(slotStart.getTime() + slotDuration * 60 * 1000);

        // Skip if slot ends after working hours
        if (slotEnd.getHours() > workingHours.end ||
          (slotEnd.getHours() === workingHours.end && slotEnd.getMinutes() > 0)) {
          continue;
        }

        // Check if slot conflicts with any busy time
        const hasConflict = busyTimes.some((busy) => {
          const busyStart = new Date(busy.start);
          const busyEnd = new Date(busy.end);
          return slotStart < busyEnd && slotEnd > busyStart;
        });

        if (!hasConflict) {
          availableSlots.push({
            date: dateStr,
            time: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
          });
        }
      }
    }
  }

  return availableSlots;
}

// Criação de evento no Google Calendar
export async function createGoogleCalendarEvent({
  date,
  time,
  name,
  email,
  services,
  durationMinutes,
  rescheduleUrl,
}: {
  date: string;
  time: string;
  name: string;
  email?: string;
  services: string[];
  durationMinutes?: number;
  rescheduleUrl?: string;
}) {
  const [hour, minute] = time.split(":").map(Number);
  const start = new Date(
    `${date}T${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}:00`
  );
  const duration = durationMinutes || SLOT_DURATION;
  const end = new Date(start.getTime() + duration * 60 * 1000);

  const description = [
    `Cliente: ${name}`,
    email ? `Email: ${email}` : null,
    `Serviços: ${services.join(", ")}`,
    rescheduleUrl ? `\nPara reagendar ou cancelar: ${rescheduleUrl}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const event = await calendar.events.insert({
    calendarId: calendarId as string,
    requestBody: {
      summary: `Atendimento - ${name}`,
      description,
      start: {
        dateTime: start.toISOString(),
        timeZone: "America/Sao_Paulo",
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: "America/Sao_Paulo",
      },
      location: APPOINTMENT_LOCATION,
    },
  });

  return event.data;
}

