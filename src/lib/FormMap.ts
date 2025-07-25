import { UseFormReturn } from "react-hook-form";
import { usePersonalDataForm } from "./hooks/usePersonalDataForm";
import { useClinicalProfileForm } from "./hooks/useClinicalProfileForm";
import { useGeneralConsiderationsForm } from "./hooks/useGeneralConsiderationsForm";
import { useMtcAnamneseForm } from "./hooks/useMtcAnamneseForm";

export type StepWithForm = 2 | 3 | 4 | 5;

// 🔥 Hook que instancia todos os forms
export function useFormMap() {
  const personalDataForm = usePersonalDataForm();
  const clinicalProfileForm = useClinicalProfileForm();
  const generalConsiderationsForm = useGeneralConsiderationsForm();
  const mtcAnamneseForm = useMtcAnamneseForm();

  const formMap: Record<StepWithForm, UseFormReturn<any>> = {
    2: personalDataForm,
    3: clinicalProfileForm,
    4: generalConsiderationsForm,
    5: mtcAnamneseForm,
  };

  return {
    formMap,
    personalDataForm,
    clinicalProfileForm,
    generalConsiderationsForm,
    mtcAnamneseForm,
  };
}
