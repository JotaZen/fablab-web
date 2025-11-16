"use client";

import { cn } from "@/shared/utils";

interface GridPatternProps {
  className?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: string;
  numSquares?: number;
  maxOpacity?: number;
  duration?: number;
}

export function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  ...props
}: GridPatternProps) {
  const id = `grid-pattern-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {Array.from({ length: numSquares }, (_, i) => (
          <rect
            key={`${i}`}
            width={width - 1}
            height={height - 1}
            x={`${(i % Math.floor(100 / width)) * width + 1}`}
            y={`${Math.floor(i / Math.floor(100 / width)) * height + 1}`}
            fill="url(#gradient)"
            fillOpacity="0"
            className="animate-pulse"
          >
            <animate
              attributeName="fill-opacity"
              values={`0;${maxOpacity};0`}
              dur={`${duration}s`}
              begin={`${i * 0.1}s`}
              repeatCount="indefinite"
            />
          </rect>
        ))}
      </svg>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

interface FloatingElementsProps {
  className?: string;
  count?: number;
}

export function FloatingElements({ className, count = 6 }: FloatingElementsProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={cn(
            "absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60 animate-bounce"
          )}
        />
      ))}
    </div>
  );
}

interface GlowEffectProps {
  className?: string;
  color?: "blue" | "purple" | "green" | "pink";
}

export function GlowEffect({ className, color = "blue" }: GlowEffectProps) {
  const colorClasses = {
    blue: "from-blue-400/20 to-cyan-400/20",
    purple: "from-purple-400/20 to-pink-400/20",
    green: "from-green-400/20 to-emerald-400/20",
    pink: "from-pink-400/20 to-rose-400/20",
  };

  return (
    <div
      className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-50 blur-3xl pointer-events-none",
        colorClasses[color],
        className
      )}
    />
  );
}
