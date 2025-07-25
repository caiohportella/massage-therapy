import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generalConsiderationsSchema } from "../validators";

export const generalConsiderationsDefaultValues = {
  underMedicalCare: "",
  medicalCareDescription: "",
  hasCirculatoryProblem: "",
  circulatoryProblemDescription: "",
  hasPressureProblem: "",
  pressureProblemDescription: "",
  hasRespiratoryProblem: "",
  respiratoryProblemDescription: "",
  hasVaricoseVeins: "",
  hasThrombosisHistory: "",
  hasSpineProblem: "",
  spineProblemDescription: "",
  additionalInfo: "",
};

export const useGeneralConsiderationsForm = () => {
  return useForm<z.infer<typeof generalConsiderationsSchema>>({
    resolver: zodResolver(generalConsiderationsSchema),
    defaultValues: generalConsiderationsDefaultValues,
  });
};
