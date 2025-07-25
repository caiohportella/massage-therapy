import { getBusyTimes } from "./GoogleCalendar";

export function getTimeSlotsForDate(date: string) {
  const day = new Date(date);
  const dayOfWeek = day.getDay(); // 0 (domingo) a 6 (sábado)

  const slots: string[] = [];

  let workingPeriods: { start: number; end: number }[] = [];

  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    // Segunda a sexta: 14h às 20h
    workingPeriods = [{ start: 14, end: 20 }];
  } else if (dayOfWeek === 6) {
    // Sábado: 8h às 12h e 14h às 15h
    workingPeriods = [
      { start: 8, end: 12 },
      { start: 14, end: 15 },
    ];
  } else {
    // Domingo não trabalha
    return [];
  }

  workingPeriods.forEach(({ start, end }) => {
    let currentHour = start;
    let currentMinute = 0;

    while (currentHour + 1 <= end) {
      const hourStr = currentHour.toString().padStart(2, "0");
      const minuteStr = currentMinute.toString().padStart(2, "0");
      slots.push(`${hourStr}:${minuteStr}`);

      // Incrementa com duração + intervalo
      const next = new Date(0, 0, 0, currentHour, currentMinute);
      next.setMinutes(next.getMinutes() + 60 + 15); // 1h atendimento + 15min intervalo

      currentHour = next.getHours();
      currentMinute = next.getMinutes();
    }
  });

  return slots;
}

export async function getUnavailableSlotsForDate(date: string) {
  const busyTimes = await getBusyTimes(date);
  const allSlots = getTimeSlotsForDate(date);

  const unavailableSlots = allSlots.filter((slot) => {
    const [hour, minute] = slot.split(":").map(Number);

    const slotStart = new Date(
      `${date}T${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}:00`
    );
    const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000); // 1h de duração

    return busyTimes.some((busy) => {
      if (!busy.start || !busy.end) return false;

      const busyStart = new Date(busy.start);
      const busyEnd = new Date(busy.end);

      const bufferStart = new Date(busyStart.getTime() - 15 * 60 * 1000);
      const bufferEnd = new Date(busyEnd.getTime() + 15 * 60 * 1000);

      return slotStart < bufferEnd && slotEnd > bufferStart;
    });
  });

  return unavailableSlots;
}

export async function getAvailableSlotsForDate(date: string) {
  const allSlots = getTimeSlotsForDate(date);
  const unavailable = await getUnavailableSlotsForDate(date);

  const availableSlots = allSlots.filter((slot) => !unavailable.includes(slot));

  return availableSlots;
}
