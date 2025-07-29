import { usePersonalDataForm } from "./hooks/usePersonalDataForm";
import { useClinicalProfileForm } from "./hooks/useClinicalProfileForm";
import { useGeneralConsiderationsForm } from "./hooks/useGeneralConsiderationsForm";
import { useMtcAnamneseForm } from "./hooks/useMtcAnamneseForm";
import { FormMap } from "./types";

export type StepWithForm = 2 | 3 | 4 | 5;

export function useFormMap() {
  const personalDataForm = usePersonalDataForm();
  const clinicalProfileForm = useClinicalProfileForm();
  const generalConsiderationsForm = useGeneralConsiderationsForm();
  const mtcAnamneseForm = useMtcAnamneseForm();

  const formMap: FormMap = {
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
