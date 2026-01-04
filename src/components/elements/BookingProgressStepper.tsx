"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STEPS } from "@/lib/constants";
import { useBookingStore } from "@/store/booking-store";

/**
 * BookingProgressStepper - Visual progress indicator for booking flow
 * Shows all steps with active/completed states
 * Supports both vertical (desktop sidebar) and horizontal (mobile) layouts
 */
interface BookingProgressStepperProps {
    orientation?: "vertical" | "horizontal";
    className?: string;
}

export function BookingProgressStepper({
    orientation = "vertical",
    className,
}: BookingProgressStepperProps) {
    const currentStep = useBookingStore((state) => state.step);

    const isVertical = orientation === "vertical";

    return (
        <nav
            aria-label="Progresso do agendamento"
            className={cn(
                "flex",
                isVertical ? "flex-col gap-2" : "flex-row gap-1 justify-between",
                className
            )}
        >
            {STEPS.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                    <div
                        key={step.label}
                        className={cn(
                            "flex items-center gap-3",
                            isVertical ? "w-full" : "flex-1"
                        )}
                    >
                        {/* Step indicator circle */}
                        <motion.div
                            initial={false}
                            animate={{
                                scale: isActive ? 1.1 : 1,
                                backgroundColor: isCompleted
                                    ? "var(--accent)"
                                    : isActive
                                        ? "var(--accent)"
                                        : "transparent",
                                borderColor: isCompleted || isActive ? "var(--accent)" : "var(--foreground)",
                            }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className={cn(
                                "flex items-center justify-center rounded-full border-2 shrink-0",
                                isVertical ? "w-10 h-10" : "w-8 h-8",
                                isCompleted || isActive ? "text-background" : "text-foreground"
                            )}
                        >
                            {isCompleted ? (
                                <Check className={cn(isVertical ? "w-5 h-5" : "w-4 h-4")} />
                            ) : (
                                <span
                                    className={cn(
                                        "font-semibold",
                                        isVertical ? "text-sm" : "text-xs"
                                    )}
                                >
                                    {index + 1}
                                </span>
                            )}
                        </motion.div>

                        {/* Step label (vertical only) */}
                        {isVertical && (
                            <div className="flex flex-col">
                                <motion.span
                                    initial={false}
                                    animate={{
                                        color: isActive || isCompleted ? "var(--accent)" : "var(--foreground)",
                                        opacity: isActive ? 1 : 0.7,
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className={cn(
                                        "font-medium text-sm",
                                        isActive && "font-semibold"
                                    )}
                                >
                                    {step.label}
                                </motion.span>
                                {isActive && (
                                    <motion.span
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs text-foreground/60"
                                    >
                                        Etapa atual
                                    </motion.span>
                                )}
                            </div>
                        )}

                        {/* Connector line (not for last item) */}
                        {index < STEPS.length - 1 && (
                            <motion.div
                                initial={false}
                                animate={{
                                    backgroundColor: isCompleted ? "var(--accent)" : "var(--foreground)",
                                    opacity: isCompleted ? 1 : 0.2,
                                }}
                                transition={{ duration: 0.3 }}
                                className={cn(
                                    isVertical
                                        ? "hidden"
                                        : "flex-1 h-0.5 mx-1"
                                )}
                            />
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
