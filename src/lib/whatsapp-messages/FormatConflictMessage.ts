

interface ConflictMessageParams {
    name: string;
    requestedDate: string;
    requestedTime: string;
    alternativeSlots: { date: string; time: string }[];
    rescheduleUrl: string;
}

export function formatConflictMessage({
    name,
    requestedDate,
    requestedTime,
    alternativeSlots,
    rescheduleUrl,
}: ConflictMessageParams): string {
    const formattedDate = new Date(requestedDate).toLocaleDateString("pt-BR");

    const alternativesText = alternativeSlots
        .slice(0, 3)
        .map((slot) => {
            const slotDate = new Date(slot.date).toLocaleDateString("pt-BR");
            return `  📅 ${slotDate} às ${slot.time}`;
        })
        .join("\n");

    return `
Olá, ${name}! ⚠️

Infelizmente, o horário solicitado não está disponível:
❌ ${formattedDate} às ${requestedTime}

Mas não se preocupe! Aqui estão algumas alternativas:

${alternativesText}

Para reagendar, acesse:
🔗 ${rescheduleUrl}

Seu pagamento foi recebido e será processado assim que escolher um novo horário.

Dúvidas? Responda esta mensagem. 🙌
  `.trim();
}
