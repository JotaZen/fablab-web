"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/buttons/button";

interface TechBox {
  id: string;
  titulo: string;
  imagenes: string[];
  descripcion?: string;
}

interface TechCategory {
  id: string;
  label: string;
  color: string;
  tecnologias: TechBox[];
}

// Datos de ejemplo organizados por categorías
const techCategories: TechCategory[] = [
  {
    id: "hardware",
    label: "Hardware & Fabricación",
    color: "from-blue-500 to-cyan-500",
    tecnologias: [
      {
        id: "h1",
        titulo: "Impresoras 3D FDM",
        imagenes: [
          "https://images.unsplash.com/photo-1631515242808-497c3fbd3972?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop",
        ],
        descripcion: "Prusa, Ender, Ultimaker",
      },
      {
        id: "h2",
        titulo: "Impresoras 3D Resina",
        imagenes: [
          "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1631515242808-497c3fbd3972?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
        ],
        descripcion: "Elegoo, Anycubic, Formlabs",
      },
      {
        id: "h3",
        titulo: "Cortadora Láser",
        imagenes: [
          "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
        ],
        descripcion: "CO2 y Fibra óptica",
      },
      {
        id: "h4",
        titulo: "CNC Router",
        imagenes: [
          "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=400&h=300&fit=crop",
        ],
        descripcion: "Fresado de precisión",
      },
      {
        id: "h5",
        titulo: "Escáner 3D",
        imagenes: [
          "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        ],
        descripcion: "Digitalización de objetos",
      },
      {
        id: "h6",
        titulo: "Soldadura",
        imagenes: [
          "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=400&h=300&fit=crop",
        ],
        descripcion: "Estaciones de soldadura SMD",
      },
    ],
  },
  {
    id: "software",
    label: "Software & Desarrollo",
    color: "from-purple-500 to-pink-500",
    tecnologias: [
      {
        id: "s1",
        titulo: "CAD/CAM",
        imagenes: [
          "https://images.unsplash.com/photo-1545670723-196ed0954986?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1581094794329-c8112d89b8a3?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        ],
        descripcion: "Fusion 360, SolidWorks, FreeCAD",
      },
      {
        id: "s2",
        titulo: "Slicers",
        imagenes: [
          "https://images.unsplash.com/photo-1631515242808-497c3fbd3972?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
        ],
        descripcion: "PrusaSlicer, Cura, Bambu Studio",
      },
      {
        id: "s3",
        titulo: "Arduino IDE",
        imagenes: [
          "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
        ],
        descripcion: "Programación de microcontroladores",
      },
      {
        id: "s4",
        titulo: "VS Code",
        imagenes: [
          "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
        ],
        descripcion: "Desarrollo web y aplicaciones",
      },
      {
        id: "s5",
        titulo: "Blender",
        imagenes: [
          "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=400&h=300&fit=crop",
        ],
        descripcion: "Modelado y animación 3D",
      },
      {
        id: "s6",
        titulo: "KiCad",
        imagenes: [
          "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=400&h=300&fit=crop",
        ],
        descripcion: "Diseño de PCBs",
      },
    ],
  },
];

const AUTO_ROTATE_INTERVAL = 6000;

interface TechCardProps {
  tech: TechBox;
  index: number;
}

function TechCard({ tech, index }: TechCardProps) {
  const [animationKey, setAnimationKey] = useState(0);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      currentIndexRef.current = (currentIndexRef.current + 1) % tech.imagenes.length;
      setAnimationKey((prev) => prev + 1);
    }, AUTO_ROTATE_INTERVAL + index * 500);

    return () => clearInterval(interval);
  }, [tech.imagenes.length, index]);

  const currentIdx = animationKey % tech.imagenes.length;
  const nextIdx = (animationKey + 1) % tech.imagenes.length;

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
      className="flex-shrink-0 w-56 sm:w-64 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 group"
    >
      <div className="relative h-36 overflow-hidden">
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tech.imagenes[currentIdx]}
            alt={`${tech.titulo} - imagen ${currentIdx + 1}`}
            className="flex-shrink-0 w-full h-full object-cover"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tech.imagenes[nextIdx]}
            alt={`${tech.titulo} - imagen ${nextIdx + 1}`}
            className="flex-shrink-0 w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {tech.imagenes.map((_, idx) => (
            <span
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === nextIdx ? "bg-white w-3" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-3">
        <h4 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
          {tech.titulo}
        </h4>
        {tech.descripcion && (
          <p className="text-xs text-gray-600 line-clamp-1">
            {tech.descripcion}
          </p>
        )}
      </div>
    </motion.div>
  );
}

