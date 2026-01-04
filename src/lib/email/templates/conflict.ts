interface ConflictEmailParams {
    name: string;
    requestedDate: string;
    requestedTime: string;
    alternativeSlots: { date: string; time: string }[];
    rescheduleUrl: string;
}

export function generateConflictEmailHtml({
    name,
    requestedDate,
    requestedTime,
    alternativeSlots,
    rescheduleUrl,
}: ConflictEmailParams): string {
    const formattedDate = new Date(requestedDate).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const alternativeSlotsHtml = alternativeSlots
        .slice(0, 5)
        .map((slot) => {
            const slotDate = new Date(slot.date).toLocaleDateString("pt-BR", {
                weekday: "short",
                day: "numeric",
                month: "short",
            });
            return `
        <li style="padding: 10px; background-color: #f0fdf4; border-radius: 6px; margin-bottom: 8px; color: #166534;">
          📅 ${slotDate} às ${slot.time}
        </li>
      `;
        })
        .join("");

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Conflito de Horário</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="color: #fff; margin: 0; font-size: 24px;">Massoterapia</h1>
      <p style="color: #fef3c7; margin: 8px 0 0; font-size: 14px;">Aviso de Conflito de Horário</p>
    </div>

    <!-- Content -->
    <div style="background-color: #fff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background-color: #fef3c7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
          <span style="color: #d97706; font-size: 30px;">⚠️</span>
        </div>
        <h2 style="color: #d97706; margin: 15px 0 5px;">Horário Indisponível</h2>
        <p style="color: #6b7280; margin: 0;">Olá, ${name}!</p>
      </div>

      <!-- Conflict Details -->
      <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ef4444;">
        <p style="margin: 0; color: #991b1b;">
          Infelizmente, o horário solicitado não está disponível:
        </p>
        <p style="margin: 10px 0 0; color: #7f1d1d; font-weight: 600;">
          ${formattedDate} às ${requestedTime}
        </p>
      </div>

      <!-- Alternative Slots -->
      <div style="margin-bottom: 25px;">
        <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 16px;">✨ Horários Alternativos Disponíveis</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${alternativeSlotsHtml}
        </ul>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 25px 0;">
        <a href="${rescheduleUrl}" style="display: inline-block; background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%); color: #fff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Reagendar Agora
        </a>
      </div>

      <!-- Help Text -->
      <div style="text-align: center; padding: 15px; background-color: #f8fafc; border-radius: 8px;">
        <p style="margin: 0; color: #6b7280; font-size: 13px;">
          Seu pagamento foi recebido e será processado assim que você confirmar um novo horário.
          <br>
          Caso prefira cancelar, entre em contato conosco via WhatsApp.
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding-top: 20px; margin-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} Massoterapia. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
