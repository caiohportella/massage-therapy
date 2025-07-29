import { google } from "googleapis";
import { APPOINTMENT_LOCATION } from "./constants";
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
  const cached = busyCache.get(date);

  // Se estiver no cache e for recente (< 1 dia)
  if (cached && now - cached.timestamp < 86_400_000) {
    return cached.data;
  }

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

// Criação de evento no Google Calendar
export async function createGoogleCalendarEvent({
  date,
  time,
  services,
}: {
  date: string;
  time: string;
  name: string;
  services: string[];
}) {
  const [hour, minute] = time.split(":").map(Number);
  const start = new Date(
    `${date}T${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}:00`
  );
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const event = await calendar.events.insert({
    calendarId: calendarId as string,
    requestBody: {
      summary: `Atendimento - Massoterapia`,
      description: `Serviços: ${services.join(", ")}`,
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
