import { SectionHeader } from "../elements/SectionHeader";
import { BookingCard } from "../elements/BookingCard";
import { Rocket } from "lucide-react";

const BookingSection = () => {
  return (
    <section className="w-full py-24 md:py-32">
      <div className="mx-auto px-4 flex flex-col items-center gap-24">
        <SectionHeader
          title="Marque sua sessão"
          background="Booking"
          align="center"
        />

        <div className="flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-card px-4 py-1.5 text-sm font-medium text-background">
            <Rocket className="size-4" />
            Powered by Scheduly
          </div>
          <BookingCard />
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
