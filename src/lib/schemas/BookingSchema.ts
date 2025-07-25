import { z } from "zod";

const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;

const zipCodeRegex = /^\d{5}-?\d{3}$/;

export const bookingSchema = z.object({
  user: z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    phone: z
      .string()
      .regex(phoneRegex, "Telefone inválido")
      .min(10, "Telefone muito curto")
      .max(15, "Telefone muito longo"),
    zipCode: z
      .string()
      .regex(zipCodeRegex, "CEP inválido")
      .min(8, "CEP muito curto")
      .max(9, "CEP muito longo"),

    address: z.string().min(1, "Endereço é obrigatório"),
    number: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
    district: z.string().min(1, "Bairro é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().min(1, "Estado é obrigatório"),
  }),

  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Horário é obrigatório"),
  services: z
    .array(z.string().min(1, "Serviço inválido"))
    .min(1, "Selecione pelo menos um serviço"),
  totalAmount: z.number().positive("Total inválido"),
});
