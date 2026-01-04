"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CreditCard, Loader2, Home } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPix } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/store/booking-store";
import { useStepValidations } from "@/lib/hooks/useStepValidations";
import { STEPS } from "@/lib/constants";
import { StepWithForm, useFormMap } from "@/lib/FormMap";
import { StepFormValuesMap } from "@/lib/types";

import { DatePickerWithAvailabilityStep } from "@/components/steps/DatePickerWithAvailabilityStep";
import { ServicePickerStep } from "@/components/steps/ServicePickerStep";
import { PersonalDataStep } from "@/components/steps/PersonalDataStep";
import { BookingReviewStep } from "@/components/steps/BookingReviewStep";
import { BookingProgressStepper } from "@/components/elements/BookingProgressStepper";
import { createPixPayment } from "@/app/actions/abacate-pay";

import "./booking-page.css";

/**
 * BookingPageContent - Full-page booking experience
 * 
 * Layout:
 * - Desktop: Two-panel layout (sidebar with progress + main content)
 * - Mobile: Single column with compact header and sticky footer
 * 
 * Features:
 * - Full viewport utilization
 * - Animated step transitions
 * - Progress stepper showing all steps
 * - Responsive design
 */
export function BookingPageContent() {
    const [isLoading, setIsLoading] = useState(false);

    // Store state
    const step = useBookingStore((state) => state.step);
    const nextStep = useBookingStore((state) => state.nextStep);
    const prevStep = useBookingStore((state) => state.prevStep);
    const selectedDate = useBookingStore((state) => state.selectedDate);
    const saveDataToStore = useBookingStore((s) => s.saveDataToStore);

    // Form management
    const { formMap, personalDataForm } = useFormMap();
    const stepValidations = useStepValidations();
    const isStepValid = stepValidations[step]?.() ?? false;

    // Step navigation handlers
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

    // Payment handlers (same as MultiStepForm)
    async function handleFinalizeWithPix() {
        setIsLoading(true);

        try {
            const selectedServices = useBookingStore.getState().selectedServices;
            const personalData = useBookingStore.getState().personalData;
            const bookingDate = useBookingStore.getState().selectedDate;
            const bookingTime = useBookingStore.getState().selectedTime;

            if (!bookingDate || !bookingTime) {
                console.error("Data ou horário não selecionados");
                setIsLoading(false);
                return;
            }

            const dateStr = bookingDate.toISOString().split("T")[0];

            // Step 1: Create pending booking in database
            const pendingResponse = await fetch("/api/bookings/pending", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date: dateStr,
                    time: bookingTime,
                    selectedServices,
                    personalData,
                    totalDuration: selectedServices.reduce((sum, s) => sum + (s.duration || 60), 0),
                }),
            });

            const pendingData = await pendingResponse.json();

            if (!pendingResponse.ok || !pendingData.bookingId) {
                console.error("Erro ao criar agendamento pendente:", pendingData.error);
                setIsLoading(false);
                return;
            }

            // Step 2: Create products array matching AbacatePay API format
            const products = selectedServices.map((s) => ({
                externalId: s.productId,
                name: s.name,
                description: s.name,
                quantity: s.quantity,
                price: s.price,
            }));

            // Step 3: Create customer object matching AbacatePay API format
            const customer = {
                name: personalData.fullName,
                taxId: personalData.cpf,
                cellphone: personalData.phone,
                email: personalData.email,
            };

            // Step 4: Create Pix payment with booking metadata
            const response = await createPixPayment(products, customer, {
                bookingId: pendingData.bookingId,
                date: dateStr,
                time: bookingTime,
            });

            // Handle null/undefined response
            if (!response) {
                console.error("Resposta vazia do servidor de pagamento");
                await fetch(`/api/bookings/pending?id=${pendingData.bookingId}`, {
                    method: "DELETE",
                });
                setIsLoading(false);
                return;
            }

            if ("error" in response && response.error) {
                console.error("Erro ao criar pagamento:", response.error);
                // Clean up pending booking on payment error
                await fetch(`/api/bookings/pending?id=${pendingData.bookingId}`, {
                    method: "DELETE",
                });
                setIsLoading(false);
                return;
            }

            // Type guard: if no error, response is BillingResponse with data
            if ("data" in response && response.data?.url) {
                window.location.href = response.data.url;
            } else {
                console.error("URL de pagamento não encontrada");
                // Clean up pending booking
                await fetch(`/api/bookings/pending?id=${pendingData.bookingId}`, {
                    method: "DELETE",
                });
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

    const currentStepLabel = STEPS[step]?.label;
    const isLastStep = step === STEPS.length - 1;

    return (
        <div className="booking-page">
            {/* ===================== SIDEBAR (Desktop Only) ===================== */}
            <aside className="booking-sidebar">
                {/* Logo and branding */}
                <div className="booking-sidebar-header">
                    <Link href="/" className="booking-logo-link" aria-label="Voltar ao início">
                        <Image
                            src="/logo_alt.png"
                            alt="Ritha Portella Logo"
                            width={180}
                            height={60}
                            className="booking-logo"
                            priority
                        />
                    </Link>
                    <p className="booking-sidebar-tagline">
                        Agende sua sessão de massoterapia
                    </p>
                </div>

                {/* Progress stepper */}
                <div className="booking-sidebar-progress">
                    <BookingProgressStepper orientation="vertical" />
                </div>

                {/* Decorative element */}
                <div className="booking-sidebar-decoration">
                    <Image
                        src="/bamboo.png"
                        alt=""
                        width={120}
                        height={200}
                        className="booking-decoration-image"
                        aria-hidden="true"
                    />
                </div>

                {/* Back to home link */}
                <Link
                    href="/"
                    className="booking-home-link"
                >
                    <Home className="w-4 h-4" />
                    <span>Voltar ao site</span>
                </Link>
            </aside>

            {/* ===================== MAIN CONTENT ===================== */}
            <main className="booking-main">
                {/* Mobile Header */}
                <header className="booking-mobile-header">
                    <BookingProgressStepper orientation="horizontal" />
                </header>

                {/* Step Content Area */}
                <div className="booking-content">
                    {/* Step Title */}
                    <motion.div
                        key={`title-${step}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="booking-step-header"
                    >
                        <h1 className="booking-step-title">
                            {currentStepLabel}
                        </h1>
                    </motion.div>

                    {/* Step Content with Animation */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="booking-step-content"
                        >
                            {step === 0 && <DatePickerWithAvailabilityStep />}
                            {step === 1 && <ServicePickerStep />}
                            {step === 2 && <PersonalDataStep form={personalDataForm} />}
                            {step === 3 && <BookingReviewStep />}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Footer */}
                <footer className="booking-footer">
                    <Button
                        variant="ghost"
                        disabled={step === 0}
                        onClick={handleBack}
                        className="booking-nav-button"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Voltar</span>
                    </Button>

                    <div className="booking-footer-center">
                        <span className="booking-step-indicator">
                            {step + 1} de {STEPS.length}
                        </span>
                    </div>

                    <div className="booking-footer-actions">
                        {isLastStep ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleFinalizeWithPix}
                                    disabled={isLoading}
                                    className="booking-payment-button"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Processando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Finalizar com Pix</span>
                                            <FontAwesomeIcon icon={faPix} className="w-4 h-4" />
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={handleFinalize}
                                    disabled={isLoading}
                                    className="booking-payment-button booking-payment-button-primary"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Processando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Finalizar com cartão</span>
                                            <CreditCard className="w-4 h-4" />
                                        </>
                                    )}
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={handleNext}
                                disabled={!isStepValid}
                                className="booking-nav-button booking-next-button"
                            >
                                <span>Próximo</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </footer>
            </main>
        </div>
    );
}
