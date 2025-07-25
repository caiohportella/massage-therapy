import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesCarouselSection } from "@/components/sections/ServicesCarouselSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { BookingSection } from "@/components/sections/BookingSection";
import { TestimonialSection } from "@/components/sections/TestimonialsSection";
import { BookingReviewStep } from "@/components/steps/BookingReviewStep";
import { VouchersSection } from "@/components/sections/VouchersSection";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        <HeroSection />
        <AboutSection />
        <ServicesCarouselSection />
        <TestimonialSection />
        <VouchersSection />
        {/* <BookingSection /> */}
      </main>
      <Footer />
    </>
  );
}
