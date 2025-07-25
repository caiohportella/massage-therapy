import { useBookingStore } from "@/store/booking-store";

export function useStepValidations() {
  const selectedDate = useBookingStore((s) => s.selectedDate);
  const selectedTime = useBookingStore((s) => s.selectedTime);
  const selectedServices = useBookingStore((s) => s.selectedServices);

  return [
    () => !!selectedDate && !!selectedTime, // Etapa 0: Calendário
    () => selectedServices.length > 0, // Etapa 1: Serviços
    () => true, // Etapa 2: Dados pessoais → validado no form
    () => true, // Etapa 3: Perfil clínico → validado no form
    () => true, // Etapas seguintes...
    () => true,
  ] as const;
}
