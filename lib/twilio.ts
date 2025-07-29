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
  const formattedTo = `whatsapp:+55${to.replace(/\D/g, "")}`;

  const res = await client.messages.create({
    from,
    to: formattedTo,
    body: message,
  });

  return res;
}

