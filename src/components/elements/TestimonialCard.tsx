// src/components/elements/testimonial-card.tsx
"use client";

import Image from "next/image";
import { Quote, Star } from "lucide-react";

// Interface para as propriedades do nosso card
interface TestimonialCardProps {
  name: string;
  message: string;
  role: string;
  avatar: string;
  rating?: number;
  fullWidth?: boolean;
}

// Trim message to a reasonable length
function trimMessage(message: string, maxLength: number = 280): string {
  if (message.length <= maxLength) return message;
  return message.slice(0, maxLength).trim() + "...";
}

export function TestimonialCard({
  name,
  message,
  role,
  avatar,
  rating,
  fullWidth = false,
}: TestimonialCardProps) {
  return (
    <div className={`relative flex flex-row gap-4 ${fullWidth ? "w-full" : "w-[380px] min-w-[380px]"} min-h-[180px] rounded-xl bg-card border border-border p-4 shadow-md shrink-0`}>
      {/* Avatar */}
      <div className="relative size-12 rounded-full overflow-hidden border-2 border-accent shrink-0">
        <Image
          src={avatar}
          alt={`Foto de ${name}`}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-1 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm text-muted">{name}</span>
            <span className="text-xs text-accent">{role}</span>
          </div>

          {/* Star Rating */}
          {rating && (
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`size-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted"
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Message */}
        <p className="text-foreground/80 text-sm leading-relaxed line-clamp-5 text-muted">
          {trimMessage(message)}
        </p>

      </div>
      <Quote className="text-accent" size={20} />
    </div>
  );
}
