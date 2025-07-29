import { create } from "zustand";

// type ClinicalProfile = Record<string, any>;
// type GeneralConsiderations = Record<string, any>;
// type MtcAnamnese = Record<string, any>;

type BookingState = {
  step: number;
  selectedDate?: Date;
  selectedTime?: string;
  selectedServices: SelectedService[];
  personalData: PersonalData;
  // clinicalProfile: ClinicalProfile;
  // generalConsiderations: GeneralConsiderations;
  // mtcAnamnese: MtcAnamnese;

  // Navegação
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Dados do booking
  setDate: (date: Date) => void;
  setTime: (time: string) => void;
  setServices: (services: SelectedService[]) => void;

  setSelectedDate: (date: Date | undefined) => void;
  setSelectedTime: (time: string) => void;

  // Dados dos formulários
  setPersonalData: (data: PersonalData) => void;
  // setClinicalProfile: (data: ClinicalProfile) => void;
  // setGeneralConsiderations: (data: GeneralConsiderations) => void;
  // setMtcAnamnese: (data: MtcAnamnese) => void;

  saveDataToStore: (step: number, data: any) => void;

  // Reset geral
  reset: () => void;
};

export const useBookingStore = create<BookingState>((set) => ({
  step: 0,
  selectedDate: undefined,
  selectedTime: "",
  selectedServices: [],
  personalData: {
    fullName: "",
    preferredName: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
    profession: "",
    address: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    state: "",
    zipCode: "",
  },
  clinicalProfile: {},
  generalConsiderations: {},
  mtcAnamnese: {},

  // Navegação
  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),

  // Dados do booking
  setDate: (date) => set({ selectedDate: date }),
  setTime: (time) => set({ selectedTime: time }),
  setServices: (services) => set({ selectedServices: services }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedTime: (time) => set({ selectedTime: time }),
  // Dados dos formulários
  setPersonalData: (data) => set({ personalData: data }),
  // setClinicalProfile: (data) => set({ clinicalProfile: data }),
  // setGeneralConsiderations: (data) => set({ generalConsiderations: data }),
  // setMtcAnamnese: (data) => set({ mtcAnamnese: data }),

  // Salvar dados do formulário
  saveDataToStore: (step, data) => {
    switch (step) {
      case 2:
        set({ personalData: data });
        break;
      // case 3:
      //   set({ clinicalProfile: data });
      //   break;
      // case 4:
      //   set({ generalConsiderations: data });
      //   break;
      // case 5:
      //   set({ mtcAnamnese: data });
      //   break;
      default:
        console.warn(`Step ${step} não possui dados associados.`);
    }
  },

  // Reset geral
  reset: () =>
    set({
      step: 0,
      selectedDate: undefined,
      selectedTime: "",
      selectedServices: [],
      personalData: {
        fullName: "",
        preferredName: "",
        email: "",
        phone: "",
        birthDate: "",
        gender: "",
        profession: "",
        address: "",
        number: "",
        complement: "",
        district: "",
        city: "",
        state: "",
        zipCode: "",
      },
      // clinicalProfile: {},
      // generalConsiderations: {},
      // mtcAnamnese: {},
    }),
}));
