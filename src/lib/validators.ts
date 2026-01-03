import { z } from "zod";
import { isValidBirthDate } from "./utils";

const requiredMessage = "Este campo é obrigatório";

export const personalDataSchema = z.object({
  fullName: z
    .string({ required_error: requiredMessage })
    .min(9, requiredMessage),
  preferredName: z.string().optional(),
  email: z
    .string({ required_error: requiredMessage })
    .min(1, requiredMessage)
    .email("O formato do e-mail é inválido."),
  phone: z.string({ required_error: requiredMessage }).min(1, requiredMessage),
  cpf: z
    .string({ required_error: requiredMessage })
    .min(11, "CPF inválido")
    .max(14, "CPF inválido"),
  birthDate: z
    .string({ required_error: requiredMessage })
    .min(1, "Data de nascimento obrigatória")
    .refine(
      isValidBirthDate,
      "Data de nascimento inválida ou idade fora do permitido"
    ),

  gender: z.string({ required_error: requiredMessage }).min(1, requiredMessage),
  profession: z.string().optional(),

  address: z
    .string({ required_error: requiredMessage })
    .min(1, requiredMessage),
  number: z.string({ required_error: requiredMessage }).min(1, requiredMessage),
  complement: z.string().optional(),
  district: z
    .string({ required_error: requiredMessage })
    .min(1, requiredMessage),
  city: z.string({ required_error: requiredMessage }).min(1, requiredMessage),
  state: z
    .string({ required_error: requiredMessage })
    .min(1, requiredMessage)
    .max(2, "Use a sigla do estado (ex: SP)."),
  zipCode: z
    .string({ required_error: requiredMessage })
    .min(1, requiredMessage),
});

export type PersonalDataSchema = z.infer<typeof personalDataSchema>;

export const clinicalProfileSchema = z.object({
  hasChronicDisease: z
    .string({ required_error: requiredMessage })
    .min(1, "Campo obrigatório"),
  chronicDiseaseDescription: z.string().optional(),

  usesMedication: z
    .string({ required_error: requiredMessage })
    .min(1, "Campo obrigatório"),
  medicationDescription: z
    .string({ required_error: requiredMessage })
    .optional(),

  hasAllergies: z
    .string({ required_error: requiredMessage })
    .min(1, "Campo obrigatório"),
  allergiesDescription: z
    .string({ required_error: requiredMessage })
    .optional(),

  hadSurgery: z
    .string({ required_error: requiredMessage })
    .min(1, "Campo obrigatório"),
  surgeryDescription: z.string({ required_error: requiredMessage }).optional(),

  hasPain: z
    .string({ required_error: requiredMessage })
    .min(1, "Campo obrigatório"),
  painDescription: z.string({ required_error: requiredMessage }).optional(),

  isPregnant: z.string({ required_error: requiredMessage }).optional(),
});

export type ClinicalProfileSchema = z.infer<typeof clinicalProfileSchema>;

export const generalConsiderationsSchema = z.object({
  underMedicalCare: z
    .string({ required_error: requiredMessage })
    .min(1, "Campo obrigatório"),
  medicalCareDescription: z.string().optional(),

  hasCirculatoryProblem: z
    .string({ required_error: requiredMessage })
    .min(1, "Campo obrigatório"),
  circulatoryProblemDescription: z.string().optional(),

  hasPressureProblem: z
    .string({ required_error: requiredMessage })
    .min(1, "Campo obrigatório"),
  pressureProblemDescription: z.string().optional(),

  hasRespiratoryProblem: z
    .string({ required_error: requiredMessage })
    .min(1, "Campo obrigatório"),
  respiratoryProblemDescription: z.string().optional(),

  hasVaricoseVeins: z
    .string({ required_error: requiredMessage })
    .min(1, "Campo obrigatório"),

  hasThrombosisHistory: z
    .string({ required_error: requiredMessage })
    .min(1, "Campo obrigatório"),

  hasSpineProblem: z
    .string({ required_error: requiredMessage })
    .min(1, "Campo obrigatório"),
  spineProblemDescription: z.string().optional(),

  additionalInfo: z.string().optional(),
});

export type GeneralConsiderationsSchema = z.infer<
  typeof generalConsiderationsSchema
>;

export const mtcAnamneseSchema = z.object({
  sleepQuality: z.string().min(1, "Campo obrigatório"),
  appetite: z.string().min(1, "Campo obrigatório"),
  bowelFunction: z.string().min(1, "Campo obrigatório"),

  hasUrinaryAlterations: z.string().min(1, "Campo obrigatório"),
  urinaryAlterationsDescription: z.string().optional(),

  hasMenstrualCycle: z.string().min(1, "Campo obrigatório"),
  hasMenstrualAlterations: z.string().optional(),
  menstrualAlterationsDescription: z.string().optional(),

  predominantEmotion: z.string().min(1, "Campo obrigatório"),

  hasPainOrDiscomfort: z.string().min(1, "Campo obrigatório"),
  painOrDiscomfortDescription: z.string().optional(),

  observations: z.string().optional(),
});

export type MtcAnamneseSchema = z.infer<typeof mtcAnamneseSchema>;
