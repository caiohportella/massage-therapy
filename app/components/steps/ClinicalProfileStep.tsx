"use client";

import { UseFormReturn } from "react-hook-form";

import { ClinicalProfileSchema } from "@/lib/validators";
import { ClinicalProfileForm } from "../forms/ClinicalProfileForm";

interface ClinicalProfileStepProps {
  form: UseFormReturn<ClinicalProfileSchema>;
}

export function ClinicalProfileStep({ form }: ClinicalProfileStepProps) {
  return <ClinicalProfileForm form={form} />;
}
