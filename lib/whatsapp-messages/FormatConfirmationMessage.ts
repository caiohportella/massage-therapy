import { APPOINTMENT_LOCATION } from "@/lib/constants";

export function formatConfirmationMessage({
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
Olá, ${name}! ✅

Seu atendimento foi agendado com sucesso.

📅 Data: ${formattedDate}
⏰ Horário: ${formattedTime}
🛠️ Serviços: ${servicesList}

📍 Local: ${location}

Se desejar, pode responder essa mensagem para confirmar ou tirar dúvidas.

Agradecemos pela confiança! 🙌
`.trim();
}
