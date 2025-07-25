export async function FetchEmailValidation(email: string) {
  const res = await fetch(
    `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${process.env.MAILEROO_API_KEY}}`
  );

  if (!res.ok) {
    throw new Error("Erro ao buscar email");
  }

  const data = await res.json();
  const result = data.data;

  if (
    !result ||
    result.status === "invalid" ||
    result.result === "undeliverable" ||
    result.mx_records === false ||
    result.smtp_check === false
  ) {
    throw new Error("Email inválido ou não encontrado.");
  }

  return {
    email: result.email,
    score: result.score,
    result: result.result,
    status: result.status,
    mxRecords: result.mx_records,
    smtpCheck: result.smtp_check,
  };
}
