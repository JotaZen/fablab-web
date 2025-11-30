"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";

// ============================================================================
// TYPES
// ============================================================================

interface Proyecto {
  id: string;
  titulo: string;
  categoria: string;
  imagenes: string[];
  descripcion: string;
  tecnologias: string[];
  fecha: string;
}

type CategoriaFiltro = "Todos" | "Hardware" | "Software" | "Diseño" | "IoT";

// ============================================================================
// MOCK DATA
// ============================================================================

const categorias: CategoriaFiltro[] = ["Todos", "Hardware", "Software", "Diseño", "IoT"];

const proyectosMock: Proyecto[] = [
  {
    id: "1",
    titulo: "Sistema de Riego Inteligente",
    categoria: "IoT",
    imagenes: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    ],
    descripcion: "Sistema automatizado de riego con sensores de humedad y control remoto.",
    tecnologias: ["Arduino", "ESP32", "React Native"],
    fecha: "2024",
  },
  {
    id: "2",
    titulo: "Brazo Robótico Industrial",
    categoria: "Hardware",
    imagenes: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=800&h=600&fit=crop",
    ],
    descripcion: "Brazo robótico de 6 ejes para automatización de procesos industriales.",
    tecnologias: ["ROS", "Python", "Impresión 3D"],
    fecha: "2024",
  },
  {
    id: "3",
    titulo: "App de Gestión FabLab",
    categoria: "Software",
    imagenes: [
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
    ],
    descripcion: "Aplicación web para gestión de inventario y reserva de equipos.",
    tecnologias: ["Next.js", "TypeScript", "PostgreSQL"],
    fecha: "2024",
  },
  {
    id: "4",
    titulo: "Carcasa Modular para Raspberry",
    categoria: "Diseño",
    imagenes: [
      "https://images.unsplash.com/photo-1631515242808-497c3fbd3972?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&h=600&fit=crop",
    ],
    descripcion: "Diseño paramétrico de carcasa modular impresa en 3D.",
    tecnologias: ["Fusion 360", "PLA", "Impresión 3D"],
    fecha: "2024",
  },
  {
    id: "5",
    titulo: "Monitor de Calidad del Aire",
    categoria: "IoT",
    imagenes: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    ],
    descripcion: "Dispositivo IoT para monitoreo en tiempo real de CO2 y partículas.",
    tecnologias: ["ESP8266", "MQTT", "Grafana"],
    fecha: "2024",
  },
  {
    id: "6",
    titulo: "Impresora 3D Custom",
    categoria: "Hardware",
    imagenes: [
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1631515242808-497c3fbd3972?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&h=600&fit=crop",
    ],
    descripcion: "Impresora 3D CoreXY de alta velocidad construida desde cero.",
    tecnologias: ["Klipper", "Marlin", "Voron"],
    fecha: "2023",
  },
  {
    id: "7",
    titulo: "Dashboard IoT en Tiempo Real",
    categoria: "Software",
    imagenes: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop",
    ],
    descripcion: "Panel de control para visualización de datos de sensores IoT.",
    tecnologias: ["React", "WebSocket", "D3.js"],
    fecha: "2023",
  },
  {
    id: "8",
    titulo: "Lámpara LED Interactiva",
    categoria: "Diseño",
    imagenes: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&h=600&fit=crop",
    ],
    descripcion: "Lámpara con diseño generativo y LEDs controlados por gestos.",
    tecnologias: ["Grasshopper", "NeoPixel", "Arduino"],
    fecha: "2023",
  },
  {
    id: "9",
    titulo: "Estación Meteorológica WiFi",
    categoria: "IoT",
    imagenes: [
      "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1561553543-e4c7b608b98d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1530908295418-a12e326966ba?w=800&h=600&fit=crop",
    ],
    descripcion: "Estación meteorológica con múltiples sensores y conexión WiFi.",
    tecnologias: ["ESP32", "BME280", "InfluxDB"],
    fecha: "2023",
  },
  {
    id: "10",
    titulo: "CNC Router de Escritorio",
    categoria: "Hardware",
    imagenes: [
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=800&h=600&fit=crop",
    ],
    descripcion: "Fresadora CNC compacta para PCB y grabado en madera.",
    tecnologias: ["GRBL", "Fusion 360", "Aluminio"],
    fecha: "2023",
  },
];

// Imágenes del hero carousel
const heroImages = [
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1631515242808-497c3fbd3972?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&h=1080&fit=crop",
];

// ============================================================================
// COMPONENTS
// ============================================================================

// Hero Carousel Component
function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[50vh] min-h-[400px] bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M10 10h80v80H10z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="10" cy="10" r="3" fill="currentColor" />
              <circle cx="90" cy="10" r="3" fill="currentColor" />
              <circle cx="10" cy="90" r="3" fill="currentColor" />
              <circle cx="90" cy="90" r="3" fill="currentColor" />
              <path d="M10 50h30M60 50h30M50 10v30M50 60v30" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Image Carousel */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-4xl mx-auto px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
            >
              <Image
                src={heroImages[currentIndex]}
                alt="Proyecto destacado"
                fill
                className="object-cover"
                priority
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Indicators */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-orange-500"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Title Overlay */}
      <div className="absolute top-8 left-0 right-0 text-center z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg"
        >
          Nuestros{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
            Proyectos
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto px-4"
        >
          Explora los proyectos desarrollados por nuestra comunidad de makers e innovadores
        </motion.p>
      </div>
    </section>
  );
}

