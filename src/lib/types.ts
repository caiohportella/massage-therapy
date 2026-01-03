import { UseFormReturn } from "react-hook-form";
import { PersonalDataSchema, ClinicalProfileSchema, GeneralConsiderationsSchema, MtcAnamneseSchema } from "./validators";

export enum DayOfWeek {
  Domingo = 0,
  Segunda = 1,
  Terca = 2,
  Quarta = 3,
  Quinta = 4,
  Sexta = 5,
  Sabado = 6,
}

export type WorkingHour = {
  id: string;
  dayOfWeek: number;
  startTime: number;
  endTime: number;
};

export type BusyTime = {
  start: string;
  end: string;
};

export type Duration = {
  label: string;
  price: number;
  priceId: string;
  duration?: number;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  image: string | null;
  productId: string;
  durations: Duration[];
};

export type Booking = {
  id: string;
  date: string; // ISO
  time: string; // "HH:mm"
  scheduledAt: string; // ISO
  totalAmount: number;
  paymentStatus: string;

  user: {
    name: string;
    email: string;
    phone: string;
  };

  services: {
    service: {
      name: string;
      price: number;
      productId: string;
    };
  }[];

  reminderLogs: {
    id: string;
    sentAt: string;
    type: string;
  }[];
};

export type PersonalData = {
  fullName: string;
  preferredName?: string;
  email: string;
  phone: string;
  birthDate: string;
  cpf: string;
  gender: string;
  profession?: string;

  address: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
};

export type SelectedService = {
  priceId: string;
  name: string;
  price: number;
  productId: string;
  quantity: number;
  durationLabel: string;
  duration: number;
};

export type FormMap = {
  2: UseFormReturn<PersonalDataSchema>;
  3: UseFormReturn<ClinicalProfileSchema>;
  4: UseFormReturn<GeneralConsiderationsSchema>;
  5: UseFormReturn<MtcAnamneseSchema>;
};

export type StepFormValuesMap = {
  2: PersonalData;
  3: ClinicalProfile;
  4: GeneralConsiderations;
  5: MtcAnamnese;
};

export type StepWithForm = keyof StepFormValuesMap;

export type ClinicalProfile = {
  hasChronicDisease: string;
  chronicDiseaseDescription?: string;
  usesMedication: string;
  medicationDescription?: string;
  hasAllergies: string;
  allergiesDescription?: string;
  hadSurgery: string;
  surgeryDescription?: string;
  hasPain: string;
  painDescription?: string;
  isPregnant?: string;
};

export type GeneralConsiderations = {
  underMedicalCare: string;
  medicalCareDescription?: string;
  hasCirculatoryProblem: string;
  circulatoryProblemDescription?: string;
  hasPressureProblem: string;
  pressureProblemDescription?: string;
  hasRespiratoryProblem: string;
  respiratoryProblemDescription?: string;
  hasVaricoseVeins: string;
  hasThrombosisHistory: string;
  hasSpineProblem: string;
  spineProblemDescription?: string;
  additionalInfo?: string;
};

export type MtcAnamnese = {
  sleepQuality: string;
  appetite: string;
  bowelFunction: string;
  hasUrinaryAlterations: string;
  urinaryAlterationsDescription?: string;
  hasMenstrualCycle: string;
  hasMenstrualAlterations?: string;
  menstrualAlterationsDescription?: string;
  predominantEmotion: string;
  hasPainOrDiscomfort: string;
  painOrDiscomfortDescription?: string;
  observations?: string;
};
