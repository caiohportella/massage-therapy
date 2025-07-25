import { APPOINTMENT_LOCATION } from "@/lib/constants";

export function formatCancellationMessage({
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
Olá, ${name}. ⚠️

Seu atendimento agendado para:

📅 ${formattedDate} às ⏰ ${formattedTime}

🛠️ Serviços: ${servicesList}

📍 Local: ${location}

Foi **cancelado** conforme sua solicitação.

Caso deseje remarcar, estaremos à disposição. 😊
`.trim();
}
