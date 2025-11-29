"use client";

import React from "react";
import type { ProjectDetailsSection as ProjectDetailsSectionType } from "@/features/projecs/domain";
import { CheckCircle, Clock, Pause, Calendar } from "lucide-react";

interface ProjectDetailsSectionProps {
  section: ProjectDetailsSectionType;
}

const estadoConfig = {
  "en-progreso": {
    label: "En Progreso",
    icon: Clock,
    color: "text-blue-600 bg-blue-100",
  },
  completado: {
    label: "Completado",
    icon: CheckCircle,
    color: "text-green-600 bg-green-100",
  },
  pausado: {
    label: "Pausado",
    icon: Pause,
    color: "text-yellow-600 bg-yellow-100",
  },
};

export function ProjectDetailsSection({ section }: ProjectDetailsSectionProps) {
  const estado = estadoConfig[section.estado];
  const EstadoIcon = estado.icon;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        {section.titulo && (
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {section.titulo}
          </h2>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Estado y fechas */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${estado.color}`}
            >
              <EstadoIcon className="w-4 h-4" />
              {estado.label}
            </span>

            {section.fechaInicio && (
              <span className="inline-flex items-center gap-2 text-gray-600 text-sm">
                <Calendar className="w-4 h-4" />
                Inicio: {new Date(section.fechaInicio).toLocaleDateString("es-CL")}
              </span>
            )}

            {section.fechaFin && (
              <span className="inline-flex items-center gap-2 text-gray-600 text-sm">
                <Calendar className="w-4 h-4" />
                Fin: {new Date(section.fechaFin).toLocaleDateString("es-CL")}
              </span>
            )}
          </div>

          {/* Descripción */}
          <div className="prose prose-lg max-w-none mb-10">
            <p className="text-gray-700 leading-relaxed">{section.descripcion}</p>
          </div>

          {/* Objetivos y Resultados */}
          <div className="grid md:grid-cols-2 gap-8">
            {section.objetivos && section.objetivos.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  🎯 Objetivos
                </h3>
                <ul className="space-y-3">
                  {section.objetivos.map((objetivo, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-blue-500 mt-1">•</span>
                      <span className="text-gray-700">{objetivo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {section.resultados && section.resultados.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  ✅ Resultados
                </h3>
                <ul className="space-y-3">
                  {section.resultados.map((resultado, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">•</span>
                      <span className="text-gray-700">{resultado}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
