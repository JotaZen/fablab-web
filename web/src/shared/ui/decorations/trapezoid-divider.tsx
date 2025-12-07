"use client";

interface TrapezoidDividerProps {
    color?: string;
    className?: string;
    inverted?: boolean;
}

/**
 * Trapecio decorativo para separar secciones
 * Similar al del navbar pero invertido para transiciones
 */
export function TrapezoidDivider({
    color = "#ffffff",
    className = "",
    inverted = false
}: TrapezoidDividerProps) {
    // Path normal: trapecio hacia abajo (para fin de sección clara)
    // Path invertido: trapecio hacia arriba (para inicio de sección clara)
    const path = inverted
        ? "M0 36 H800 L840 0 H1080 L1120 36 H1920 V36 H0 Z"
        : "M0 0 H1920 V0 H1120 L1080 36 H840 L800 0 H0 Z";

    return (
        <div className={`w-full h-9 relative ${className}`}>
            <svg
                className="w-full h-full"
                viewBox="0 0 1920 36"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path d={path} fill={color} />
            </svg>
        </div>
    );
}

export default TrapezoidDivider;
