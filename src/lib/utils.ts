import { clsx, type ClassValue } from "clsx";
import { differenceInYears, isFuture, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  const isProduction = process.env.NODE_ENV == "production";

  if (isProduction) {
    if (process.env.NEXT_PUBLIC_APP_URL) {
      return process.env.NEXT_PUBLIC_APP_URL;
    }

    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }

    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }

    throw new Error(
      "No production URL configured. Please set NEXT_PUBLIC_APP_URL environment variable."
    );
  }

  return "http://localhost:3000";
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

export function formatNumberToInternational(phone: string) {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("55")) return `+${cleaned}`;
  return `+55${cleaned}`;
}

export function formatMinutes(min: number) {
  const h = String(Math.floor(min / 60)).padStart(2, "0");
  const m = String(min % 60).padStart(2, "0");
  return `${h}:${m}`;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}
