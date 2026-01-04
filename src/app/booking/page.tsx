import { BookingPageContent } from "@/components/pages/BookingPageContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Agendar Sessão | Ritha Portella Massoterapia",
    description:
        "Agende sua sessão de massoterapia com Ritha Portella. Escolha a data, horário e serviços desejados.",
};

export default function BookingPage() {
    return <BookingPageContent />;
}
