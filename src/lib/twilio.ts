import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const from = process.env.TWILIO_WHATSAPP_FROM!;

const client = twilio(accountSid, authToken);

export async function sendWhatsAppMessage({
  to,
  message,
}: {
  to: string;
  message: string;
}) {
  try {
    const cleaned = to.replace(/\D/g, "");
    const formattedTo = cleaned.startsWith("55")
      ? `whatsapp:+${cleaned}`
      : `whatsapp:+55${cleaned}`;

    const res = await client.messages.create({
      from,
      to: formattedTo,
      body: message,
    });

    console.log("✅ Mensagem enviada via WhatsApp:", formattedTo);
    return res;
  } catch (err) {
    console.error("❌ Erro ao enviar WhatsApp:", err);
    throw err;
  }
}
