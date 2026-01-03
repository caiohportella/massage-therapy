import { SectionHeader } from "@/components/elements/SectionHeader";

import { getPlaceDetails, GoogleReview } from "@/lib/GoogleMaps";
import { TestimonialCard } from "../elements/TestimonialCard";
import Link from "next/link";
import { Star, StarIcon } from "lucide-react";

// Testimonial type
type Testimonial = {
  name: string;
  role: string;
  avatar: string;
  message: string;
  rating?: number;
};

// Fallback testimonials for when Google API is unavailable
const fallbackTestimonials: Testimonial[] = [
  {
    name: "Ana Souza",
    role: "Cliente",
    avatar: "/avatars/ana.png",
    message:
      "Me senti completamente renovada após a sessão. Atendimento incrível, recomendo demais!",
    rating: 5,
  },
  {
    name: "Carlos Oliveira",
    role: "Cliente",
    avatar: "/avatars/carlos.png",
    message:
      "Profissional excelente, atenciosa e muito competente. Saí muito mais leve e relaxado.",
    rating: 5,
  },
  {
    name: "Juliana Lima",
    role: "Cliente",
    avatar: "/avatars/juliana.png",
    message:
      "Experiência maravilhosa! Ambiente acolhedor e técnica impecável. Recomendo de olhos fechados.",
    rating: 5,
  },
];

function mapGoogleReviewToTestimonial(review: GoogleReview) {
  return {
    name: review.authorAttribution.displayName,
    role: "Cliente",
    avatar: review.authorAttribution.photoUri || "/avatars/default.png",
    message: review.text?.text || review.originalText?.text || "",
    rating: review.rating,
  };
}

export async function TestimonialSection() {
  const placeDetails = await getPlaceDetails();

  // Use Google reviews if available, otherwise use fallback
  const testimonials = placeDetails?.reviews?.length
    ? placeDetails.reviews
      .filter((review) => review.rating >= 4) // Only show 4+ star reviews
      .map(mapGoogleReviewToTestimonial)
    : fallbackTestimonials;

  return (
    <section className="w-full py-24 md:py-32">
      <div className="container mx-auto px-4 flex flex-col gap-8 md:gap-24">
        {/* Header */}
        <SectionHeader
          title="O que meus clientes dizem"
          background="Depoimentos"
          backgroundSize="text-[clamp(3rem,8vw,8rem)]"
        />

        {/* Google Rating Badge */}
        {placeDetails && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span className="text-2xl font-bold text-foreground">
              {placeDetails.rating?.toFixed(1)}
            </span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.round(placeDetails.rating || 0)
                      ? "text-yellow-400"
                      : "text-muted"
                  }
                >
                  <Star size={16} fill="yellow" />
                </span>
              ))}
            </div>
            <Link className="hover:underline" target="_blank" href="https://www.google.com/search?client=ms-google-coop&q=Ritha+Portella+%7C+Massoterapeuta+Integrativa&cx=005326727925058575645:u2hfjb_gpuk#lrd=0x94cf27929b039e8d:0x11a42c2572859876,1,,,,">
              <span className="text-sm">
                ({placeDetails.userRatingCount} avaliações no Google)
              </span>
            </Link>
          </div>
        )}

        {/* Grid de Depoimentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.name}-${index}`}
              name={testimonial.name}
              role={testimonial.role}
              message={testimonial.message}
              avatar={testimonial.avatar}
              rating={testimonial.rating}
              fullWidth
            />
          ))}
        </div>
      </div>
    </section>
  );
}
