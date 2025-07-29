import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassBackgroundProps {
  className?: string;
  children?: ReactNode;
}

export function GlassBackground({ className, children }: GlassBackgroundProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none select-none",
        className
      )}
    >
      <div
        className="
          absolute inset-0
          bg-foreground/5 
          backdrop-blur-xl 
        "
      />
      {children}
    </div>
  );
}
