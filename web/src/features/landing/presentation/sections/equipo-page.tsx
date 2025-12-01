"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Linkedin,
  Github,
  Mail,
  Twitter,
  Award,
  Users,
  Heart,
  Lightbulb,
  Target,
  Handshake,
  Sparkles,
  GraduationCap,
  Rocket,
  MessageCircle,
  ChevronRight,
  Quote,
  Calendar,
  MapPin,
} from "lucide-react";
import { Button } from "@/shared/ui/buttons/button";

// ============================================================================
// TYPES
// ============================================================================

interface TeamMember {
  id: string;
  nombre: string;
  cargo: string;
  especialidad: string;
  imagen: string;
  bio: string;
  experiencia: string;
  logros: string[];
  social: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    email: string;
  };
  esDirectivo: boolean;
}

interface MiembroDestacado {
  id: string;
  nombre: string;
  imagen: string;
  especialidad: string;
  proyectoDestacado: string;
  testimonio: string;
  miembroDesde: string;
}

interface ValorLab {
  icono: React.ElementType;
  titulo: string;
  descripcion: string;
  color: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const equipoCentral: TeamMember[] = [
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

const miembrosDestacados: MiembroDestacado[] = [
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

const valoresLab: ValorLab[] = [
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

const beneficiosMembresia = [
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

// ============================================================================
// COMPONENTS
// ============================================================================

// Hero Section
function HeroEquipo() {
  return (
    <section className="relative min-h-[60vh] bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 text-sm font-medium mb-6"
          >
            <Users className="w-4 h-4" />
            Conoce a nuestro equipo
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6">
            Las personas detrás de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              FabLab
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Un equipo multidisciplinario de apasionados por la tecnología, 
            la innovación y la educación. Juntos, hacemos posible que las ideas se conviertan en realidad.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-500" />
              <span>8 Expertos</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              <span>500+ Miembros</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span>1000+ Proyectos</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Team Member Card
interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
  onSelect: (member: TeamMember) => void;
}

function TeamMemberCard({ member, index, onSelect }: TeamMemberCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => onSelect(member)}
      className="group cursor-pointer"
    >
      <div className="relative bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
        {/* Directivo Badge */}
        {member.esDirectivo && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold rounded-full">
              <Award className="w-3 h-3" />
              Directivo
            </span>
          </div>
        )}

        {/* Avatar */}
        <div className="relative mb-6">
          <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden ring-4 ring-gray-100 group-hover:ring-orange-200 transition-all duration-500 relative">
            <Image
              src={member.imagen}
              alt={member.nombre}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Info */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
            {member.nombre}
          </h3>
          <p className="text-orange-600 font-medium text-sm mt-1">{member.cargo}</p>
          <p className="text-gray-500 text-xs mt-1 mb-3">{member.especialidad}</p>
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">{member.bio}</p>

          {/* Experience Badge */}
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mb-4">
            <Calendar className="w-3 h-3" />
            {member.experiencia} de experiencia
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-2">
            {member.social.linkedin && (
              <a
                href={member.social.linkedin}
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-600 hover:text-white transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {member.social.github && (
              <a
                href={member.social.github}
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {member.social.twitter && (
              <a
                href={member.social.twitter}
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-sky-500 hover:text-white transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            <a
              href={`mailto:${member.social.email}`}
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-orange-500 hover:text-white transition-all"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* View More Indicator */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="w-5 h-5 text-orange-500" />
        </div>
      </div>
    </motion.article>
  );
}

// Team Member Modal
interface TeamMemberModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
}

function TeamMemberModal({ member, isOpen, onClose }: TeamMemberModalProps) {
  if (!member) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 bg-white rounded-3xl z-50 overflow-hidden shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <span className="text-2xl leading-none">&times;</span>
            </button>

            <div className="h-full overflow-y-auto">
              <div className="grid md:grid-cols-2 min-h-full">
                {/* Left: Image and basic info */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 md:p-12 flex flex-col justify-center items-center text-white">
                  <div className="w-48 h-48 rounded-3xl overflow-hidden ring-4 ring-white/30 mb-6 relative">
                    <Image
                      src={member.imagen}
                      alt={member.nombre}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{member.nombre}</h2>
                  <p className="text-orange-100 font-medium mb-1">{member.cargo}</p>
                  <p className="text-orange-200 text-sm mb-6">{member.especialidad}</p>
                  
                  <div className="flex gap-3">
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {member.social.github && (
                      <a href={member.social.github} className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a href={member.social.twitter} className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    <a href={`mailto:${member.social.email}`} className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Right: Details */}
                <div className="p-8 md:p-12">
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Biografía</h3>
                    <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Logros Destacados</h3>
                    <ul className="space-y-3">
                      {member.logros.map((logro, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Award className="w-3 h-3 text-orange-600" />
                          </div>
                          <span className="text-gray-700">{logro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Experiencia</p>
                      <p className="text-xl font-bold text-gray-900">{member.experiencia}</p>
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

// Miembro Destacado Card
function MiembroDestacadoCard({ miembro, index }: { miembro: MiembroDestacado; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
    >
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
    </motion.div>
  );
}

// Valores Section
function ValoresSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full text-sm font-semibold mb-4">
            Nuestra Filosofía
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Valores que nos{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              definen
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Estos principios guían cada decisión que tomamos y cada proyecto que apoyamos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {valoresLab.map((valor, index) => {
            const IconComponent = valor.icono;
            return (
              <motion.div
                key={valor.titulo}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-orange-500/50 transition-colors group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${valor.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{valor.titulo}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{valor.descripcion}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Membresía Section
function MembresiaSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-orange-100/50">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-orange-500/20 text-orange-600 rounded-full text-sm font-semibold mb-4">
              Únete a Nosotros
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sé parte de la{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                comunidad maker
              </span>
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              La membresía de FabLab te da acceso a equipos de última generación, 
              capacitaciones, mentoría de expertos y una comunidad vibrante de innovadores.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {beneficiosMembresia.map((beneficio, index) => (
                <motion.div
                  key={beneficio.titulo}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm"
                >
                  <span className="text-2xl">{beneficio.icono}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{beneficio.titulo}</h4>
                    <p className="text-sm text-gray-500">{beneficio.descripcion}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/contacto">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 text-lg rounded-full">
                  Solicitar Membresía
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/tecnologias">
                <Button variant="outline" className="px-8 py-6 text-lg rounded-full border-2">
                  Ver Equipamiento
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right: Image Collage */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop"
                    alt="FabLab workspace"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop"
                    alt="3D printing"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-64 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop"
                    alt="Electronics lab"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=400&fit=crop"
                    alt="Laser cutting"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Stats Overlay */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl p-6 flex gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">500+</p>
                <p className="text-sm text-gray-500">Miembros</p>
              </div>
              <div className="text-center border-l border-gray-200 pl-8">
                <p className="text-3xl font-bold text-orange-600">50+</p>
                <p className="text-sm text-gray-500">Cursos</p>
              </div>
              <div className="text-center border-l border-gray-200 pl-8">
                <p className="text-3xl font-bold text-orange-600">24/7</p>
                <p className="text-sm text-gray-500">Acceso</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export function EquipoPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const directivos = equipoCentral.filter((m) => m.esDirectivo);
  const staff = equipoCentral.filter((m) => !m.esDirectivo);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <HeroEquipo />

      {/* Directivos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4">
              Liderazgo
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Equipo Directivo
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Los líderes que guían la visión y estrategia de FabLab INACAP.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {directivos.map((member, index) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                index={index}
                onSelect={setSelectedMember}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Staff */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              Expertos
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nuestros Especialistas
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Profesionales apasionados que hacen posible cada proyecto.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staff.map((member, index) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                index={index}
                onSelect={setSelectedMember}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <ValoresSection />

      {/* Miembros Destacados */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-4">
              Comunidad
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Miembros Destacados
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Historias de éxito de nuestra comunidad de makers e innovadores.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {miembrosDestacados.map((miembro, index) => (
              <MiembroDestacadoCard key={miembro.id} miembro={miembro} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Membresía CTA */}
      <MembresiaSection />

      {/* Modal */}
      <TeamMemberModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}
