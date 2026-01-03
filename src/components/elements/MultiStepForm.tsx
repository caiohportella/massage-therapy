"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CreditCard, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/store/booking-store";

import { useStepValidations } from "@/lib/hooks/useStepValidations";
import { STEPS } from "@/lib/constants";
import { StepWithForm, useFormMap } from "@/lib/FormMap";

import { DatePickerWithAvailabilityStep } from "@/components/steps/DatePickerWithAvailabilityStep";
import { ServicePickerStep } from "@/components/steps/ServicePickerStep";
import { PersonalDataStep } from "@/components/steps/PersonalDataStep";
// import { ClinicalProfileStep } from "@/components/steps/ClinicalProfileStep";
// import { GeneralConsiderationsStep } from "@/components/steps/GeneralConsiderationsStep";
// import { MtcAnamneseStep } from "@/components/steps/MtcAnamneseStep";
import { BookingReviewStep } from "@/components/steps/BookingReviewStep";
import { StepFormValuesMap } from "@/lib/types";
import { useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPix } from '@fortawesome/free-brands-svg-icons'
import { createPixPayment } from "@/app/actions/abacate-pay";

export function MultiStepForm() {
  const [isLoading, setIsLoading] = useState(false);

  const step = useBookingStore((state) => state.step);
  const nextStep = useBookingStore((state) => state.nextStep);
  const prevStep = useBookingStore((state) => state.prevStep);

  const selectedDate = useBookingStore((state) => state.selectedDate);

  const saveDataToStore = useBookingStore((s) => s.saveDataToStore);

  const currentStepLabel = STEPS[step]?.label;

  const stepValidations = useStepValidations();

  const isStepValid = stepValidations[step]?.() ?? false;

  const {
    formMap,
    personalDataForm,
    // clinicalProfileForm,
    // generalConsiderationsForm,
    // mtcAnamneseForm,
  } = useFormMap();

  async function handleNext() {
    const form = formMap[step as StepWithForm];

    if (form) {
      const isValid = await form.trigger();
      if (isValid) {
        const data = form.getValues();
        saveDataToStore(step as keyof StepFormValuesMap, data);
        nextStep();
      } else {
        console.log("⚠️ Etapa inválida.");
      }
    } else {
      if (isStepValid) {
        nextStep();
      } else {
        console.log("⚠️ Etapa inválida.");
      }
    }
  }

  function handleBack() {
    prevStep();
  }

  async function handleFinalizeWithPix() {
    setIsLoading(true);

    try {
      const selectedServices = useBookingStore.getState().selectedServices;
      const personalData = useBookingStore.getState().personalData;

      // Create products array matching AbacatePay API format
      const products = selectedServices.map((s) => ({
        externalId: s.productId,
        name: s.name,
        description: s.name, // Use service name as description
        quantity: s.quantity,
        price: s.price,
      }));

      // Create customer object matching AbacatePay API format
      // Map PersonalData fields to AbacatePay Customer format
      const customer = {
        name: personalData.fullName,
        taxId: personalData.cpf,
        cellphone: personalData.phone,
        email: personalData.email,
      };

      const response = await createPixPayment(products, customer);

      if ("error" in response && response.error) {
        console.error("Erro ao criar pagamento:", response.error);
        setIsLoading(false);
        return;
      }

      // Type guard: if no error, response is BillingResponse with data
      if ("data" in response && response.data?.url) {
        window.location.href = response.data.url;
      } else {
        console.error("URL de pagamento não encontrada");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Erro ao processar pagamento:", err);
      setIsLoading(false);
    }
  }

  function handleFinalize() {
    setIsLoading(true);

    const selectedServices = useBookingStore.getState().selectedServices;
    // Coleta os dados do bookingStore
    const bookingData = {
      date: selectedDate?.toISOString().split("T")[0],
      time: useBookingStore.getState().selectedTime,
      services: useBookingStore.getState().selectedServices.map((s) => ({
        productId: s.productId,
        quantity: s.quantity,
        name: s.name,
        duration: s.duration,
      })),
      selectedServices,
      personalData: useBookingStore.getState().personalData,
      // clinicalProfile: useBookingStore.getState().clinicalProfile,
      // generalConsiderations: useBookingStore.getState().generalConsiderations,
      // mtcAnamnese: useBookingStore.getState().mtcAnamnese,
    };

    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error("Erro ao iniciar o pagamento:", data.error);
          setIsLoading(false);
        }
      })
      .catch((err) => console.error(err));
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Título da etapa */}
      {selectedDate && (
        <div className="flex items-center gap-3 flex-shrink-9">
          <div
            className="
              w-8 h-8 rounded-full 
              bg-accent text-background 
              flex items-center justify-center 
              font-semibold
            "
          >
            {step + 1}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {currentStepLabel}
          </h2>
        </div>
      )}

      {/* Conteúdo da etapa */}
      <motion.div
        key={step}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="flex flex-col gap-6"
      >
        {step === 0 && <DatePickerWithAvailabilityStep />}
        {step === 1 && <ServicePickerStep />}
        {step === 2 && <PersonalDataStep form={personalDataForm} />}
        {step === 3 && <BookingReviewStep />}
        {/* {step === 3 && <ClinicalProfileStep form={clinicalProfileForm} />}
        {step === 4 && (
          <GeneralConsiderationsStep form={generalConsiderationsForm} />
        )}
        {step === 5 && <MtcAnamneseStep form={mtcAnamneseForm} />}
        {step === 6 && <BookingReviewStep />} */}
      </motion.div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 flex-shrink-0">
        <Button
          variant="ghost"
          disabled={step === 0}
          onClick={handleBack}
          className="flex gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <div className="flex items-center gap-6">
          {selectedDate && (
            <span className="text-sm text-muted-foreground">
              {step + 1} de {STEPS.length}
            </span>
          )}

          {step === STEPS.length - 1 ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleFinalizeWithPix}
                disabled={isLoading}
                className="cursor-pointer"
              >
                {isLoading ? (
                  <>
                    Processando...
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Finalizar com Pix <FontAwesomeIcon icon={faPix} className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              <Button
                onClick={handleFinalize}
                disabled={isLoading}
                className="cursor-pointer"
              >
                {isLoading ? (
                  <>
                    Processando...
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Finalizar com cartão <CreditCard className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isStepValid}
              className="cursor-pointer"
            >
              Próximo <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