// Search and Filter Component
interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoriaActiva: CategoriaFiltro;
  setCategoriaActiva: (categoria: CategoriaFiltro) => void;
}

function SearchFilter({
  searchQuery,
  setSearchQuery,
  categoriaActiva,
  setCategoriaActiva,
}: SearchFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar proyectos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-10 py-3 w-full rounded-full border-gray-200 focus:border-orange-500 focus:ring-orange-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Desktop Filters */}
          <div className="hidden md:flex items-center gap-2">
            {categorias.map((cat) => (
              <Button
                key={cat}
                variant={categoriaActiva === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoriaActiva(cat)}
                className={`rounded-full transition-all duration-300 ${
                  categoriaActiva === cat
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-transparent hover:from-orange-600 hover:to-orange-700"
                    : "border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600"
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center gap-2 rounded-full"
          >
            <Filter className="w-4 h-4" />
            Filtros
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
            />
          </Button>
        </div>

        {/* Mobile Filters Dropdown */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pt-4">
                {categorias.map((cat) => (
                  <Button
                    key={cat}
                    variant={categoriaActiva === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCategoriaActiva(cat);
                      setIsFilterOpen(false);
                    }}
                    className={`rounded-full ${
                      categoriaActiva === cat
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                        : ""
                    }`}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Project Card Component
interface ProjectCardProps {
  proyecto: Proyecto;
  index: number;
}

function ProjectCard({ proyecto, index }: ProjectCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images
  useEffect(() => {
    if (proyecto.imagenes.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % proyecto.imagenes.length);
    }, 4000 + index * 500); // Staggered timing
    return () => clearInterval(interval);
  }, [proyecto.imagenes.length, index]);

  const slug = proyecto.titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-gray-100">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={proyecto.imagenes[currentImageIndex]}
                alt={proyecto.titulo}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </AnimatePresence>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getCategoryStyles(
                proyecto.categoria
              )}`}
            >
              {proyecto.categoria}
            </span>
          </div>

          {/* Image indicators */}
          {proyecto.imagenes.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {proyecto.imagenes.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex ? "bg-white w-3" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <Link href={`/proyectos/${slug}`}>
            <h3 className="text-lg font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-1 cursor-pointer">
              {proyecto.titulo}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{proyecto.descripcion}</p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {proyecto.tecnologias.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// Helper function for category styles
function getCategoryStyles(categoria: string): string {
  const styles: Record<string, string> = {
    Hardware: "bg-blue-500 text-white",
    Software: "bg-purple-500 text-white",
    Diseño: "bg-pink-500 text-white",
    IoT: "bg-green-500 text-white",
  };
  return styles[categoria] || "bg-gray-500 text-white";
}

// Projects Grid Component
interface ProjectsGridProps {
  proyectos: Proyecto[];
}

function ProjectsGrid({ proyectos }: ProjectsGridProps) {
  if (proyectos.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No se encontraron proyectos
        </h3>
        <p className="text-gray-500">
          Intenta con otros términos de búsqueda o cambia los filtros
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {proyectos.map((proyecto, index) => (
        <ProjectCard key={proyecto.id} proyecto={proyecto} index={index} />
      ))}
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export function ProyectosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaFiltro>("Todos");

  // Filter projects
  const proyectosFiltrados = useMemo(() => {
    return proyectosMock.filter((proyecto) => {
      const matchesSearch =
        searchQuery === "" ||
        proyecto.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proyecto.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proyecto.tecnologias.some((tech) =>
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategoria =
        categoriaActiva === "Todos" || proyecto.categoria === categoriaActiva;

      return matchesSearch && matchesCategoria;
    });
  }, [searchQuery, categoriaActiva]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Search and Filters */}
      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoriaActiva={categoriaActiva}
        setCategoriaActiva={setCategoriaActiva}
      />

      {/* Projects Section */}
      <section className="container mx-auto px-6 py-12">
        {/* Results count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600">
            {proyectosFiltrados.length === proyectosMock.length
              ? `${proyectosFiltrados.length} proyectos disponibles`
              : `${proyectosFiltrados.length} de ${proyectosMock.length} proyectos`}
          </p>
          {(searchQuery || categoriaActiva !== "Todos") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setCategoriaActiva("Todos");
              }}
              className="text-orange-600 hover:text-orange-700"
            >
              Limpiar filtros
            </Button>
          )}
        </div>

        {/* Projects Grid */}
        <ProjectsGrid proyectos={proyectosFiltrados} />
      </section>
    </div>
  );
}
