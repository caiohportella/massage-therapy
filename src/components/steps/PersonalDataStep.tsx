"use client";

import { personalDataSchema } from "@/lib/validators";
import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { PersonalDataForm } from "../forms/PersonalDataForm";
import { z } from "zod";

type PersonalDataSchema = z.infer<typeof personalDataSchema>;

interface PersonalDataStepProps {
  form: UseFormReturn<PersonalDataSchema>;
}

export function PersonalDataStep({ form }: PersonalDataStepProps) {
  return (
    <motion.div
      key="personal-data"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="flex flex-col gap-6"
    >
      <PersonalDataForm form={form} />
    </motion.div>
  );
}
