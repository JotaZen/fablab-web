/**
 * Data - Equipo Page
 */

import {
  Handshake,
  Lightbulb,
  Heart,
  GraduationCap,
  Target,
  Rocket,
} from "lucide-react";
import type { TeamMember, MiembroDestacado, ValorLab, BeneficioMembresia } from "./types";

export const equipoCentral: TeamMember[] = [
  {
    id: "1",
    nombre: "Dr. Carlos Mendoza",
    cargo: "Director General",
    especialidad: "Fabricación Digital & Gestión de Innovación",
    imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    bio: "Ingeniero Civil Industrial con Doctorado en Gestión de la Innovación. Fundador de FabLab INACAP con más de 15 años de experiencia liderando proyectos de transformación digital en la educación técnica.",
    experiencia: "15+ años",
    logros: [
      "Fundador de FabLab INACAP",
      "PhD en Gestión de Innovación - MIT",
      "Autor de 12 publicaciones científicas",
      "Mentor de más de 200 proyectos estudiantiles",
    ],
    social: {
      linkedin: "https://linkedin.com/in/carlosmendoza",
      github: "https://github.com/cmendoza",
      twitter: "https://twitter.com/cmendoza",
      email: "carlos.mendoza@fablab.cl",
    },
    esDirectivo: true,
  },
  {
    id: "2",
    nombre: "Ing. María González",
    cargo: "Directora de Innovación",
    especialidad: "Design Thinking & Metodologías Ágiles",
    imagen: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    bio: "Ingeniera en Diseño de Productos con especialización en innovación centrada en el usuario. Lidera los programas de capacitación y certificación del laboratorio.",
    experiencia: "12 años",
    logros: [
      "Certificación Design Thinking - Stanford d.school",
      "Facilitadora de más de 100 workshops",
      "Creadora del programa FabLab Academy",
      "Speaker TEDx 2023",
    ],
    social: {
      linkedin: "https://linkedin.com/in/mariagonzalez",
      email: "maria.gonzalez@fablab.cl",
    },
    esDirectivo: true,
  },
  {
    id: "3",
    nombre: "Diego Fuentes",
    cargo: "Jefe de Laboratorio Hardware",
    especialidad: "Electrónica & IoT",
    imagen: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    bio: "Ingeniero Electrónico especializado en sistemas embebidos y IoT. Responsable de todo el equipamiento de electrónica y prototipado rápido del laboratorio.",
    experiencia: "8 años",
    logros: [
      "Certificado Arduino Certified Instructor",
      "Desarrollador de 3 productos comercializados",
      "Instructor de más de 500 estudiantes",
      "Ganador Maker Faire Chile 2022",
    ],
    social: {
      linkedin: "https://linkedin.com/in/diegofuentes",
      github: "https://github.com/dfuentes",
      email: "diego.fuentes@fablab.cl",
    },
    esDirectivo: false,
  },
  {
    id: "4",
    nombre: "Valentina Ríos",
    cargo: "Desarrolladora Full Stack Senior",
    especialidad: "Desarrollo Web & Aplicaciones",
    imagen: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    bio: "Desarrolladora con pasión por crear soluciones tecnológicas que mejoren la experiencia de los usuarios del FabLab. Lidera el desarrollo de plataformas digitales.",
    experiencia: "6 años",
    logros: [
      "Creadora de la plataforma FabLab Online",
      "Contribuidora Open Source activa",
      "Mentora en programas de mujeres en tech",
      "AWS Certified Developer",
    ],
    social: {
      linkedin: "https://linkedin.com/in/valentinarios",
      github: "https://github.com/vrios",
      twitter: "https://twitter.com/vrios_dev",
      email: "valentina.rios@fablab.cl",
    },
    esDirectivo: false,
  },
  {
    id: "5",
    nombre: "Andrés Silva",
    cargo: "Especialista en Robótica",
    especialidad: "Robótica & Automatización",
    imagen: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    bio: "Ingeniero Mecatrónico con maestría en robótica. Experto en sistemas de automatización industrial y brazos robóticos educativos.",
    experiencia: "10 años",
    logros: [
      "Diseñador del brazo robótico FabArm v3",
      "Instructor certificado ROS",
      "Consultor para industria 4.0",
      "Publicaciones en IEEE Robotics",
    ],
    social: {
      linkedin: "https://linkedin.com/in/andressilva",
      github: "https://github.com/asilva",
      email: "andres.silva@fablab.cl",
    },
    esDirectivo: false,
  },
  {
    id: "6",
    nombre: "Camila Torres",
    cargo: "Diseñadora UX/UI Lead",
    especialidad: "Diseño de Experiencia & Interfaces",
    imagen: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    bio: "Diseñadora con enfoque en accesibilidad e inclusión. Responsable de toda la experiencia visual y de usuario de los productos FabLab.",
    experiencia: "7 años",
    logros: [
      "Rediseño completo de marca FabLab",
      "Premio Nacional de Diseño 2023",
      "Creadora del Design System FabUI",
      "Mentora en Laboratoria",
    ],
    social: {
      linkedin: "https://linkedin.com/in/camilatorres",
      email: "camila.torres@fablab.cl",
    },
    esDirectivo: false,
  },
  {
    id: "7",
    nombre: "Roberto Díaz",
    cargo: "Técnico en Fabricación Aditiva",
    especialidad: "Impresión 3D & Materiales",
    imagen: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    bio: "Técnico especializado en tecnologías de impresión 3D FDM, SLA y SLS. Experto en optimización de parámetros y materiales avanzados.",
    experiencia: "5 años",
    logros: [
      "Operador certificado Formlabs & Ultimaker",
      "Desarrollo de materiales compuestos",
      "Más de 10,000 horas de impresión 3D",
      "Instructor de certificación Nivel 1 y 2",
    ],
    social: {
      linkedin: "https://linkedin.com/in/robertodiaz",
      email: "roberto.diaz@fablab.cl",
    },
    esDirectivo: false,
  },
  {
    id: "8",
    nombre: "Isabella Fernández",
    cargo: "Especialista en Corte Láser & CNC",
    especialidad: "Fabricación Sustractiva",
    imagen: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    bio: "Diseñadora Industrial con dominio de tecnologías de corte láser, CNC y manufactura digital. Experta en optimización de procesos de fabricación.",
    experiencia: "6 años",
    logros: [
      "Certificación Trotec & Epilog",
      "Desarrollo de protocolos de seguridad",
      "Creadora de biblioteca de materiales",
      "Instructora de más de 300 usuarios",
    ],
    social: {
      linkedin: "https://linkedin.com/in/isabellafernandez",
      github: "https://github.com/ifernandez",
      email: "isabella.fernandez@fablab.cl",
    },
    esDirectivo: false,
  },
];

