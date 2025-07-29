import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { clinicalProfileSchema } from "../validators";

export const clinicalProfileDefaultValues = {
  hasChronicDisease: "",
  chronicDiseaseDescription: "",
  usesMedication: "",
  medicationDescription: "",
  hasAllergies: "",
  allergiesDescription: "",
  hadSurgery: "",
  surgeryDescription: "",
  hasPain: "",
  painDescription: "",
  isPregnant: "",
};

export const useClinicalProfileForm = () => {
  return useForm<z.infer<typeof clinicalProfileSchema>>({
    resolver: zodResolver(clinicalProfileSchema),
    defaultValues: clinicalProfileDefaultValues,
  });
};
