export async function FetchAddressByCep(cep: string) {
  const cleanCep = cep.replace(/\D/g, "");

  const response = await fetch(
    `https://brasilapi.com.br/api/cep/v1/${cleanCep}`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar CEP");
  }

  const data = await response.json();

  if (data?.errors || data?.message === "CEP não encontrado") {
    throw new Error("CEP inválido ou não encontrado.");
  }

  return {
    street: data.street,
    district: data.neighborhood,
    city: data.city,
    state: data.state,
  };
}