export const miembrosDestacados: MiembroDestacado[] = [
  {
    id: "1",
    nombre: "Sebastián Herrera",
    imagen: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    especialidad: "Estudiante de Ing. Mecánica",
    proyectoDestacado: "Prótesis de mano impresa en 3D de bajo costo",
    testimonio: "FabLab me dio las herramientas y el conocimiento para convertir mi proyecto de tesis en un producto real que ayuda a personas. El equipo siempre estuvo disponible para guiarme.",
    miembroDesde: "2022",
  },
  {
    id: "2",
    nombre: "Fernanda Muñoz",
    imagen: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&crop=face",
    especialidad: "Emprendedora Tech",
    proyectoDestacado: "Startup de sensores IoT para agricultura",
    testimonio: "Gracias a FabLab pude prototipar mi producto sin invertir millones en equipos. El ambiente colaborativo y el acceso a mentores fue clave para lanzar mi empresa.",
    miembroDesde: "2021",
  },
  {
    id: "3",
    nombre: "Matías Contreras",
    imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    especialidad: "Diseñador Industrial",
    proyectoDestacado: "Mobiliario sustentable con materiales reciclados",
    testimonio: "El acceso a cortadoras láser y CNC me permitió experimentar con diseños que antes solo existían en mi computadora. FabLab es mi segundo hogar.",
    miembroDesde: "2020",
  },
  {
    id: "4",
    nombre: "Catalina Vergara",
    imagen: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    especialidad: "Profesora de Tecnología",
    proyectoDestacado: "Kits educativos STEAM para colegios",
    testimonio: "Como profesora, encontré en FabLab el espacio perfecto para desarrollar material didáctico innovador. Mis estudiantes ahora pueden aprender haciendo.",
    miembroDesde: "2021",
  },
];

export const valoresLab: ValorLab[] = [
  {
    icono: Handshake,
    titulo: "Colaboración Abierta",
    descripcion: "Creemos en el poder del trabajo en equipo y el conocimiento compartido. Cada proyecto es una oportunidad para aprender juntos.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icono: Lightbulb,
    titulo: "Innovación Constante",
    descripcion: "Fomentamos la experimentación y el pensamiento creativo. No hay ideas pequeñas, solo oportunidades de crear algo nuevo.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icono: Heart,
    titulo: "Inclusión y Diversidad",
    descripcion: "Nuestras puertas están abiertas para todos. La diversidad de perspectivas enriquece cada proyecto y solución.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icono: GraduationCap,
    titulo: "Aprendizaje Continuo",
    descripcion: "Cada día es una oportunidad para aprender algo nuevo. Compartimos conocimiento y crecemos juntos como comunidad.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icono: Target,
    titulo: "Impacto Social",
    descripcion: "Buscamos que nuestros proyectos generen un impacto positivo en la sociedad y contribuyan al desarrollo de la comunidad.",
    color: "from-purple-500 to-violet-500",
  },
  {
    icono: Rocket,
    titulo: "Mentalidad Maker",
    descripcion: "Si puedes imaginarlo, puedes construirlo. Transformamos ideas en prototipos y prototipos en soluciones reales.",
    color: "from-orange-500 to-red-500",
  },
];

export const beneficiosMembresia: BeneficioMembresia[] = [
  {
    titulo: "Acceso a Equipos",
    descripcion: "Uso de todas las máquinas y herramientas del laboratorio con reserva previa.",
    icono: "🛠️",
  },
  {
    titulo: "Capacitaciones Gratuitas",
    descripcion: "Workshops y cursos de certificación sin costo adicional para miembros.",
    icono: "📚",
  },
  {
    titulo: "Mentoría de Expertos",
    descripcion: "Asesoría personalizada para tus proyectos por parte de nuestro equipo.",
    icono: "🎯",
  },
  {
    titulo: "Comunidad Activa",
    descripcion: "Networking con otros makers, emprendedores y profesionales.",
    icono: "🤝",
  },
  {
    titulo: "Descuentos en Materiales",
    descripcion: "Precios especiales en filamentos, acrílicos, componentes y más.",
    icono: "💰",
  },
  {
    titulo: "Eventos Exclusivos",
    descripcion: "Acceso prioritario a hackathons, charlas y eventos especiales.",
    icono: "🎉",
  },
];
