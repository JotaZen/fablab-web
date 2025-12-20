"use client";

import React from "react";
import type { HeroSection as HeroSectionType } from "@/features/projecs/domain";
import { Button } from "@/shared/ui/buttons/button";

interface HeroSectionProps {
  section: HeroSectionType;
  titulo: string;
  encabezado: string;
}

export function HeroSection({ section, titulo, encabezado }: HeroSectionProps) {
  return (
    <section
      className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: section.imagenFondo
          ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${section.imagenFondo})`
          : "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto px-6 py-20 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          {titulo}
        </h1>
        <p className="text-xl md:text-2xl mb-4 opacity-90 max-w-3xl mx-auto">
          {encabezado}
        </p>
        {section.subtitulo && (
          <p className="text-lg opacity-75 mb-8 max-w-2xl mx-auto">
            {section.subtitulo}
          </p>
        )}
        {section.ctaTexto && section.ctaUrl && (
          <Button
            asChild
            size="lg"
            className="bg-white text-black hover:bg-gray-100"
          >
            <a href={section.ctaUrl}>{section.ctaTexto}</a>
          </Button>
        )}
      </div>
    </section>
  );
}
