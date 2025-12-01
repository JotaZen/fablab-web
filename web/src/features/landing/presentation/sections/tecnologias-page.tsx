"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ChevronDown,
  X,
  Printer,
  Cpu,
  Wrench,
  Zap,
  Box,
  Layers,
  AlertTriangle,
  CheckCircle,
  Info,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";

// ============================================================================
// TYPES
// ============================================================================

type NivelCertificacion = "Básico" | "Nivel 1" | "Nivel 2" | "Nivel 3" | "Especializado";
type CategoriaEquipo = 
  | "Fabricación Aditiva"
  | "Fabricación Sustractiva"
  | "Electrónica y Programación"
  | "Herramientas y Montaje";

interface Equipo {
  id: string;
  nombre: string;
  categoria: CategoriaEquipo;
  imagen: string;
  marca: string;
  modelo: string;
  areaTrabajo: string;
  materialesCompatibles: string[];
  certificacionRequerida: NivelCertificacion;
  descripcion: string;
  estado: "Disponible" | "En uso" | "Mantenimiento";
  caracteristicas?: string[];
}

// ============================================================================
// MOCK DATA
// ============================================================================

const categoriasEquipo: CategoriaEquipo[] = [
  "Fabricación Aditiva",
  "Fabricación Sustractiva",
  "Electrónica y Programación",
  "Herramientas y Montaje",
];

const iconosPorCategoria: Record<CategoriaEquipo, React.ComponentType<{ className?: string }>> = {
  "Fabricación Aditiva": Printer,
  "Fabricación Sustractiva": Layers,
  "Electrónica y Programación": Cpu,
  "Herramientas y Montaje": Wrench,
};

const coloresPorCategoria: Record<CategoriaEquipo, string> = {
  "Fabricación Aditiva": "from-blue-500 to-blue-600",
  "Fabricación Sustractiva": "from-red-500 to-red-600",
  "Electrónica y Programación": "from-green-500 to-green-600",
  "Herramientas y Montaje": "from-amber-500 to-amber-600",
};

const bgPorCategoria: Record<CategoriaEquipo, string> = {
  "Fabricación Aditiva": "bg-blue-50 border-blue-200",
  "Fabricación Sustractiva": "bg-red-50 border-red-200",
  "Electrónica y Programación": "bg-green-50 border-green-200",
  "Herramientas y Montaje": "bg-amber-50 border-amber-200",
};

const coloresCertificacion: Record<NivelCertificacion, string> = {
  "Básico": "bg-gray-100 text-gray-700",
  "Nivel 1": "bg-green-100 text-green-700",
  "Nivel 2": "bg-yellow-100 text-yellow-700",
  "Nivel 3": "bg-orange-100 text-orange-700",
  "Especializado": "bg-red-100 text-red-700",
};

