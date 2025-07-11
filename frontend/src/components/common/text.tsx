import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BodyTextProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "muted" | "accent";
}

const sizeClasses = {
  sm: "text-sm md:text-base",
  md: "text-base md:text-lg",
  lg: "text-lg md:text-xl",
};

const variantClasses = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  accent: "text-blue-600",
};

export function BodyText({
  children,
  className,
  size = "md",
  variant = "default"
}: BodyTextProps) {
  return (
    <p
      className={cn(
        "leading-relaxed",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </p>
  );
}

interface LeadTextProps {
  children: ReactNode;
  className?: string;
}

export function LeadText({ children, className }: LeadTextProps) {
  return (
    <p
      className={cn(
        "text-xl md:text-xl lg:text-2xl leading-relaxed text-muted-foreground font-light",
        className
      )}
    >
      {children}
    </p>
  );
}

interface HighlightTextProps {
  children: ReactNode;
  className?: string;
}

export function HighlightText({ children, className }: HighlightTextProps) {
  return (
    <span
      className={cn(
        "font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}

interface CodeTextProps {
  children: ReactNode;
  className?: string;
}

export function CodeText({ children, className }: CodeTextProps) {
  return (
    <code
      className={cn(
        "px-2 py-1 bg-muted rounded-md text-sm font-mono text-muted-foreground border",
        className
      )}
    >
      {children}
    </code>
  );
}
