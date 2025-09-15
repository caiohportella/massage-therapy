declare type Duration = {
  label: string;
  price: number;
  priceId: string;
  duration?: number;
};

declare type Service = {
  id: string;
  name: string;
  description: string;
  image: string | null;
  productId: string;
  durations: Duration[];
};

declare type Booking = {
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

declare type PersonalData = {
  fullName: string;
  preferredName?: string;
  email: string;
  phone: string;
  birthDate: string;
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

declare type SelectedService = {
  priceId: string;
  name: string;
  price: number;
  productId: string;
  quantity: number;
  durationLabel: string;
  duration: number;
};

declare type FormMap = {
  2: UseFormReturn<PersonalDataSchema>;
  3: UseFormReturn<ClinicalProfileSchema>;
  4: UseFormReturn<GeneralConsiderationsSchema>;
  5: UseFormReturn<MtcAnamneseSchema>;
};

declare type StepFormValuesMap = {
  2: PersonalData;
  3: ClinicalProfile;
  4: GeneralConsiderations;
  5: MtcAnamnese;
};

export type StepWithForm = keyof StepFormValuesMap;

declare enum DayOfWeek {
  Domingo = 0,
  Segunda = 1,
  Terca = 2,
  Quarta = 3,
  Quinta = 4,
  Sexta = 5,
  Sabado = 6,
}

declare type WorkingHour = {
  id: string;
  dayOfWeek: number;
  startTime: number;
  endTime: number;
};

declare type BusyTime = {
  start: string;
  end: string;
};
