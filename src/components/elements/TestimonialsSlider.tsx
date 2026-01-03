"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TestimonialCard } from "@/components/elements/TestimonialCard";

type Testimonial = {
    name: string;
    role: string;
    avatar: string;
    message: string;
    rating?: number;
};

// Chunk array into groups of n
function chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

export function TestimonialsSlider({
    testimonials,
}: {
    testimonials: Testimonial[];
}) {
    const [isMobile, setIsMobile] = useState(false);

    // Check viewport size
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Group testimonials: 4 per page on desktop (2x2 grid), 1 per page on mobile
    const itemsPerPage = isMobile ? 1 : 4;
    const pages = chunkArray(testimonials, itemsPerPage);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: "start",
        slidesToScroll: 1,
    });

    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback(
        (index: number) => {
            if (emblaApi) emblaApi.scrollTo(index);
        },
        [emblaApi]
    );

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
        };
    }, [emblaApi, onSelect]);

    // Reinitialize carousel when pages change (viewport resize)
    useEffect(() => {
        if (emblaApi) {
            emblaApi.reInit();
        }
    }, [emblaApi, pages.length, isMobile]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative"
        >
            {/* Carousel Container */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {pages.map((page, pageIndex) => (
                        <div
                            key={pageIndex}
                            className="flex-shrink-0 w-full"
                        >
                            {/* Grid layout: 2x2 on desktop, single card on mobile */}
                            <div className={`grid gap-6 ${isMobile
                                ? "grid-cols-1 justify-items-center"
                                : "grid-cols-2 max-w-4xl mx-auto"
                                }`}>
                                {page.map((testimonial, index) => (
                                    <TestimonialCard
                                        key={`${testimonial.name}-${pageIndex}-${index}`}
                                        name={testimonial.name}
                                        role={testimonial.role}
                                        message={testimonial.message}
                                        avatar={testimonial.avatar}
                                        rating={testimonial.rating}
                                        fullWidth={!isMobile}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation - Arrows on desktop, dots on mobile */}
            <div className="flex items-center justify-center gap-4 mt-8">
                {/* Desktop: Show arrows */}
                <button
                    onClick={scrollPrev}
                    disabled={!prevBtnEnabled}
                    className="hidden md:flex p-3 rounded-full border border-border bg-card hover:bg-accent/10 hover:border-accent transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed group"
                    aria-label="Anterior"
                >
                    <ChevronLeft className="size-5 text-foreground group-hover:text-accent transition-colors" />
                </button>

                {/* Pagination dots - always visible */}
                <div className="flex items-center gap-2">
                    {pages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === selectedIndex
                                ? "w-8 bg-accent"
                                : "w-2 bg-muted hover:bg-muted-foreground/50"
                                }`}
                            aria-label={`Ir para página ${index + 1}`}
                        />
                    ))}
                </div>


                <button
                    onClick={scrollNext}
                    disabled={!nextBtnEnabled}
                    className="hidden md:flex p-3 rounded-full border border-border bg-card hover:bg-accent/10 hover:border-accent transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed group"
                    aria-label="Próximo"
                >
                    <ChevronRight className="size-5 text-foreground group-hover:text-accent transition-colors" />
                </button>
            </div>
        </motion.div>
    );
}
