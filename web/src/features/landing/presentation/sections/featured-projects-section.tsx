"use client";

import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/shared/ui/buttons/button";

interface ProjectBox {
  id: string;
  titulo: string;
  imagenes: string[];
  descripcion?: string;
}

// Datos con múltiples imágenes
const proyectosDestacados: ProjectBox[] = [
  {
    id: "1",
    titulo: "Impresión 3D",
    imagenes: [
      "https://images.unsplash.com/photo-1631515242808-497c3fbd3972?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop",
    ],
    descripcion: "Prototipado rápido con tecnología FDM y SLA",
  },
  {
    id: "2",
    titulo: "Electrónica IoT",
    imagenes: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop",
    ],
    descripcion: "Dispositivos conectados y sensores inteligentes",
  },
  {
    id: "3",
    titulo: "Corte Láser",
    imagenes: [
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
    ],
    descripcion: "Precisión milimétrica en múltiples materiales",
  },
  {
    id: "4",
    titulo: "Robótica",
    imagenes: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=400&h=300&fit=crop",
    ],
    descripcion: "Automatización y brazos robóticos",
  },
  {
    id: "5",
    titulo: "Diseño CAD",
    imagenes: [
      "https://images.unsplash.com/photo-1545670723-196ed0954986?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581094794329-c8112d89b8a3?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    ],
    descripcion: "Modelado 3D profesional",
  },
  {
    id: "6",
    titulo: "Programación",
    imagenes: [
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
    ],
    descripcion: "Desarrollo de software y firmware",
  },
  {
    id: "7",
    titulo: "CNC Fresado",
    imagenes: [
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=400&h=300&fit=crop",
    ],
    descripcion: "Mecanizado de precisión en madera y metal",
  },
  {
    id: "8",
    titulo: "Realidad Virtual",
    imagenes: [
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=400&h=300&fit=crop",
    ],
    descripcion: "Experiencias inmersivas y simulaciones 3D",
  },
  {
    id: "9",
    titulo: "Drones",
    imagenes: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400&h=300&fit=crop",
    ],
    descripcion: "Fotografía aérea y mapeo con UAVs",
  },
  {
    id: "10",
    titulo: "Bordado Digital",
    imagenes: [
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=400&h=300&fit=crop",
    ],
    descripcion: "Personalización textil automatizada",
  },
  {
    id: "11",
    titulo: "Arduino",
    imagenes: [
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    ],
    descripcion: "Proyectos de electrónica y microcontroladores",
  },
  {
    id: "12",
    titulo: "Escaneo 3D",
    imagenes: [
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    ],
    descripcion: "Digitalización de objetos físicos",
  },
];

interface ProjectCardProps {
  proyecto: ProjectBox;
  index: number;
}

// Componente memorizado - cambia imagen solo en hover
const ProjectCard = memo(function ProjectCard({ proyecto, index }: ProjectCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Cambiar imagen solo cuando está en hover
  useEffect(() => {
    if (!isHovering) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % proyecto.imagenes.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isHovering, proyecto.imagenes.length]);

  // Reset al salir del hover
  const handleMouseLeave = () => {
    setIsHovering(false);
    setCurrentImageIndex(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="flex-shrink-0 w-64 sm:w-72 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Imagen con transición en hover */}
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={proyecto.imagenes[currentImageIndex]}
              alt={`${proyecto.titulo} - imagen ${currentImageIndex + 1}`}
              fill
              sizes="(max-width: 640px) 256px, 288px"
              className="object-cover"
              priority={index < 4}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        
        {/* Indicadores de imagen */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {proyecto.imagenes.map((_, idx) => (
            <span
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === currentImageIndex ? "bg-white w-3" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <Link 
          href={`/proyectos/${proyecto.titulo.toLowerCase().replace(/\s+/g, '-')}`}
          className="text-base font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors hover:underline block"
        >
          {proyecto.titulo}
        </Link>
        {proyecto.descripcion && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {proyecto.descripcion}
          </p>
        )}
      </div>
    </motion.div>
  );
});

export function FeaturedProjectsSection() {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleCount(1);
      else if (width < 768) setVisibleCount(2);
      else if (width < 1024) setVisibleCount(3);
      else setVisibleCount(4);
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const totalProjects = proyectosDestacados.length;
  const maxIndex = Math.max(0, totalProjects - visibleCount);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  if (!mounted) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Proyectos</h2>
          <div className="flex gap-6 justify-center">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-72 bg-white rounded-2xl shadow-lg h-56 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Link href="/proyectos" className="inline-block">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors cursor-pointer">
              Proyectos
            </h2>
          </Link>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explora nuestras áreas de innovación y fabricación digital
          </p>
        </motion.div>

        {/* Carrusel horizontal */}
        <div className="relative flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-0 z-10 h-12 w-12 rounded-full bg-white shadow-lg border-gray-200 hover:bg-gray-50 -translate-x-1/2 disabled:opacity-50"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <div ref={containerRef} className="w-full overflow-hidden mx-8">
            <motion.div
              className="flex gap-6"
              animate={{ x: -currentIndex * (288 + 24) }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {proyectosDestacados.map((proyecto, index) => (
                <ProjectCard key={proyecto.id} proyecto={proyecto} index={index} />
              ))}
            </motion.div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 z-10 h-12 w-12 rounded-full bg-white shadow-lg border-gray-200 hover:bg-gray-50 translate-x-1/2 disabled:opacity-50"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Indicadores de posición */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-200 ${
                idx === currentIndex ? "bg-gray-900 w-8" : "bg-gray-300 w-2 hover:bg-gray-400"
              }`}
              aria-label={`Ir a página ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
