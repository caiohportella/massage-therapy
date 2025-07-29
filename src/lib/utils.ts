import { clsx, type ClassValue } from "clsx";
import { differenceInYears, isFuture, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateString(
  dateString: string | Date,
  locale = "pt-BR",
  timeZone = "America/Sao_Paulo"
) {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone,
  };

  const formattedDate = date.toLocaleDateString(locale, options);

  const time = date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  });

  return `${formattedDate} às ${time}`;
}

export const isValidBirthDate = (date: string) => {
  const parsed = parseISO(date);
  const age = differenceInYears(new Date(), parsed);

  return !isFuture(parsed) && age >= 1 && age <= 100;
};

export function convertToSubcurrency(amount: number, factor = 100) {
  return Math.round(amount * factor);
}

export const useDebounce = <T>(value: T, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncedValue;
};