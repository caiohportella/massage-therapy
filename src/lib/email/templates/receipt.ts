import { APPOINTMENT_LOCATION } from "@/lib/constants";

interface ReceiptEmailParams {
    name: string;
    date: string;
    time: string;
    services: { name: string; price: number; duration: number }[];
    totalAmount: number;
    transactionId: string;
}

export function generateReceiptEmailHtml({
    name,
    date,
    time,
    services,
    totalAmount,
    transactionId,
}: ReceiptEmailParams): string {
    const formattedDate = new Date(date).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const servicesHtml = services
        .map(
            (s) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${s.name}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${s.duration} min</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">R$ ${(s.price / 100).toFixed(2).replace(".", ",")}</td>
        </tr>
      `
        )
        .join("");

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recibo de Pagamento</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="color: #fff; margin: 0; font-size: 24px;">Massoterapia</h1>
      <p style="color: #e2e8f0; margin: 8px 0 0; font-size: 14px;">Recibo de Pagamento</p>
    </div>

    <!-- Content -->
    <div style="background-color: #fff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background-color: #d4edda; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
          <span style="color: #28a745; font-size: 30px;">✓</span>
        </div>
        <h2 style="color: #28a745; margin: 15px 0 5px;">Pagamento Confirmado!</h2>
        <p style="color: #6b7280; margin: 0;">Olá, ${name}!</p>
      </div>

      <!-- Booking Details -->
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 16px;">📅 Detalhes do Agendamento</h3>
        <p style="margin: 8px 0; color: #4b5563;">
          <strong>Data:</strong> ${formattedDate}
        </p>
        <p style="margin: 8px 0; color: #4b5563;">
          <strong>Horário:</strong> ${time}
        </p>
        <p style="margin: 8px 0; color: #4b5563;">
          <strong>Local:</strong> ${APPOINTMENT_LOCATION}
        </p>
      </div>

      <!-- Services Table -->
      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 16px;">🛠️ Serviços Contratados</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Serviço</th>
              <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151;">Duração</th>
              <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151;">Valor</th>
            </tr>
          </thead>
          <tbody>
            ${servicesHtml}
          </tbody>
          <tfoot>
            <tr style="background-color: #f1f5f9;">
              <td colspan="2" style="padding: 12px; font-weight: 700; color: #1f2937;">Total</td>
              <td style="padding: 12px; text-align: right; font-weight: 700; color: #1f2937;">R$ ${(totalAmount / 100).toFixed(2).replace(".", ",")}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Transaction Info -->
      <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
        <p style="margin: 0; color: #1e40af; font-size: 13px;">
          <strong>ID da Transação:</strong> ${transactionId}
        </p>
        <p style="margin: 5px 0 0; color: #3b82f6; font-size: 12px;">
          Pagamento via Pix
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 13px; margin: 0;">
          Dúvidas? Entre em contato conosco via WhatsApp.
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0;">
          © ${new Date().getFullYear()} Massoterapia. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
