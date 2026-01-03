"use client";

import { motion } from "framer-motion";
import { TestimonialCard } from "@/components/elements/TestimonialCard";
import { useEffect, useRef, useState } from "react";

type Testimonial = {
  name: string;
  role: string;
  avatar: string;
  message: string;
  rating?: number;
};

export function TestimonialsGrid({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  // Split testimonials into two rows
  const midPoint = Math.ceil(testimonials.length / 2);
  const topRow = testimonials.slice(0, midPoint);
  const bottomRow = testimonials.slice(midPoint);

  return (
    <div className="flex flex-col gap-6 overflow-hidden py-4">
      {/* Top row - slides left */}
      <MarqueeRow testimonials={topRow} direction="left" />
      
      {/* Bottom row - slides right */}
      <MarqueeRow testimonials={bottomRow} direction="right" />
    </div>
  );
}

function MarqueeRow({
  testimonials,
  direction,
}: {
  testimonials: Testimonial[];
  direction: "left" | "right";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  // Duplicate items for seamless loop
  const items = [...testimonials, ...testimonials];

  useEffect(() => {
    if (containerRef.current) {
      // Get the width of one set of items (half of the total)
      const totalWidth = containerRef.current.scrollWidth;
      setContentWidth(totalWidth / 2);
    }
  }, [testimonials]);

  // Calculate animation duration based on content width (speed: ~50px per second)
  const animationDuration = Math.max(20, contentWidth / 50);

  return (
    <div className="relative overflow-hidden">
      {/* Gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <motion.div
        ref={containerRef}
        className="flex gap-6"
        initial={{ x: direction === "left" ? 0 : -contentWidth }}
        animate={{
          x: direction === "left" ? -contentWidth : 0,
        }}
        transition={{
          x: {
            duration: animationDuration,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          },
        }}
        key={contentWidth} // Re-render when width is calculated
      >
        {items.map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.name}-${index}`}
            name={testimonial.name}
            role={testimonial.role}
            message={testimonial.message}
            avatar={testimonial.avatar}
            rating={testimonial.rating}
          />
        ))}
      </motion.div>
    </div>
  );
}
