import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { mtcAnamneseSchema } from "../validators";

export const mtcAnamneseDefaultValues = {
  sleepQuality: "",
  appetite: "",
  bowelFunction: "",
  hasUrinaryAlterations: "",
  urinaryAlterationsDescription: "",
  hasMenstrualCycle: "",
  hasMenstrualAlterations: "",
  menstrualAlterationsDescription: "",
  predominantEmotion: "",
  hasPainOrDiscomfort: "",
  painOrDiscomfortDescription: "",
  observations: "",
};

export const useMtcAnamneseForm = () => {
  return useForm<z.infer<typeof mtcAnamneseSchema>>({
    resolver: zodResolver(mtcAnamneseSchema),
    defaultValues: mtcAnamneseDefaultValues,
  });
};
