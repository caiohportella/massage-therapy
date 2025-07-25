"use client";

import { MtcAnamneseSchema } from "@/lib/validators";
import { MtcAnamneseForm } from "../forms/MtcAnamneseForm";
import { UseFormReturn } from "react-hook-form";

interface MtcAnamneseStepProps {
    form: UseFormReturn<MtcAnamneseSchema>;
}

export function MtcAnamneseStep({ form }: MtcAnamneseStepProps) {
  return (
   <MtcAnamneseForm form={form} />
  );
}
