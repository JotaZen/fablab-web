import { cn } from "@/shared/utils";
import { ReactNode } from "react";

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "text-2xl md:text-3xl",
  md: "text-3xl md:text-4xl lg:text-5xl",
  lg: "text-4xl md:text-5xl lg:text-6xl",
  xl: "text-5xl md:text-6xl lg:text-7xl",
};

export function SectionTitle({ 
  children, 
  className, 
  gradient = false, 
  size = "md" 
}: SectionTitleProps) {
  return (
    <h2
      className={cn(
        "font-bold tracking-tight",
        sizeClasses[size],
        gradient 
          ? "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
          : "text-foreground",
        className
      )}
    >
      {children}
    </h2>
  );
}

interface HeroTitleProps {
  children: ReactNode;
  className?: string;
}

export function HeroTitle({ children, className }: HeroTitleProps) {
  return (
    <h1
      className={cn(
        "text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-bold tracking-tight leading-tight",
        "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </h1>
  );
}

interface SubtitleProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const subtitleSizes = {
  sm: "text-lg md:text-xl",
  md: "text-xl md:text-2xl",
  lg: "text-2xl md:text-3xl",
};

export function Subtitle({ children, className, size = "md" }: SubtitleProps) {
  return (
    <h3
      className={cn(
        "font-semibold text-muted-foreground",
        subtitleSizes[size],
        className
      )}
    >
      {children}
    </h3>
  );
}
