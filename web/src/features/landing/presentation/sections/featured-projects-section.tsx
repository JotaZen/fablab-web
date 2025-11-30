"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/buttons/button";

interface ProjectBox {
  id: string;
  titulo: string;
  imagenes: string[];
  descripcion?: string;
}

// Datos de ejemplo - se pueden reemplazar por datos de Strapi
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

const AUTO_ROTATE_INTERVAL = 6000; // 6 segundos por imagen

interface ProjectCardProps {
  proyecto: ProjectBox;
  index: number;
}

function ProjectCard({ proyecto, index }: ProjectCardProps) {
  const [displayImages, setDisplayImages] = useState<{ src: string; key: number }[]>([]);
  const [animationKey, setAnimationKey] = useState(0);
  const currentIndexRef = useRef(0);

  // Inicializar las imágenes en cascada
  useEffect(() => {
    // Crear un array duplicado para efecto infinito
    const initialImages = proyecto.imagenes.map((src, idx) => ({
      src,
      key: idx,
    }));
    setDisplayImages(initialImages);
  }, [proyecto.imagenes]);

  // Auto-rotate de imágenes estilo cascada
  useEffect(() => {
    const interval = setInterval(() => {
      currentIndexRef.current = (currentIndexRef.current + 1) % proyecto.imagenes.length;
      setAnimationKey((prev) => prev + 1);
    }, AUTO_ROTATE_INTERVAL + index * 500); // Desfase para que no cambien todas al mismo tiempo

    return () => clearInterval(interval);
  }, [proyecto.imagenes.length, index]);

  // Calcular qué imágenes mostrar (actual y siguiente para efecto cascada)
  const currentIdx = animationKey % proyecto.imagenes.length;
  const nextIdx = (animationKey + 1) % proyecto.imagenes.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.1,
      }}
      className="flex-shrink-0 w-64 sm:w-72 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 group"
    >
      {/* Imagen con transición automática - cascada infinita hacia la izquierda */}
      <div className="relative h-40 overflow-hidden">
        {/* Contenedor de imágenes en cascada */}
        <motion.div
          key={animationKey}
          className="absolute inset-0 flex"
          initial={{ x: "0%" }}
          animate={{ x: "-100%" }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {/* Imagen actual */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={proyecto.imagenes[currentIdx]}
            alt={`${proyecto.titulo} - imagen ${currentIdx + 1}`}
            className="flex-shrink-0 w-full h-full object-cover"
          />
          {/* Siguiente imagen (aparece desde la derecha) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={proyecto.imagenes[nextIdx]}
            alt={`${proyecto.titulo} - imagen ${nextIdx + 1}`}
            className="flex-shrink-0 w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        
        {/* Indicadores de imagen */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {proyecto.imagenes.map((_, idx) => (
            <span
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === nextIdx
                  ? "bg-white w-3"
                  : "bg-white/50"
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
}

export function FeaturedProjectsSection() {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCount(1);
      } else if (width < 768) {
        setVisibleCount(2);
      } else if (width < 1024) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  // Duplicar proyectos para efecto infinito sin espacios en blanco
  const duplicatedProjects = [...proyectosDestacados, ...proyectosDestacados];
  const totalProjects = proyectosDestacados.length;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev === 0) {
        return totalProjects - 1;
      }
      return prev - 1;
    });
  }, [totalProjects]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= totalProjects - 1) {
        return 0;
      }
      return prev + 1;
    });
  }, [totalProjects]);

  if (!mounted) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            Proyectos
          </h2>
          <div className="flex gap-6 justify-center">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-72 bg-white rounded-2xl shadow-lg h-56 animate-pulse"
              />
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
          {/* Flecha izquierda */}
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="absolute left-0 z-10 h-12 w-12 rounded-full bg-white shadow-lg border-gray-200 hover:bg-gray-50 -translate-x-1/2"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Contenedor de boxes */}
          <div
            ref={containerRef}
            className="w-full overflow-hidden mx-8"
          >
            <motion.div
              className="flex gap-6"
              animate={{
                x: -currentIndex * (288 + 24), // 288px (w-72) + 24px (gap-6)
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {duplicatedProjects.map((proyecto, index) => (
                <ProjectCard
                  key={`${proyecto.id}-${index}`}
                  proyecto={proyecto}
                  index={index}
                />
              ))}
            </motion.div>
          </div>

          {/* Flecha derecha */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="absolute right-0 z-10 h-12 w-12 rounded-full bg-white shadow-lg border-gray-200 hover:bg-gray-50 translate-x-1/2"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Indicadores de posición */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalProjects }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-200 ${
                idx === currentIndex
                  ? "bg-gray-900 w-8"
                  : "bg-gray-300 w-2 hover:bg-gray-400"
              }`}
              aria-label={`Ir a página ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
