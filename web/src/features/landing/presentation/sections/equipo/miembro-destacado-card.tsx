"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import type { MiembroDestacado } from "./types";

interface MiembroDestacadoCardProps {
  miembro: MiembroDestacado;
  index: number;
}

export function MiembroDestacadoCard({ miembro, index }: MiembroDestacadoCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 relative">
          <Image src={miembro.imagen} alt={miembro.nombre} fill className="object-cover" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{miembro.nombre}</h4>
          <p className="text-sm text-orange-600">{miembro.especialidad}</p>
          <p className="text-xs text-gray-400 mt-1">Miembro desde {miembro.miembroDesde}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Proyecto Destacado:</p>
        <p className="font-medium text-gray-900">{miembro.proyectoDestacado}</p>
      </div>

      <div className="relative bg-gray-50 rounded-2xl p-4">
        <Quote className="absolute top-2 left-2 w-6 h-6 text-orange-200" />
        <p className="text-gray-600 text-sm italic pl-6">&quot;{miembro.testimonio}&quot;</p>
      </div>
    </div>
  );
}
