/**
 * Mock Data - Proyectos Feature
 * TODO: Migrate to CMS
 */

import type { Proyecto } from "./types";

export const proyectosMock: Proyecto[] = [
    {
        id: "1",
        titulo: "Sistema de Riego Inteligente",
        categoria: "IoT",
        imagenes: [
            "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        ],
        descripcion: "Sistema automatizado de riego con sensores de humedad y control remoto vía app móvil.",
        tecnologias: ["Arduino Nano", "ESP32", "React Native", "Node.js", "MQTT"],
        fecha: "2024",
        creadores: [
            { nombre: "María González", rol: "Líder de Proyecto", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
            { nombre: "Carlos Mendoza", rol: "Desarrollador IoT", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
        ],
        objetivo: "Crear un sistema de riego automatizado que optimice el uso del agua.",
        problemaResuelto: "El desperdicio de agua en sistemas de riego tradicionales.",
        procesoFabricacion: [
            "Diseño del circuito electrónico",
            "Prototipado con Arduino y sensores",
            "Desarrollo de app móvil",
        ],
        githubUrl: "https://github.com/fablab/riego-inteligente",
    },
    {
        id: "2",
        titulo: "Brazo Robótico Industrial",
        categoria: "Hardware",
        imagenes: [
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop",
        ],
        descripcion: "Brazo robótico de 6 ejes para automatización de procesos industriales y educación.",
        tecnologias: ["ROS", "Python", "Impresión 3D FDM", "Servomotores", "Raspberry Pi"],
        fecha: "2024",
        creadores: [
            { nombre: "Diego Fuentes", rol: "Ingeniero Mecánico", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
        ],
        objetivo: "Desarrollar un brazo robótico de bajo costo con capacidades industriales.",
        problemaResuelto: "Alto costo de brazos robóticos educativos.",
        procesoFabricacion: [
            "Modelado 3D en Fusion 360",
            "Impresión 3D de piezas",
            "Configuración de ROS",
        ],
        githubUrl: "https://github.com/fablab/brazo-robotico",
    },
    {
        id: "3",
        titulo: "App de Gestión FabLab",
        categoria: "Software",
        imagenes: [
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
        ],
        descripcion: "Aplicación web para gestión de inventario, reserva de equipos y seguimiento de proyectos.",
        tecnologias: ["Next.js 14", "TypeScript", "PostgreSQL", "TailwindCSS"],
        fecha: "2024",
        creadores: [
            { nombre: "Valentina Ríos", rol: "Full Stack Developer", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
        ],
        objetivo: "Digitalizar y optimizar la gestión operativa del FabLab.",
        problemaResuelto: "Gestión manual de reservas e inventario desactualizado.",
        procesoFabricacion: [
            "Diseño UX en Figma",
            "Desarrollo de API REST",
            "Deploy en Vercel",
        ],
        githubUrl: "https://github.com/fablab/gestion-app",
    },
    {
        id: "4",
        titulo: "Carcasa Modular para Raspberry",
        categoria: "Diseño",
        imagenes: [
            "https://images.unsplash.com/photo-1631515242808-497c3fbd3972?w=800&h=600&fit=crop",
        ],
        descripcion: "Diseño paramétrico de carcasa modular impresa en 3D con sistema de ventilación activa.",
        tecnologias: ["Fusion 360", "PLA+", "Impresión 3D FDM", "Corte Láser"],
        fecha: "2024",
        creadores: [
            { nombre: "Pablo Martínez", rol: "Diseñador Industrial", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
        ],
        objetivo: "Crear una carcasa modular y personalizable para Raspberry Pi.",
        problemaResuelto: "Carcasas genéricas que no permiten expansión.",
        procesoFabricacion: [
            "Modelado paramétrico",
            "Pruebas de tolerancias",
            "Documentación de archivos",
        ],
        thingiverseUrl: "https://thingiverse.com/thing:456789",
    },
];

export const heroImages = [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=1080&fit=crop",
];
