"use client";

import React from "react";

interface DotGridProps {
    dotSize?: number; // tamaño del punto en px
    gap?: number; // separación entre puntos en px
    color?: string; // color de los puntos
    fadeRadius?: string; // porcentaje o px para el degradado de máscara
}

export function DotGridBackground({
    dotSize = 2,
    gap = 22,
    color = "rgba(0,0,0,0.06)",
    fadeRadius = "70%",
}: DotGridProps) {
    const backgroundImage = `radial-gradient(circle, ${color} ${dotSize}px, transparent ${dotSize}px)`;

    const style: React.CSSProperties = {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundImage,
        backgroundSize: `${gap}px ${gap}px`,
        // máscara radial para que los puntos se desvanezcan hacia los bordes
        WebkitMaskImage: `radial-gradient(circle at 50% 40%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) ${fadeRadius})`,
        maskImage: `radial-gradient(circle at 50% 40%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) ${fadeRadius})`,
        opacity: 0.95,
        mixBlendMode: "normal",
    };

    return <div aria-hidden style={style} />;
}

export default DotGridBackground;
