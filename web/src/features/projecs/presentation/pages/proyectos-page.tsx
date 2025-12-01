"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  X, 
  Github, 
  ExternalLink, 
  Users, 
  Target, 
  Wrench, 
  Layers,
  ChevronLeft,
  ChevronRight,
  Play,
  FileCode
} from "lucide-react";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";

// ============================================================================
// TYPES
// ============================================================================

interface Creador {
  nombre: string;
  rol: string;
  avatar?: string;
}

interface Proyecto {
  id: string;
  titulo: string;
  categoria: string;
  imagenes: string[];
  descripcion: string;
  tecnologias: string[];
  fecha: string;
  // Nuevos campos para ficha detallada
  creadores: Creador[];
  objetivo: string;
  problemaResuelto: string;
  procesoFabricacion: string[];
  videoUrl?: string;
  githubUrl?: string;
  thingiverseUrl?: string;
  archivosDiseno?: string;
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
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=600&fit=crop",
    ],
    descripcion: "Sistema automatizado de riego con sensores de humedad y control remoto vía app móvil.",
    tecnologias: ["Arduino Nano", "ESP32", "React Native", "Node.js", "MQTT", "Sensores de Humedad"],
    fecha: "2024",
    creadores: [
      { nombre: "María González", rol: "Líder de Proyecto", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
      { nombre: "Carlos Mendoza", rol: "Desarrollador IoT", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
      { nombre: "Ana Fuentes", rol: "Desarrolladora Mobile", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
    ],
    objetivo: "Crear un sistema de riego automatizado que optimice el uso del agua y permita el monitoreo remoto de jardines y cultivos.",
    problemaResuelto: "El desperdicio de agua en sistemas de riego tradicionales y la falta de monitoreo en tiempo real del estado del suelo.",
    procesoFabricacion: [
      "Diseño del circuito electrónico en Fritzing",
      "Prototipado en protoboard con Arduino y sensores",
      "Diseño e impresión 3D de carcasa resistente al agua",
      "Programación del firmware en C++ para Arduino",
      "Desarrollo de API REST con Node.js",
      "Creación de app móvil en React Native",
      "Pruebas de campo durante 3 meses",
    ],
    videoUrl: "https://youtube.com/watch?v=example",
    githubUrl: "https://github.com/fablab/riego-inteligente",
    thingiverseUrl: "https://thingiverse.com/thing:123456",
  },
  {
    id: "2",
    titulo: "Brazo Robótico Industrial",
    categoria: "Hardware",
    imagenes: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    ],
    descripcion: "Brazo robótico de 6 ejes para automatización de procesos industriales y educación.",
    tecnologias: ["ROS", "Python", "Impresión 3D FDM", "Servomotores MG996R", "Arduino Mega", "Raspberry Pi 4"],
    fecha: "2024",
    creadores: [
      { nombre: "Diego Fuentes", rol: "Ingeniero Mecánico", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
      { nombre: "Laura Sánchez", rol: "Programadora ROS", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
    ],
    objetivo: "Desarrollar un brazo robótico de bajo costo con capacidades industriales para formación técnica.",
    problemaResuelto: "Alto costo de brazos robóticos educativos y falta de material didáctico accesible para estudiantes.",
    procesoFabricacion: [
      "Modelado 3D completo en Fusion 360",
      "Análisis de esfuerzos y simulación mecánica",
      "Impresión 3D de piezas en PLA y PETG",
      "Mecanizado CNC de base en aluminio",
      "Ensamblaje y cableado de servomotores",
      "Configuración de ROS en Raspberry Pi",
      "Calibración cinemática y pruebas de precisión",
    ],
    githubUrl: "https://github.com/fablab/brazo-robotico",
    thingiverseUrl: "https://thingiverse.com/thing:789012",
  },
  {
    id: "3",
    titulo: "App de Gestión FabLab",
    categoria: "Software",
    imagenes: [
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    ],
    descripcion: "Aplicación web para gestión de inventario, reserva de equipos y seguimiento de proyectos.",
    tecnologias: ["Next.js 14", "TypeScript", "PostgreSQL", "Prisma ORM", "TailwindCSS", "Strapi CMS"],
    fecha: "2024",
    creadores: [
      { nombre: "Valentina Ríos", rol: "Full Stack Developer", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
      { nombre: "Andrés Silva", rol: "Backend Developer", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
      { nombre: "Camila Torres", rol: "UX/UI Designer", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
    ],
    objetivo: "Digitalizar y optimizar la gestión operativa del FabLab para mejorar la experiencia de usuarios.",
    problemaResuelto: "Gestión manual de reservas, inventario desactualizado y falta de trazabilidad de proyectos.",
    procesoFabricacion: [
      "Investigación UX y entrevistas con usuarios",
      "Diseño de wireframes y prototipos en Figma",
      "Arquitectura de base de datos relacional",
      "Desarrollo de API REST con Next.js",
      "Implementación de autenticación JWT",
      "Integración con sistema de notificaciones",
      "Deploy en Vercel con CI/CD",
    ],
    githubUrl: "https://github.com/fablab/gestion-app",
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
    descripcion: "Diseño paramétrico de carcasa modular impresa en 3D con sistema de ventilación activa.",
    tecnologias: ["Fusion 360", "PLA+", "Impresión 3D FDM", "Corte Láser", "Diseño Paramétrico"],
    fecha: "2024",
    creadores: [
      { nombre: "Pablo Martínez", rol: "Diseñador Industrial", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    ],
    objetivo: "Crear una carcasa modular y personalizable que se adapte a diferentes configuraciones de Raspberry Pi.",
    problemaResuelto: "Carcasas genéricas que no permiten expansión ni personalización para proyectos específicos.",
    procesoFabricacion: [
      "Bocetos y conceptualización inicial",
      "Modelado paramétrico en Fusion 360",
      "Pruebas de tolerancias con prototipos",
      "Optimización para impresión 3D",
      "Corte láser de paneles decorativos",
      "Documentación y publicación de archivos",
    ],
    thingiverseUrl: "https://thingiverse.com/thing:456789",
    archivosDiseno: "https://grabcad.com/library/raspberry-case",
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
    descripcion: "Dispositivo IoT para monitoreo en tiempo real de CO2, temperatura, humedad y partículas PM2.5.",
    tecnologias: ["ESP8266", "MQTT", "Grafana", "InfluxDB", "Sensor SCD40", "Sensor PMS5003"],
    fecha: "2024",
    creadores: [
      { nombre: "Roberto Díaz", rol: "Electrónico", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
      { nombre: "Elena Vargas", rol: "Data Scientist", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
    ],
    objetivo: "Proporcionar datos en tiempo real sobre la calidad del aire en espacios cerrados.",
    problemaResuelto: "Desconocimiento de los niveles de CO2 y contaminantes en aulas y oficinas.",
    procesoFabricacion: [
      "Selección y prueba de sensores",
      "Diseño de PCB en KiCad",
      "Fabricación de PCB con CNC",
      "Programación de firmware MicroPython",
      "Configuración de servidor MQTT",
      "Creación de dashboards en Grafana",
    ],
    githubUrl: "https://github.com/fablab/air-quality-monitor",
    videoUrl: "https://youtube.com/watch?v=airmonitor",
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
    descripcion: "Impresora 3D CoreXY de alta velocidad construida desde cero con volumen de 300x300x300mm.",
    tecnologias: ["Klipper", "Marlin", "Voron Design", "Perfiles Aluminio 2020", "TMC2209", "Raspberry Pi"],
    fecha: "2023",
    creadores: [
      { nombre: "Javier López", rol: "Maker Principal", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
      { nombre: "Sofía Ramírez", rol: "Asistente Técnico", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
    ],
    objetivo: "Construir una impresora 3D de alto rendimiento a bajo costo para el laboratorio.",
    problemaResuelto: "Necesidad de impresora rápida y confiable para proyectos de prototipado.",
    procesoFabricacion: [
      "Estudio del diseño Voron 2.4",
      "Adquisición de componentes y kits",
      "Corte y ensamblaje de frame de aluminio",
      "Instalación de sistema de movimiento CoreXY",
      "Cableado y configuración electrónica",
      "Instalación y configuración de Klipper",
      "Calibración y pruebas de velocidad",
    ],
    githubUrl: "https://github.com/fablab/custom-printer",
    videoUrl: "https://youtube.com/watch?v=printer3d",
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
    descripcion: "Panel de control web para visualización de datos de sensores IoT con gráficos interactivos.",
    tecnologias: ["React 18", "WebSocket", "D3.js", "Node.js", "MongoDB", "Chart.js"],
    fecha: "2023",
    creadores: [
      { nombre: "Miguel Ángel Pérez", rol: "Frontend Developer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    ],
    objetivo: "Crear una plataforma unificada para monitorear todos los dispositivos IoT del FabLab.",
    problemaResuelto: "Dispersión de datos de sensores en múltiples interfaces sin consolidar.",
    procesoFabricacion: [
      "Definición de requisitos con stakeholders",
      "Diseño de arquitectura de datos",
      "Implementación de servidor WebSocket",
      "Desarrollo de componentes React reutilizables",
      "Integración de librerías de gráficos",
      "Optimización de rendimiento",
    ],
    githubUrl: "https://github.com/fablab/iot-dashboard",
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
    descripcion: "Lámpara con diseño generativo y LEDs NeoPixel controlados por gestos y voz.",
    tecnologias: ["Grasshopper", "NeoPixel WS2812B", "Arduino Nano", "Sensor Ultrasónico", "Impresión 3D"],
    fecha: "2023",
    creadores: [
      { nombre: "Isabella Fernández", rol: "Diseñadora Paramétrica", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
      { nombre: "Tomás Herrera", rol: "Electrónico", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
    ],
    objetivo: "Fusionar diseño generativo con electrónica interactiva para crear una pieza funcional y artística.",
    problemaResuelto: "Falta de objetos decorativos que combinen tecnología con diseño personalizado.",
    procesoFabricacion: [
      "Generación de geometría en Grasshopper",
      "Optimización para impresión 3D",
      "Impresión en PLA translúcido",
      "Instalación de tira LED NeoPixel",
      "Programación de patrones de luz",
      "Integración de sensor de proximidad",
    ],
    thingiverseUrl: "https://thingiverse.com/thing:111213",
    videoUrl: "https://youtube.com/watch?v=lampara",
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
    descripcion: "Estación meteorológica con sensores de temperatura, humedad, presión y velocidad del viento.",
    tecnologias: ["ESP32", "BME280", "InfluxDB", "Grafana", "Anemómetro", "Panel Solar"],
    fecha: "2023",
    creadores: [
      { nombre: "Francisco Morales", rol: "Ingeniero Electrónico", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
    ],
    objetivo: "Monitorear condiciones climáticas locales con autonomía energética.",
    problemaResuelto: "Falta de datos meteorológicos hiperlocales para proyectos de agricultura urbana.",
    procesoFabricacion: [
      "Diseño de sistema de alimentación solar",
      "Selección de sensores meteorológicos",
      "Diseño de carcasa resistente a intemperie",
      "Programación de firmware ESP32",
      "Configuración de base de datos temporal",
      "Instalación y calibración en campo",
    ],
    githubUrl: "https://github.com/fablab/weather-station",
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
    descripcion: "Fresadora CNC compacta para PCB, grabado en madera y acrílico con área de trabajo 300x200mm.",
    tecnologias: ["GRBL", "Fusion 360", "Perfiles Aluminio", "Motor Spindle 500W", "Arduino UNO", "CNC Shield"],
    fecha: "2023",
    creadores: [
      { nombre: "Ricardo Vega", rol: "Ingeniero Mecánico", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
      { nombre: "Patricia Núñez", rol: "Técnica en Electrónica", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
    ],
    objetivo: "Fabricar una CNC económica para prototipado rápido de PCBs y piezas pequeñas.",
    problemaResuelto: "Alto costo de fabricación externa de PCBs y tiempos de espera prolongados.",
    procesoFabricacion: [
      "Diseño mecánico en Fusion 360",
      "Corte de perfiles de aluminio",
      "Maquinado de piezas en torno",
      "Ensamblaje de sistema de movimiento",
      "Instalación de husillo y sistema de refrigeración",
      "Configuración de GRBL y calibración",
    ],
    githubUrl: "https://github.com/fablab/desktop-cnc",
    thingiverseUrl: "https://thingiverse.com/thing:999888",
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
    <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
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

// ============================================================================
// PROJECT DETAIL MODAL
// ============================================================================

interface ProjectDetailModalProps {
  proyecto: Proyecto;
  isOpen: boolean;
  onClose: () => void;
}

function ProjectDetailModal({ proyecto, isOpen, onClose }: ProjectDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset image index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % proyecto.imagenes.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + proyecto.imagenes.length) % proyecto.imagenes.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-3xl z-50 overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex-1 overflow-y-auto">
              <div className="grid lg:grid-cols-2 min-h-full">
                {/* Left: Image Gallery */}
                <div className="relative bg-gray-900 lg:sticky lg:top-0 lg:h-screen">
                  {/* Main Image */}
                  <div className="relative h-[40vh] lg:h-full">
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
                          alt={`${proyecto.titulo} - Imagen ${currentImageIndex + 1}`}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    {proyecto.imagenes.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white text-sm">
                      {currentImageIndex + 1} / {proyecto.imagenes.length}
                    </div>
                  </div>

                  {/* Thumbnail Strip */}
                  <div className="absolute bottom-16 left-0 right-0 px-4 hidden lg:block">
                    <div className="flex gap-2 justify-center">
                      {proyecto.imagenes.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`relative w-16 h-12 rounded-lg overflow-hidden transition-all ${
                            idx === currentImageIndex
                              ? "ring-2 ring-orange-500 scale-110"
                              : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          <Image src={img} alt="" fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Project Details */}
                <div className="p-6 lg:p-10 overflow-y-auto">
                  {/* Header */}
                  <div className="mb-8">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 ${getCategoryStyles(proyecto.categoria)}`}>
                      {proyecto.categoria}
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                      {proyecto.titulo}
                    </h2>
                    <p className="text-gray-600 text-lg">{proyecto.descripcion}</p>
                    <p className="text-sm text-gray-400 mt-2">Año: {proyecto.fecha}</p>
                  </div>

                  {/* Creadores */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-orange-500" />
                      <h3 className="text-lg font-semibold text-gray-900">Equipo Creador</h3>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {proyecto.creadores.map((creador, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 pr-5">
                          {creador.avatar ? (
                            <div className="relative w-12 h-12 rounded-full overflow-hidden">
                              <Image src={creador.avatar} alt={creador.nombre} fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                              <span className="text-orange-600 font-semibold text-lg">
                                {creador.nombre.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{creador.nombre}</p>
                            <p className="text-sm text-gray-500">{creador.rol}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Objetivo y Problema */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-5 h-5 text-orange-600" />
                        <h3 className="font-semibold text-gray-900">Objetivo</h3>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{proyecto.objetivo}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Layers className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">Problema Resuelto</h3>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{proyecto.problemaResuelto}</p>
                    </div>
                  </div>

                  {/* Tecnologías */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Wrench className="w-5 h-5 text-orange-500" />
                      <h3 className="text-lg font-semibold text-gray-900">Tecnologías Utilizadas</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {proyecto.tecnologias.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-700 rounded-full text-sm font-medium transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Proceso de Fabricación */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Layers className="w-5 h-5 text-orange-500" />
                      <h3 className="text-lg font-semibold text-gray-900">Proceso de Fabricación</h3>
                    </div>
                    <div className="space-y-3">
                      {proyecto.procesoFabricacion.map((paso, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                            {idx + 1}
                          </div>
                          <p className="text-gray-700 pt-1">{paso}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Links Externos */}
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recursos y Enlaces</h3>
                    <div className="flex flex-wrap gap-3">
                      {proyecto.githubUrl && (
                        <a
                          href={proyecto.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-colors"
                        >
                          <Github className="w-5 h-5" />
                          Código Fuente
                        </a>
                      )}
                      {proyecto.thingiverseUrl && (
                        <a
                          href={proyecto.thingiverseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                        >
                          <FileCode className="w-5 h-5" />
                          Archivos 3D
                        </a>
                      )}
                      {proyecto.videoUrl && (
                        <a
                          href={proyecto.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                        >
                          <Play className="w-5 h-5" />
                          Ver Video
                        </a>
                      )}
                      {proyecto.archivosDiseno && (
                        <a
                          href={proyecto.archivosDiseno}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                          Archivos de Diseño
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Link a página completa */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <Link
                      href={`/proyectos/${proyecto.titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")}`}
                      className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Ver página completa del proyecto
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Project Card Component
interface ProjectCardProps {
  proyecto: Proyecto;
  index: number;
  onOpenDetail: (proyecto: Proyecto) => void;
}

function ProjectCard({ proyecto, index, onOpenDetail }: ProjectCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images
  useEffect(() => {
    if (proyecto.imagenes.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % proyecto.imagenes.length);
    }, 4000 + index * 500);
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
      className="group cursor-pointer"
      onClick={() => onOpenDetail(proyecto)}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
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
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </motion.div>
          </AnimatePresence>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="text-white text-sm font-medium">Click para ver detalles</span>
          </div>

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
              {proyecto.imagenes.slice(0, 5).map((_, idx) => (
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
          <Link 
            href={`/proyectos/${slug}`}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-1">
              {proyecto.titulo}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{proyecto.descripcion}</p>

          {/* Creadores Preview */}
          <div className="flex items-center gap-2 mt-4">
            <div className="flex -space-x-2">
              {proyecto.creadores.slice(0, 3).map((creador, idx) => (
                creador.avatar ? (
                  <div key={idx} className="relative w-7 h-7 rounded-full border-2 border-white overflow-hidden">
                    <Image src={creador.avatar} alt={creador.nombre} fill className="object-cover" />
                  </div>
                ) : (
                  <div key={idx} className="w-7 h-7 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 text-xs font-medium">{creador.nombre.charAt(0)}</span>
                  </div>
                )
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {proyecto.creadores.length} {proyecto.creadores.length === 1 ? "creador" : "creadores"}
            </span>
          </div>

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
            {proyecto.tecnologias.length > 3 && (
              <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-600 rounded-md">
                +{proyecto.tecnologias.length - 3}
              </span>
            )}
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
  onOpenDetail: (proyecto: Proyecto) => void;
}

function ProjectsGrid({ proyectos, onOpenDetail }: ProjectsGridProps) {
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
        <ProjectCard 
          key={proyecto.id} 
          proyecto={proyecto} 
          index={index} 
          onOpenDetail={onOpenDetail}
        />
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
  const [selectedProject, setSelectedProject] = useState<Proyecto | null>(null);

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

  const handleOpenDetail = (proyecto: Proyecto) => {
    setSelectedProject(proyecto);
  };

  const handleCloseDetail = () => {
    setSelectedProject(null);
  };

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
        <ProjectsGrid proyectos={proyectosFiltrados} onOpenDetail={handleOpenDetail} />
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          proyecto={selectedProject}
          isOpen={!!selectedProject}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}