const equiposMock: Equipo[] = [
  // ============ FABRICACIÓN ADITIVA ============
  {
    id: "1",
    nombre: "Impresora 3D Prusa MK4",
    categoria: "Fabricación Aditiva",
    imagen: "https://images.unsplash.com/photo-1631515242808-497c3fbd3972?w=800&h=600&fit=crop",
    marca: "Prusa Research",
    modelo: "MK4",
    areaTrabajo: "250 x 210 x 220 mm",
    materialesCompatibles: ["PLA", "PETG", "ASA", "ABS", "TPU", "PC", "Nylon"],
    certificacionRequerida: "Nivel 1",
    descripcion: "Impresora 3D FDM de alta precisión con autonivelación y sensor de filamento.",
    estado: "Disponible",
    caracteristicas: ["Auto-nivelación", "Input Shaping", "Power Panic", "Sensor de filamento"],
  },
  {
    id: "2",
    nombre: "Impresora 3D Bambu Lab X1 Carbon",
    categoria: "Fabricación Aditiva",
    imagen: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop",
    marca: "Bambu Lab",
    modelo: "X1 Carbon",
    areaTrabajo: "256 x 256 x 256 mm",
    materialesCompatibles: ["PLA", "PETG", "ABS", "ASA", "PA", "PC", "Carbon Fiber"],
    certificacionRequerida: "Nivel 2",
    descripcion: "Impresora CoreXY de alta velocidad con sistema multicolor AMS.",
    estado: "Disponible",
    caracteristicas: ["Velocidad 500mm/s", "AMS compatible", "Cámara AI", "LiDAR"],
  },
  {
    id: "3",
    nombre: "Impresora 3D Resina Elegoo Mars 4",
    categoria: "Fabricación Aditiva",
    imagen: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&h=600&fit=crop",
    marca: "Elegoo",
    modelo: "Mars 4 Ultra",
    areaTrabajo: "153.36 x 77.52 x 165 mm",
    materialesCompatibles: ["Resina Standard", "Resina ABS-Like", "Resina Flexible", "Resina Castable"],
    certificacionRequerida: "Nivel 2",
    descripcion: "Impresora 3D de resina MSLA con pantalla LCD 9K de alta resolución.",
    estado: "Disponible",
    caracteristicas: ["Resolución 9K", "Velocidad 150mm/h", "WiFi", "Filtro de aire"],
  },
  {
    id: "4",
    nombre: "Impresora 3D Creality Ender 3 V3",
    categoria: "Fabricación Aditiva",
    imagen: "https://images.unsplash.com/photo-1631515242808-497c3fbd3972?w=800&h=600&fit=crop",
    marca: "Creality",
    modelo: "Ender 3 V3 SE",
    areaTrabajo: "220 x 220 x 250 mm",
    materialesCompatibles: ["PLA", "PETG", "TPU"],
    certificacionRequerida: "Básico",
    descripcion: "Impresora 3D económica ideal para principiantes y proyectos educativos.",
    estado: "Disponible",
    caracteristicas: ["Auto-nivelación CR Touch", "Extrusor Sprite", "Fácil montaje"],
  },

  // ============ FABRICACIÓN SUSTRACTIVA ============
  {
    id: "5",
    nombre: "Cortadora Láser CO2 60W",
    categoria: "Fabricación Sustractiva",
    imagen: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=600&fit=crop",
    marca: "OMTech",
    modelo: "K40 Pro",
    areaTrabajo: "400 x 600 mm",
    materialesCompatibles: ["Madera", "Acrílico", "MDF", "Cuero", "Cartón", "Tela", "Corcho"],
    certificacionRequerida: "Nivel 2",
    descripcion: "Cortadora láser CO2 para corte y grabado de materiales no metálicos.",
    estado: "Disponible",
    caracteristicas: ["Potencia 60W", "Enfriamiento por agua", "Cama ajustable", "Extractor de humo"],
  },
  {
    id: "6",
    nombre: "Router CNC 3018 Pro",
    categoria: "Fabricación Sustractiva",
    imagen: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop",
    marca: "SainSmart",
    modelo: "Genmitsu 3018 Pro",
    areaTrabajo: "300 x 180 x 45 mm",
    materialesCompatibles: ["Madera", "Acrílico", "PCB", "Aluminio blando", "PVC"],
    certificacionRequerida: "Nivel 1",
    descripcion: "Router CNC de escritorio para grabado y fresado de precisión.",
    estado: "En uso",
    caracteristicas: ["Spindle 775", "Control GRBL", "Offline controller", "Área expandible"],
  },
  {
    id: "7",
    nombre: "Cortadora de Vinilo Silhouette Cameo 4",
    categoria: "Fabricación Sustractiva",
    imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    marca: "Silhouette",
    modelo: "Cameo 4 Pro",
    areaTrabajo: "610 x 3000 mm (rollo)",
    materialesCompatibles: ["Vinilo", "Papel", "Cartulina", "Transfer", "HTV", "Tela fina"],
    certificacionRequerida: "Básico",
    descripcion: "Cortadora de vinilo profesional para señalización y personalización textil.",
    estado: "Disponible",
    caracteristicas: ["Alimentación por rollo", "Corte dual", "Bluetooth", "Software incluido"],
  },
  {
    id: "8",
    nombre: "Fresadora CNC Industrial",
    categoria: "Fabricación Sustractiva",
    imagen: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=600&fit=crop",
    marca: "ShopBot",
    modelo: "Desktop MAX",
    areaTrabajo: "914 x 610 x 140 mm",
    materialesCompatibles: ["Madera", "MDF", "Acrílico", "Aluminio", "Latón", "Espuma HD"],
    certificacionRequerida: "Nivel 3",
    descripcion: "CNC profesional para producción de muebles, moldes y prototipos industriales.",
    estado: "Disponible",
    caracteristicas: ["Spindle 2.2kW", "Control VCarve", "Mesa de vacío", "Cambio automático de herramienta"],
  },
  {
    id: "9",
    nombre: "Torno CNC de Precisión",
    categoria: "Fabricación Sustractiva",
    imagen: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=800&h=600&fit=crop",
    marca: "Sherline",
    modelo: "4410 CNC",
    areaTrabajo: "Ø 89 mm x 254 mm",
    materialesCompatibles: ["Aluminio", "Latón", "Acero", "Plásticos de ingeniería"],
    certificacionRequerida: "Nivel 3",
    descripcion: "Torno CNC de banco para mecanizado de piezas cilíndricas de precisión.",
    estado: "Mantenimiento",
    caracteristicas: ["Precisión 0.02mm", "Control LinuxCNC", "Portaherramientas rápido"],
  },

  // ============ ELECTRÓNICA Y PROGRAMACIÓN ============
  {
    id: "10",
    nombre: "Estación de Soldadura JBC",
    categoria: "Electrónica y Programación",
    imagen: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    marca: "JBC",
    modelo: "CD-2BQE",
    areaTrabajo: "N/A",
    materialesCompatibles: ["SMD", "Through-hole", "Rework BGA"],
    certificacionRequerida: "Nivel 1",
    descripcion: "Estación de soldadura profesional con control de temperatura y puntas intercambiables.",
    estado: "Disponible",
    caracteristicas: ["Temperatura ajustable", "Sleep mode", "Puntas cartridge", "ESD safe"],
  },
  {
    id: "11",
    nombre: "Osciloscopio Digital Rigol",
    categoria: "Electrónica y Programación",
    imagen: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop",
    marca: "Rigol",
    modelo: "DS1054Z",
    areaTrabajo: "N/A",
    materialesCompatibles: ["Señales analógicas", "Señales digitales", "I2C", "SPI", "UART"],
    certificacionRequerida: "Nivel 2",
    descripcion: "Osciloscopio de 4 canales con ancho de banda de 50MHz y decodificación de protocolos.",
    estado: "Disponible",
    caracteristicas: ["4 canales", "50MHz (hack 100MHz)", "1GSa/s", "Decodificación serial"],
  },
  {
    id: "12",
    nombre: "Kit Arduino Mega + Sensores",
    categoria: "Electrónica y Programación",
    imagen: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&h=600&fit=crop",
    marca: "Arduino",
    modelo: "Mega 2560 R3 Kit",
    areaTrabajo: "N/A",
    materialesCompatibles: ["Sensores diversos", "Actuadores", "Displays", "Módulos WiFi/BT"],
    certificacionRequerida: "Básico",
    descripcion: "Kit completo de desarrollo con Arduino Mega y más de 37 sensores y módulos.",
    estado: "Disponible",
    caracteristicas: ["54 I/O digitales", "16 entradas analógicas", "Kit de sensores incluido"],
  },
  {
    id: "13",
    nombre: "Raspberry Pi 5 Workstation",
    categoria: "Electrónica y Programación",
    imagen: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=600&fit=crop",
    marca: "Raspberry Pi",
    modelo: "Pi 5 8GB",
    areaTrabajo: "N/A",
    materialesCompatibles: ["Python", "C/C++", "Linux", "GPIO", "Camera Module"],
    certificacionRequerida: "Nivel 1",
    descripcion: "Estación de desarrollo con Raspberry Pi 5, monitor y periféricos completos.",
    estado: "Disponible",
    caracteristicas: ["8GB RAM", "Quad-core 2.4GHz", "PCIe", "Dual 4K display"],
  },
  {
    id: "14",
    nombre: "Analizador Lógico Saleae",
    categoria: "Electrónica y Programación",
    imagen: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    marca: "Saleae",
    modelo: "Logic Pro 16",
    areaTrabajo: "N/A",
    materialesCompatibles: ["I2C", "SPI", "UART", "CAN", "1-Wire", "JTAG"],
    certificacionRequerida: "Nivel 2",
    descripcion: "Analizador lógico de 16 canales para depuración de protocolos digitales.",
    estado: "Disponible",
    caracteristicas: ["16 canales", "500MS/s", "Software avanzado", "Decodificadores"],
  },

  // ============ HERRAMIENTAS Y MONTAJE ============
  {
    id: "15",
    nombre: "Banco de Trabajo Profesional",
    categoria: "Herramientas y Montaje",
    imagen: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&h=600&fit=crop",
    marca: "Bosch",
    modelo: "PWB 600",
    areaTrabajo: "680 x 553 mm",
    materialesCompatibles: ["Madera", "Metal", "Plástico", "Ensamblaje general"],
    certificacionRequerida: "Básico",
    descripcion: "Banco de trabajo plegable con mordazas integradas y superficie resistente.",
    estado: "Disponible",
    caracteristicas: ["Capacidad 200kg", "Altura ajustable", "Mordazas bambú", "Plegable"],
  },
  {
    id: "16",
    nombre: "Kit de Herramientas de Mano",
    categoria: "Herramientas y Montaje",
    imagen: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop",
    marca: "Stanley",
    modelo: "Professional Set 142pc",
    areaTrabajo: "N/A",
    materialesCompatibles: ["Uso general", "Electrónica", "Mecánica", "Carpintería"],
    certificacionRequerida: "Básico",
    descripcion: "Set completo de herramientas manuales profesionales para todo tipo de proyectos.",
    estado: "Disponible",
    caracteristicas: ["142 piezas", "Maletín incluido", "Cromo-vanadio", "Garantía de por vida"],
  },
  {
    id: "17",
    nombre: "Calibrador Digital Mitutoyo",
    categoria: "Herramientas y Montaje",
    imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    marca: "Mitutoyo",
    modelo: "500-196-30",
    areaTrabajo: "0-150 mm",
    materialesCompatibles: ["Medición de precisión", "Control de calidad"],
    certificacionRequerida: "Básico",
    descripcion: "Calibrador digital de alta precisión para mediciones exactas.",
    estado: "Disponible",
    caracteristicas: ["Resolución 0.01mm", "Display LCD", "Cero absoluto", "IP67"],
  },
  {
    id: "18",
    nombre: "Taladro de Columna",
    categoria: "Herramientas y Montaje",
    imagen: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=600&fit=crop",
    marca: "Einhell",
    modelo: "TE-BD 750 E",
    areaTrabajo: "Mesa 400 x 400 mm",
    materialesCompatibles: ["Madera", "Metal", "Plástico", "Aluminio"],
    certificacionRequerida: "Nivel 1",
    descripcion: "Taladro de columna con velocidad variable y mesa inclinable.",
    estado: "Disponible",
    caracteristicas: ["750W", "12 velocidades", "Láser de posición", "Profundidad ajustable"],
  },
  {
    id: "19",
    nombre: "Compresor de Aire",
    categoria: "Herramientas y Montaje",
    imagen: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&h=600&fit=crop",
    marca: "DeWalt",
    modelo: "DWFP55126",
    areaTrabajo: "N/A",
    materialesCompatibles: ["Herramientas neumáticas", "Inflado", "Limpieza"],
    certificacionRequerida: "Nivel 1",
    descripcion: "Compresor silencioso para herramientas neumáticas y trabajos de acabado.",
    estado: "Disponible",
    caracteristicas: ["6 galones", "165 PSI", "75.5 dB", "Sin aceite"],
  },
  {
    id: "20",
    nombre: "Pistola de Calor Industrial",
    categoria: "Herramientas y Montaje",
    imagen: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop",
    marca: "Makita",
    modelo: "HG6530V",
    areaTrabajo: "N/A",
    materialesCompatibles: ["Termoretráctil", "Pintura", "Adhesivos", "Plásticos"],
    certificacionRequerida: "Nivel 1",
    descripcion: "Pistola de calor con temperatura variable para múltiples aplicaciones.",
    estado: "Disponible",
    caracteristicas: ["2000W", "50-650°C", "Display LCD", "Accesorios incluidos"],
  },
];

