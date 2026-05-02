import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesCarouselSection } from "@/components/sections/ServicesCarouselSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { TestimonialSection } from "@/components/sections/TestimonialsSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import BookingSection from "@/components/sections/BookingSection";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        <section id="hero">
          <HeroSection />
        </section>
        <section id="about">
          <AboutSection />
        </section>
        <section>
          <BenefitsSection />
        </section>
        <section id="services">
          <ServicesCarouselSection />
        </section>
        <section id="partners">
          <PartnersSection />
        </section>
        <section id="testimonials">
          <TestimonialSection />
        </section>
        <section id="booking">
          <BookingSection />
        </section>
      </main>
      <Footer />
    </>
  );
}
