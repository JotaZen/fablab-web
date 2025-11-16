"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Scene3D } from "@/features/landing/presentation/graphics/scene-3d";
import { SectionTitle } from "@/shared/ui/texts/titles";
import { BodyText } from "@/shared/ui/texts/text";

interface ScrollReveal3DProps {
    title: string;
    description: string;
    model?: "cube" | "printer" | "chip";
}

export function ScrollReveal3D({
    title,
    description,
    model = "cube"
}: ScrollReveal3DProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Transformaciones basadas en scroll
    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

    return (
        <motion.div
            ref={containerRef}
            className="relative h-screen flex items-center justify-center overflow-hidden"
            style={{ opacity }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <motion.div
                        className="space-y-6"
                        style={{ y }}
                    >
                        <SectionTitle gradient>{title}</SectionTitle>
                        <BodyText size="lg">{description}</BodyText>
                    </motion.div>

                    {/* 3D Model with scroll animations */}
                    <motion.div
                        style={{
                            scale,
                            rotateY: rotate,
                        }}
                        className="relative"
                    >
                        <Scene3D
                            model={model}
                            className="h-96"
                            autoRotate={false}
                        />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

// Componente para múltiples reveals en secuencia
export function ScrollStory3D() {
    const containerRef = useRef<HTMLDivElement>(null);

    const sections = [
        {
            title: "Diseño Digital",
            description: "Comenzamos con ideas que transformamos en modelos 3D utilizando software CAD de vanguardia.",
            model: "cube" as const,
        },
        {
            title: "Prototipado Rápido",
            description: "Las ideas cobran vida a través de impresión 3D de alta precisión y materiales especializados.",
            model: "printer" as const,
        },
        {
            title: "Innovación Tecnológica",
            description: "Integramos electrónica avanzada para crear soluciones inteligentes y conectadas.",
            model: "chip" as const,
        },
    ];

    return (
        <div ref={containerRef} className="relative space-y-32">
            {sections.map((section, index) => (
                <ScrollReveal3D
                    key={index}
                    title={section.title}
                    description={section.description}
                    model={section.model}
                />
            ))}
        </div>
    );
}

// Componente para parallax con múltiples capas 3D
export function Parallax3DLayers() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Diferentes velocidades para crear efecto parallax
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -600]);

    return (
        <div ref={containerRef} className="relative h-[200vh] overflow-hidden">
            {/* Layer 1 - Background */}
            <motion.div
                style={{ y: y1 }}
                className="absolute inset-0 z-10"
            >
                <div className="w-full h-full flex items-center justify-center opacity-30">
                    <Scene3D model="chip" className="h-64" autoRotate={true} />
                </div>
            </motion.div>

            {/* Layer 2 - Middle */}
            <motion.div
                style={{ y: y2 }}
                className="absolute inset-0 z-20"
            >
                <div className="w-full h-full flex items-center justify-end pr-20 opacity-60">
                    <Scene3D model="cube" className="h-80" autoRotate={true} />
                </div>
            </motion.div>

            {/* Layer 3 - Foreground */}
            <motion.div
                style={{ y: y3 }}
                className="absolute inset-0 z-30"
            >
                <div className="w-full h-full flex items-center justify-start pl-20">
                    <Scene3D model="printer" className="h-96" autoRotate={true} />
                </div>
            </motion.div>

            {/* Content overlay */}
            <div className="relative z-40 h-full flex items-center justify-center">
                <div className="text-center space-y-6 bg-background/80 backdrop-blur-sm p-8 rounded-2xl">
                    <SectionTitle gradient>Múltiples Dimensiones</SectionTitle>
                    <BodyText size="lg" className="max-w-2xl">
                        Experimenta la profundidad de nuestras capacidades tecnológicas
                        a través de múltiples capas de innovación.
                    </BodyText>
                </div>
            </div>
        </div>
    );
}
