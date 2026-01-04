import { APPOINTMENT_LOCATION } from "@/lib/constants";

export function formatConfirmationMessage({
  name,
  date,
  time,
  services,
  location = APPOINTMENT_LOCATION,
  transactionId,
  rescheduleUrl,
}: {
  name: string;
  date: string;
  time: string;
  services: string[];
  location?: string;
  transactionId?: string;
  rescheduleUrl?: string;
}) {
  const formattedDate = new Date(date).toLocaleDateString("pt-BR");
  const formattedTime = time;
  const servicesList = services.join(", ");

  let message = `
Olá, ${name}! ✅

Seu atendimento foi agendado com sucesso.

📅 Data: ${formattedDate}
⏰ Horário: ${formattedTime}
🛠️ Serviços: ${servicesList}

📍 Local: ${location}
`;

  if (transactionId) {
    message += `\n💳 ID do Pagamento: ${transactionId}\n`;
  }

  if (rescheduleUrl) {
    message += `\n🔄 Para reagendar ou cancelar:\n${rescheduleUrl}\n`;
  }

  message += `
Se desejar, pode responder essa mensagem para confirmar ou tirar dúvidas.

Agradecemos pela confiança! 🙌`;

  return message.trim();
}

