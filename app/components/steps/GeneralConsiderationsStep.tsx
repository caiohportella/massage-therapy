"use client";

import { UseFormReturn } from "react-hook-form";
import { GeneralConsiderationsForm } from "../forms/GeneralConsiderationsForm";
import { GeneralConsiderationsSchema } from "@/lib/validators";

interface GeneralConsiderationsStepProps {
    form: UseFormReturn<GeneralConsiderationsSchema>;
}

export function GeneralConsiderationsStep({ form }: GeneralConsiderationsStepProps) {
  return (
    <GeneralConsiderationsForm form={form} />
  );
}
