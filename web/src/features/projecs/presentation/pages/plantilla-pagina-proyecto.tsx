"use client";

import React from "react";
import type {
  PlantillaPaginaProyectoProps,
  ProjectSection,
  HeroSection as HeroSectionType,
  ProjectDetailsSection as ProjectDetailsSectionType,
  TechnologiesSection as TechnologiesSectionType,
  TeamSection as TeamSectionType,
} from "@/features/projecs/domain";
import {
  HeroSection,
  ProjectDetailsSection,
  TechnologiesSection,
  TeamSection,
} from "../sections";

/**
 * PlantillaPaginaProyecto
 * 
 * Componente principal reutilizable para mostrar páginas de proyectos.
 * Recibe todos sus datos via props y renderiza secciones modulares
 * según el tipo de cada sección.
 * 
 * @example
 * ```tsx
 * <PlantillaPaginaProyecto
 *   titulo="Mi Proyecto"
 *   encabezado="Descripción breve del proyecto"
 *   secciones={[
 *     { id: "1", tipo: "hero", orden: 1, ... },
 *     { id: "2", tipo: "proyecto", orden: 2, ... },
 *   ]}
 * />
 * ```
 */
export function PlantillaPaginaProyecto({
  titulo,
  encabezado,
  secciones,
}: PlantillaPaginaProyectoProps) {
  // Ordenar secciones por su campo 'orden'
  const seccionesOrdenadas = [...secciones].sort((a, b) => a.orden - b.orden);

  // Renderizar cada sección según su tipo
  const renderSection = (section: ProjectSection) => {
    switch (section.tipo) {
      case "hero":
        return (
          <HeroSection
            key={section.id}
            section={section as HeroSectionType}
            titulo={titulo}
            encabezado={encabezado}
          />
        );

      case "proyecto":
        return (
          <ProjectDetailsSection
            key={section.id}
            section={section as ProjectDetailsSectionType}
          />
        );

      case "tecnologias":
        return (
          <TechnologiesSection
            key={section.id}
            section={section as TechnologiesSectionType}
          />
        );

      case "equipo":
        return (
          <TeamSection
            key={section.id}
            section={section as TeamSectionType}
          />
        );

      case "galeria":
        // TODO: Implementar sección de galería
        return (
          <section key={section.id} className="py-16 bg-gray-100">
            <div className="container mx-auto px-6 text-center">
              <p className="text-gray-500">Galería (próximamente)</p>
            </div>
          </section>
        );

      case "custom":
      default:
        // Sección genérica para contenido personalizado
        return (
          <section key={section.id} className="py-16">
            <div className="container mx-auto px-6">
              {section.titulo && (
                <h2 className="text-3xl font-bold mb-6 text-center">
                  {section.titulo}
                </h2>
              )}
              {section.contenido && (
                <div
                  className="prose prose-lg max-w-3xl mx-auto"
                  dangerouslySetInnerHTML={{ __html: section.contenido }}
                />
              )}
            </div>
          </section>
        );
    }
  };

  return (
    <main className="min-h-screen">
      {seccionesOrdenadas.map(renderSection)}
    </main>
  );
}
