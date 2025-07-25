export async function FetchPhoneValidation(phone: string) {
  const res = await fetch(
    `http://apilayer.net/api/validate?access_key=${process.env.NUMVERIFY_API_KEY}&number=${phone}&country_code=BR&format=55`
  );

  if (!res.ok) {
    throw new Error("Erro ao buscar telefone");
  }

  const data = await res.json();

  if (!data.valid) {
    throw new Error("Telefone inválido ou não encontrado.");
  }

  return {
    internationalFormat: data.international_format,
    localFormat: data.local_format,
    countryCode: data.country_code,
    countryName: data.country_name,
    location: data.location,
    carrier: data.carrier,
    lineType: data.line_type,
  };
}