interface CategoryCarouselProps {
  category: TechCategory;
  categoryIndex: number;
}

function CategoryCarousel({ category, categoryIndex }: CategoryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
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

  const duplicatedTechs = [...category.tecnologias, ...category.tecnologias];
  const totalTechs = category.tecnologias.length;

  // Dirección del auto-play: Hardware (índice 0) va a la derecha, Software (índice 1) va a la izquierda
  const direction = categoryIndex === 0 ? 1 : -1; // 1 = derecha, -1 = izquierda

  // Auto-play infinito
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (direction === 1) {
            // Mover a la derecha
            return prev >= totalTechs - 1 ? 0 : prev + 1;
          } else {
            // Mover a la izquierda
            return prev === 0 ? totalTechs - 1 : prev - 1;
          }
        });
      }, 2000); // Cambia cada 2 segundos
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, totalTechs, direction]);

  const handlePrev = () => {
    // Detener auto-play al presionar izquierda
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? totalTechs - 1 : prev - 1));
  };

  const handleNext = () => {
    // Iniciar/continuar auto-play infinito al presionar derecha
    if (!isAutoPlaying) {
      setIsAutoPlaying(true);
    } else {
      // Si ya está en auto-play, avanzar manualmente una vez
      setCurrentIndex((prev) => (prev >= totalTechs - 1 ? 0 : prev + 1));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: categoryIndex * 0.2 }}
      className="mb-12"
    >
      {/* Label de categoría */}
      <div className={`flex items-center gap-4 mb-6 ${categoryIndex % 2 === 1 ? 'flex-row-reverse' : ''}`}>
        <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${category.color}`} />
        <h3 className="text-xl md:text-2xl font-bold text-gray-800">
          {category.label}
        </h3>
        <div className={`h-1 flex-1 rounded-full bg-gradient-to-r ${category.color} opacity-30`} />
      </div>

      {/* Carrusel */}
      <div className="relative flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          className="absolute left-0 z-10 h-10 w-10 rounded-full bg-white shadow-lg border-gray-200 hover:bg-gray-50 -translate-x-1/2"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="w-full overflow-hidden mx-6">
          <motion.div
            className="flex gap-4"
            animate={{
              x: -currentIndex * (256 + 16), // 256px (w-64) + 16px (gap-4)
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            {duplicatedTechs.map((tech, index) => (
              <TechCard
                key={`${tech.id}-${index}`}
                tech={tech}
                index={index}
              />
            ))}
          </motion.div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="absolute right-0 z-10 h-10 w-10 rounded-full bg-white shadow-lg border-gray-200 hover:bg-gray-50 translate-x-1/2"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
}

export function TechCategoriesSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            Tecnologías
          </h2>
          <div className="space-y-12">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
                <div className="flex gap-4">
                  {[...Array(4)].map((_, j) => (
                    <div
                      key={j}
                      className="w-64 bg-gray-100 rounded-2xl h-48 animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Link href="/tecnologias" className="inline-block">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors cursor-pointer">
              Tecnologías
            </h2>
          </Link>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Herramientas y equipamiento que utilizamos para hacer realidad tus proyectos
          </p>
        </motion.div>

        {/* Categorías con carruseles */}
        {techCategories.map((category, index) => (
          <CategoryCarousel
            key={category.id}
            category={category}
            categoryIndex={index}
          />
        ))}
      </div>
    </section>
  );
}
