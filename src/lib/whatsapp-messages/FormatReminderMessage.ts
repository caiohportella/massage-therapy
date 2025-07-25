import { APPOINTMENT_LOCATION } from "@/lib/constants";

export function formatReminderMessage({
  name,
  date,
  time,
  services,
  location = APPOINTMENT_LOCATION,
}: {
  name: string;
  date: string;
  time: string;
  services: string[];
  location?: string;
}) {
  const formattedDate = new Date(date).toLocaleDateString("pt-BR");
  const formattedTime = time;
  const servicesList = services.join(", ");

  return `
🔔 Olá, ${name}!

Esse é um lembrete do seu atendimento:

📅 ${formattedDate} às ⏰ ${formattedTime}
🛠️ Serviços: ${servicesList}

📍 Local: ${location}

Nos vemos em breve! 💆‍♀️✨
Caso precise de algo, é só responder por aqui.
`.trim();
}