// ============================================================================
// COMPONENTS
// ============================================================================

// Hero Section
function HeroSection() {
  return (
    <section className="relative w-full min-h-[40vh] bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Decorative Icons */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.1, y: 0 }}
          transition={{ duration: 1 }}
          className="absolute top-20 left-[10%]"
        >
          <Printer className="w-24 h-24 text-blue-400" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute top-32 right-[15%]"
        >
          <Cpu className="w-20 h-20 text-green-400" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="absolute bottom-20 left-[20%]"
        >
          <Layers className="w-16 h-16 text-red-400" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute bottom-32 right-[10%]"
        >
          <Wrench className="w-20 h-20 text-amber-400" />
        </motion.div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-block px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full text-sm font-semibold mb-6"
          >
            Equipamiento FabLab
          </motion.span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Nuestras{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Tecnologías
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Explora nuestro inventario completo de máquinas y equipos disponibles para 
            tus proyectos de fabricación digital, electrónica y prototipado.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-8 mt-12"
        >
          {[
            { label: "Equipos Disponibles", value: "20+" },
            { label: "Categorías", value: "4" },
            { label: "Usuarios Capacitados", value: "500+" },
            { label: "Proyectos Realizados", value: "1,200+" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-500">{stat.value}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Category Tabs
interface CategoryTabsProps {
  categoriaActiva: CategoriaEquipo | "Todos";
  setCategoriaActiva: (cat: CategoriaEquipo | "Todos") => void;
  conteosPorCategoria: Record<string, number>;
}

function CategoryTabs({ categoriaActiva, setCategoriaActiva, conteosPorCategoria }: CategoryTabsProps) {
  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant={categoriaActiva === "Todos" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoriaActiva("Todos")}
            className={`rounded-full transition-all duration-300 ${
              categoriaActiva === "Todos"
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-transparent"
                : "border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600"
            }`}
          >
            Todos ({conteosPorCategoria["Todos"] || 0})
          </Button>
          {categoriasEquipo.map((cat) => {
            const Icon = iconosPorCategoria[cat];
            return (
              <Button
                key={cat}
                variant={categoriaActiva === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoriaActiva(cat)}
                className={`rounded-full transition-all duration-300 flex items-center gap-2 ${
                  categoriaActiva === cat
                    ? `bg-gradient-to-r ${coloresPorCategoria[cat]} text-white border-transparent`
                    : "border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{cat}</span>
                <span className="sm:hidden">{cat.split(" ")[0]}</span>
                <span className="text-xs opacity-70">({conteosPorCategoria[cat] || 0})</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Search Bar
interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="container mx-auto px-6 py-6">
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar por nombre, marca, modelo o material..."
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
    </div>
  );
}

// Equipment Card
interface EquipmentCardProps {
  equipo: Equipo;
  index: number;
  onOpenDetail: (equipo: Equipo) => void;
}

function EquipmentCard({ equipo, index, onOpenDetail }: EquipmentCardProps) {
  const Icon = iconosPorCategoria[equipo.categoria];

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group cursor-pointer"
      onClick={() => onOpenDetail(equipo)}
    >
      <div className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border ${bgPorCategoria[equipo.categoria]}`}>
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={equipo.imagen}
            alt={equipo.nombre}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
              equipo.estado === "Disponible" 
                ? "bg-green-500 text-white" 
                : equipo.estado === "En uso" 
                  ? "bg-yellow-500 text-white" 
                  : "bg-red-500 text-white"
            }`}>
              {equipo.estado === "Disponible" && <CheckCircle className="w-3 h-3" />}
              {equipo.estado === "En uso" && <Info className="w-3 h-3" />}
              {equipo.estado === "Mantenimiento" && <AlertTriangle className="w-3 h-3" />}
              {equipo.estado}
            </span>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${coloresPorCategoria[equipo.categoria]} text-white`}>
              <Icon className="w-3 h-3" />
              {equipo.categoria.split(" ")[0]}
            </span>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="text-white text-sm font-medium flex items-center gap-1">
              Ver especificaciones <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
            {equipo.nombre}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{equipo.marca} • {equipo.modelo}</p>
          
          {/* Area de trabajo */}
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
            <Maximize2 className="w-4 h-4 text-gray-400" />
            <span>{equipo.areaTrabajo}</span>
          </div>

          {/* Certificación */}
          <div className="mt-4 flex items-center justify-between">
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${coloresCertificacion[equipo.certificacionRequerida]}`}>
              {equipo.certificacionRequerida === "Básico" ? "Sin requisito" : `Requiere ${equipo.certificacionRequerida}`}
            </span>
          </div>

          {/* Materiales Preview */}
          <div className="flex flex-wrap gap-1 mt-3">
            {equipo.materialesCompatibles.slice(0, 3).map((mat) => (
              <span key={mat} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-md">
                {mat}
              </span>
            ))}
            {equipo.materialesCompatibles.length > 3 && (
              <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-600 rounded-md">
                +{equipo.materialesCompatibles.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// Equipment Detail Modal
interface EquipmentDetailModalProps {
  equipo: Equipo;
  isOpen: boolean;
  onClose: () => void;
}

function EquipmentDetailModal({ equipo, isOpen, onClose }: EquipmentDetailModalProps) {
  const Icon = iconosPorCategoria[equipo.categoria];

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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
            className="fixed inset-4 md:inset-8 lg:inset-16 xl:inset-24 bg-white rounded-3xl z-50 overflow-hidden shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="h-full overflow-y-auto">
              <div className="grid lg:grid-cols-2 min-h-full">
                {/* Left: Image */}
                <div className="relative h-[40vh] lg:h-full bg-gray-900">
                  <Image
                    src={equipo.imagen}
                    alt={equipo.nombre}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Category Badge on Image */}
                  <div className="absolute bottom-6 left-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r ${coloresPorCategoria[equipo.categoria]} text-white`}>
                      <Icon className="w-5 h-5" />
                      {equipo.categoria}
                    </span>
                  </div>
                </div>

                {/* Right: Details */}
                <div className="p-6 lg:p-10 overflow-y-auto">
                  {/* Status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full ${
                      equipo.estado === "Disponible" 
                        ? "bg-green-100 text-green-700" 
                        : equipo.estado === "En uso" 
                          ? "bg-yellow-100 text-yellow-700" 
                          : "bg-red-100 text-red-700"
                    }`}>
                      {equipo.estado === "Disponible" && <CheckCircle className="w-4 h-4" />}
                      {equipo.estado === "En uso" && <Info className="w-4 h-4" />}
                      {equipo.estado === "Mantenimiento" && <AlertTriangle className="w-4 h-4" />}
                      {equipo.estado}
                    </span>
                    <span className={`inline-block px-3 py-1.5 text-sm font-medium rounded-full ${coloresCertificacion[equipo.certificacionRequerida]}`}>
                      {equipo.certificacionRequerida === "Básico" ? "Acceso libre" : `Requiere ${equipo.certificacionRequerida}`}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {equipo.nombre}
                  </h2>
                  <p className="text-lg text-gray-500 mb-6">{equipo.marca} • {equipo.modelo}</p>

                  {/* Description */}
                  <p className="text-gray-700 mb-8 leading-relaxed">{equipo.descripcion}</p>

                  {/* Specifications Grid */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                        <Box className="w-4 h-4" />
                        Área de Trabajo
                      </div>
                      <p className="text-gray-900 font-semibold">{equipo.areaTrabajo}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                        <Zap className="w-4 h-4" />
                        Certificación
                      </div>
                      <p className="text-gray-900 font-semibold">{equipo.certificacionRequerida}</p>
                    </div>
                  </div>

                  {/* Materials */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-orange-500" />
                      Materiales Compatibles
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {equipo.materialesCompatibles.map((mat) => (
                        <span
                          key={mat}
                          className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-medium"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  {equipo.caracteristicas && equipo.caracteristicas.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Características
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {equipo.caracteristicas.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-gray-700">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            {feat}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="border-t border-gray-100 pt-6">
                    <p className="text-sm text-gray-500 mb-4">
                      ¿Necesitas usar este equipo? Reserva tu espacio o solicita capacitación.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700">
                        Reservar Equipo
                      </Button>
                      <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                        Solicitar Capacitación
                      </Button>
                    </div>
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

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export function TecnologiasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaEquipo | "Todos">("Todos");
  const [selectedEquipo, setSelectedEquipo] = useState<Equipo | null>(null);

  // Filter equipment
  const equiposFiltrados = useMemo(() => {
    return equiposMock.filter((equipo) => {
      const matchesSearch =
        searchQuery === "" ||
        equipo.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        equipo.marca.toLowerCase().includes(searchQuery.toLowerCase()) ||
        equipo.modelo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        equipo.materialesCompatibles.some((mat) =>
          mat.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategoria =
        categoriaActiva === "Todos" || equipo.categoria === categoriaActiva;

      return matchesSearch && matchesCategoria;
    });
  }, [searchQuery, categoriaActiva]);

  // Count by category
  const conteosPorCategoria = useMemo(() => {
    const conteos: Record<string, number> = { Todos: equiposMock.length };
    categoriasEquipo.forEach((cat) => {
      conteos[cat] = equiposMock.filter((e) => e.categoria === cat).length;
    });
    return conteos;
  }, []);

  // Group by category for display
  const equiposPorCategoria = useMemo(() => {
    if (categoriaActiva !== "Todos") {
      return { [categoriaActiva]: equiposFiltrados };
    }
    
    const grouped: Record<string, Equipo[]> = {};
    categoriasEquipo.forEach((cat) => {
      const equipos = equiposFiltrados.filter((e) => e.categoria === cat);
      if (equipos.length > 0) {
        grouped[cat] = equipos;
      }
    });
    return grouped;
  }, [equiposFiltrados, categoriaActiva]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <HeroSection />

      {/* Category Tabs */}
      <CategoryTabs
        categoriaActiva={categoriaActiva}
        setCategoriaActiva={setCategoriaActiva}
        conteosPorCategoria={conteosPorCategoria}
      />

      {/* Search */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Equipment Grid by Category */}
      <section className="container mx-auto px-6 pb-16">
        {Object.entries(equiposPorCategoria).length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No se encontraron equipos
            </h3>
            <p className="text-gray-500">
              Intenta con otros términos de búsqueda o cambia la categoría
            </p>
          </div>
        ) : (
          Object.entries(equiposPorCategoria).map(([categoria, equipos]) => {
            const Icon = iconosPorCategoria[categoria as CategoriaEquipo];
            return (
              <div key={categoria} className="mb-12">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${coloresPorCategoria[categoria as CategoriaEquipo]}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{categoria}</h2>
                    <p className="text-sm text-gray-500">{equipos.length} equipos disponibles</p>
                  </div>
                </div>

                {/* Equipment Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {equipos.map((equipo, index) => (
                    <EquipmentCard
                      key={equipo.id}
                      equipo={equipo}
                      index={index}
                      onOpenDetail={setSelectedEquipo}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Certification Info */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Niveles de Certificación</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Para garantizar la seguridad y el correcto uso de los equipos, 
              contamos con un sistema de certificación por niveles.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { nivel: "Básico", desc: "Acceso libre sin capacitación previa", color: "bg-gray-600" },
              { nivel: "Nivel 1", desc: "Inducción básica de 1 hora", color: "bg-green-600" },
              { nivel: "Nivel 2", desc: "Taller de 4 horas + práctica", color: "bg-yellow-600" },
              { nivel: "Nivel 3", desc: "Curso completo de 8+ horas", color: "bg-orange-600" },
              { nivel: "Especializado", desc: "Certificación externa requerida", color: "bg-red-600" },
            ].map((cert, idx) => (
              <motion.div
                key={cert.nivel}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-800 rounded-xl p-5 text-center"
              >
                <div className={`w-12 h-12 ${cert.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white font-bold">{idx}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{cert.nivel}</h3>
                <p className="text-gray-400 text-sm">{cert.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Detail Modal */}
      {selectedEquipo && (
        <EquipmentDetailModal
          equipo={selectedEquipo}
          isOpen={!!selectedEquipo}
          onClose={() => setSelectedEquipo(null)}
        />
      )}
    </div>
  );
}
