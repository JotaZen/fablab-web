"use client";

import Image from "next/image";

interface LogoProps {
    size?: number;
    className?: string;
}

/**
 * Logo FabLab - Componente reutilizable
 */
export function Logo({ size = 32, className = "" }: LogoProps) {
    return (
        <Image
            src="/images/logos/fablab-logo.png"
            alt="FabLab Logo"
            width={size}
            height={size}
            className={`object-contain ${className}`}
            priority
        />
    );
}

export default Logo;
