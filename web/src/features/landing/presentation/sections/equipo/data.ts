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

export const heroStats = [
  { icon: "award", text: "8 Expertos" },
  { icon: "users", text: "500+ Miembros" },
  { icon: "sparkles", text: "1000+ Proyectos" },
];

export const equipoCentral: TeamMember[] = [
  {
    id: "1",
    nombre: "Christian David Orellana Benner",
    cargo: "Estudiante",
    especialidad: "Ingeniería en Informática",
    imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    bio: "Estudiante de Ingeniería en Informática apasionado por el desarrollo de software y las tecnologías emergentes.",
    experiencia: "En formación",
    logros: [
      "Miembro activo de FabLab INACAP",
      "Participante en proyectos de innovación",
      "Desarrollo de soluciones tecnológicas",
    ],
    social: {
      email: "cesar.salcedo02@inacapmail.cl",
    },
    esDirectivo: true,
    category: 'leadership',
  },
  {
    id: "2",
    nombre: "Christian David Orellana Benner",
    cargo: "Estudiante",
    especialidad: "Ingeniería en Telecomunicaciones Conectividad y Redes",
    imagen: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    bio: "Estudiante especializado en telecomunicaciones, conectividad y arquitectura de redes.",
    experiencia: "En formación",
    logros: [
      "Experto en redes y conectividad",
      "Proyectos de infraestructura tecnológica",
      "Miembro del equipo FabLab",
    ],
    social: {
      email: "christian.orellana@inacapmail.cl",
    },
    esDirectivo: true,
    category: 'leadership',
  },
  {
    id: "3",
    nombre: "Juan Pablo Erices Fuentealba",
    cargo: "Estudiante",
    especialidad: "Ingeniería en Informática",
    imagen: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    bio: "Estudiante de Ingeniería en Informática con interés en desarrollo de aplicaciones y sistemas.",
    experiencia: "En formación",
    logros: [
      "Desarrollo de aplicaciones",
      "Participante en hackathons",
      "Colaborador en proyectos estudiantiles",
    ],
    social: {
      email: "juan.erices04@inacapmail.cl",
    },
    esDirectivo: false,
    category: 'specialist',
  },
  {
    id: "4",
    nombre: "María José Valenzuela Ulloa",
    cargo: "Estudiante",
    especialidad: "Diseño Digital y Web",
    imagen: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    bio: "Estudiante de Diseño Digital y Web, creando experiencias visuales atractivas y funcionales.",
    experiencia: "En formación",
    logros: [
      "Diseño de interfaces web",
      "Proyectos de identidad visual",
      "Creación de contenido digital",
    ],
    social: {
      email: "maria.valenzuela61@inacapmail.cl",
    },
    esDirectivo: false,
    category: 'specialist',
  },
  {
    id: "5",
    nombre: "Matías Benjamín Labra Martínez",
    cargo: "Estudiante",
    especialidad: "Ingeniería en Automatización y Robótica",
    imagen: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    bio: "Estudiante especializado en sistemas automatizados y robótica industrial.",
    experiencia: "En formación",
    logros: [
      "Proyectos de automatización",
      "Desarrollo de sistemas robóticos",
      "Innovación en tecnología industrial",
    ],
    social: {
      email: "matias.labra06@inacapmail.cl",
    },
    esDirectivo: false,
    category: 'specialist',
  },
  {
    id: "6",
    nombre: "Kristóbal Andrés Jesús Sánchez Lizama",
    cargo: "Estudiante",
    especialidad: "Analista Programador",
    imagen: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    bio: "Estudiante de Analista Programador enfocado en el desarrollo y análisis de sistemas.",
    experiencia: "En formación",
    logros: [
      "Análisis y diseño de sistemas",
      "Programación de soluciones",
      "Optimización de procesos",
    ],
    social: {
      email: "kristobal.sanchez@inacapmail.cl",
    },
    esDirectivo: false,
    category: 'specialist',
  },
  {
    id: "7",
    nombre: "Herno Cristóbal Vargas Ríos",
    cargo: "Estudiante",
    especialidad: "Ingeniería en Automatización y Robótica",
    imagen: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face",
    bio: "Estudiante con pasión por la automatización de procesos y sistemas robóticos.",
    experiencia: "En formación",
    logros: [
      "Automatización de procesos",
      "Proyectos robóticos educativos",
      "Innovación tecnológica",
    ],
    social: {
      email: "Herno.vargas@inacapmail.cl",
    },
    esDirectivo: false,
    category: 'specialist',
  },
  {
    id: "8",
    nombre: "Jordy Brahian Zenteno Salazar",
    cargo: "Estudiante",
    especialidad: "Ingeniería en Informática",
    imagen: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    bio: "Estudiante de Ingeniería en Informática con interés en desarrollo de software.",
    experiencia: "En formación",
    logros: [
      "Desarrollo de aplicaciones",
      "Programación web",
      "Soluciones tecnológicas",
    ],
    social: {
      email: "jordy.zenteno@inacapmail.cl",
    },
    esDirectivo: false,
    category: 'specialist',
  },
  {
    id: "9",
    nombre: "Dilan Sebastián Toledo Luengo",
    cargo: "Estudiante",
    especialidad: "Animación Digital y Videojuegos",
    imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    bio: "Estudiante creativo especializado en animación digital y desarrollo de videojuegos.",
    experiencia: "En formación",
    logros: [
      "Creación de animaciones 3D",
      "Desarrollo de videojuegos",
      "Diseño de personajes",
    ],
    social: {
      email: "dilan.toledo@inacapmail.cl",
    },
    esDirectivo: false,
    category: 'specialist',
  },
  {
    id: "10",
    nombre: "Héctor Egidio Patricio Sanhueza Valdivia",
    cargo: "Estudiante",
    especialidad: "Ingeniería en Automatización y Robótica",
    imagen: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    bio: "Estudiante dedicado a la automatización industrial y tecnologías robóticas.",
    experiencia: "En formación",
    logros: [
      "Sistemas de control automático",
      "Robótica industrial",
      "Proyectos de automatización",
    ],
    social: {
      email: "hector.sanhueza13@inacapmail.cl",
    },
    esDirectivo: false,
    category: 'specialist',
  },
  {
    id: "11",
    nombre: "Benjamín Eduardo Coronado Sanzana",
    cargo: "Estudiante",
    especialidad: "Ingeniería en Automatización y Robótica",
    imagen: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    bio: "Estudiante enfocado en sistemas automatizados y control de procesos robóticos.",
    experiencia: "En formación",
    logros: [
      "Control de procesos",
      "Sistemas robóticos",
      "Automatización inteligente",
    ],
    social: {
      email: "benjamin.coronado02@inacapmail.cl",
    },
    esDirectivo: false,
    category: 'specialist',
  },
  {
    id: "12",
    nombre: "Allan Rodrigo Henriquez Ponce",
    cargo: "Estudiante",
    especialidad: "Ingeniería en Automatización y Robótica",
    imagen: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face",
    bio: "Estudiante con interés en automatización de procesos y desarrollo de sistemas robóticos.",
    experiencia: "En formación",
    logros: [
      "Proyectos de automatización",
      "Desarrollo robótico",
      "Innovación en procesos",
    ],
    social: {
      email: "alan.henriquez02@inacapmail.cl",
    },
    esDirectivo: false,
    category: 'specialist',
  },
  {
    id: "13",
    nombre: "Javiera Paz",
    cargo: "Colaboradora",
    especialidad: "Fotografía y Documentación",
    imagen: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    bio: "",
    experiencia: "",
    logros: [],
    social: { email: "" },
    esDirectivo: false,
    category: 'collaborator'
  },
  {
    id: "14",
    nombre: "Miguel Ángel",
    cargo: "Colaborador",
    especialidad: "Soporte TI",
    imagen: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face",
    bio: "",
    experiencia: "",
    logros: [],
    social: { email: "" },
    esDirectivo: false,
    category: 'collaborator'
  },
  {
    id: "15",
    nombre: "Sofía Loren",
    cargo: "Colaboradora",
    especialidad: "Redes Sociales",
    imagen: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
    bio: "",
    experiencia: "",
    logros: [],
    social: { email: "" },
    esDirectivo: false,
    category: 'collaborator'
  },
  {
    id: "16",
    nombre: "Lucas P.",
    cargo: "Colaborador",
    especialidad: "Asistente de Taller",
    imagen: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
    bio: "",
    experiencia: "",
    logros: [],
    social: { email: "" },
    esDirectivo: false,
    category: 'collaborator'
  },
  {
    id: "17",
    nombre: "Ana R.",
    cargo: "Colaboradora",
    especialidad: "Logística",
    imagen: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    bio: "",
    experiencia: "",
    logros: [],
    social: { email: "" },
    esDirectivo: false,
    category: 'collaborator'
  }
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
