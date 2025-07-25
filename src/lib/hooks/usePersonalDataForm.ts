// 🔥 /lib/forms/personal-data.ts

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { personalDataSchema } from "../validators";

export const personalDataDefaultValues = {
  fullName: "",
  preferredName: "",
  email: "",
  phone: "",
  birthDate: "",
  gender: "",
  profession: "",
  address: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
  zipCode: "",
};

export const usePersonalDataForm = () => {
  return useForm<z.infer<typeof personalDataSchema>>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: personalDataDefaultValues,
  });
};
