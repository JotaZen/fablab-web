"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Cookie,
  Shield,
  Settings,
  BarChart3,
  Target,
  Users,
  Clock,
  ToggleLeft,
  ToggleRight,
  Info,
  CheckCircle,
  XCircle,
  ChevronRight,
  Mail,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

// ============================================================================
// TYPES
// ============================================================================

interface TipoCookie {
  id: string;
  nombre: string;
  descripcion: string;
  icono: LucideIcon;
  obligatoria: boolean;
  ejemplos: string[];
  duracion: string;
}

interface SeccionCookies {
  id: string;
  icono: LucideIcon;
  titulo: string;
  contenido: React.ReactNode;
}

// ============================================================================
// DATA
// ============================================================================

const fechaActualizacion = "30 de noviembre de 2025";

const tiposCookies: TipoCookie[] = [
  {
    id: "esenciales",
    nombre: "Cookies Esenciales",
    descripcion:
      "Son necesarias para el funcionamiento básico del sitio web. Sin estas cookies, el sitio no puede funcionar correctamente.",
    icono: Shield,
    obligatoria: true,
    ejemplos: [
      "Mantener la sesión del usuario",
      "Recordar preferencias de idioma",
      "Gestionar la seguridad del sitio",
      "Habilitar funciones de accesibilidad",
    ],
    duracion: "Sesión o hasta 1 año",
  },
  {
    id: "funcionales",
    nombre: "Cookies Funcionales",
    descripcion:
      "Permiten recordar sus preferencias y personalizar su experiencia en el sitio web.",
    icono: Settings,
    obligatoria: false,
    ejemplos: [
      "Recordar configuraciones de visualización",
      "Guardar preferencias de reservas",
      "Personalizar contenido mostrado",
      "Recordar formularios parcialmente completados",
    ],
    duracion: "Hasta 1 año",
  },
  {
    id: "analiticas",
    nombre: "Cookies Analíticas",
    descripcion:
      "Nos ayudan a entender cómo los visitantes interactúan con el sitio web, permitiéndonos mejorar su funcionamiento.",
    icono: BarChart3,
    obligatoria: false,
    ejemplos: [
      "Contar visitas y fuentes de tráfico",
      "Medir el rendimiento de páginas",
      "Identificar páginas más populares",
      "Detectar errores de navegación",
    ],
    duracion: "Hasta 2 años",
  },
  {
    id: "marketing",
    nombre: "Cookies de Marketing",
    descripcion:
      "Se utilizan para rastrear visitantes en los sitios web con el fin de mostrar anuncios relevantes.",
    icono: Target,
    obligatoria: false,
    ejemplos: [
      "Mostrar anuncios personalizados",
      "Medir efectividad de campañas",
      "Limitar frecuencia de anuncios",
      "Recordar interacciones con publicidad",
    ],
    duracion: "Hasta 2 años",
  },
  {
    id: "terceros",
    nombre: "Cookies de Terceros",
    descripcion:
      "Son establecidas por servicios externos que utilizamos para mejorar la funcionalidad del sitio.",
    icono: Users,
    obligatoria: false,
    ejemplos: [
      "Google Analytics",
      "Mapas de Google",
      "Botones de redes sociales",
      "Videos de YouTube incrustados",
    ],
    duracion: "Variable según el proveedor",
  },
];

const seccionesCookies: SeccionCookies[] = [
  {
    id: "que-son",
    icono: Cookie,
    titulo: "¿Qué son las Cookies?",
    contenido: (
      <>
        <p className="mb-4">
          Las cookies son pequeños archivos de texto que se almacenan en su dispositivo 
          (computador, tablet o teléfono móvil) cuando visita un sitio web. Estas cookies 
          permiten que el sitio recuerde sus acciones y preferencias durante un período de tiempo.
        </p>
        <p className="mb-4">
          Las cookies son ampliamente utilizadas para hacer que los sitios web funcionen 
          de manera más eficiente, así como para proporcionar información a los propietarios del sitio.
        </p>
        <div className="bg-orange-50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <p className="text-gray-700 text-sm">
              <strong>Nota:</strong> Las cookies no pueden acceder a otra información 
              de su dispositivo, ejecutar programas ni transmitir virus.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "como-usamos",
    icono: Settings,
    titulo: "Cómo Usamos las Cookies",
    contenido: (
      <>
        <p className="mb-4">
          FabLab INACAP Los Ángeles utiliza cookies para diversos propósitos:
        </p>
        <ul className="space-y-3 mb-4">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">
              <strong>Mejorar la navegación:</strong> Recordar sus preferencias y 
              configuraciones para futuras visitas.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">
              <strong>Análisis de uso:</strong> Entender cómo los visitantes utilizan 
              nuestro sitio para mejorarlo continuamente.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">
              <strong>Funcionalidad del sistema de reservas:</strong> Gestionar sus 
              solicitudes de uso de equipos y espacios.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">
              <strong>Seguridad:</strong> Proteger su cuenta y prevenir accesos no autorizados.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "gestion",
    icono: ToggleRight,
    titulo: "Gestión de Cookies",
    contenido: (
      <>
        <p className="mb-4">
          Usted tiene control total sobre las cookies. Puede gestionar o eliminar 
          cookies según sus preferencias:
        </p>

        <h4 className="font-semibold text-gray-900 mb-3">Desde su navegador:</h4>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <h5 className="font-medium text-gray-900 mb-2">Google Chrome</h5>
            <p className="text-sm text-gray-600">
              Configuración → Privacidad y seguridad → Cookies
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <h5 className="font-medium text-gray-900 mb-2">Mozilla Firefox</h5>
            <p className="text-sm text-gray-600">
              Opciones → Privacidad y seguridad → Cookies
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <h5 className="font-medium text-gray-900 mb-2">Safari</h5>
            <p className="text-sm text-gray-600">
              Preferencias → Privacidad → Cookies
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <h5 className="font-medium text-gray-900 mb-2">Microsoft Edge</h5>
            <p className="text-sm text-gray-600">
              Configuración → Privacidad → Cookies
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-gray-700 text-sm">
              <strong>Importante:</strong> Deshabilitar cookies puede afectar la 
              funcionalidad del sitio. Algunas características como el sistema de 
              reservas o el inicio de sesión podrían no funcionar correctamente.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "duracion",
    icono: Clock,
    titulo: "Duración de las Cookies",
    contenido: (
      <>
        <p className="mb-4">
          Las cookies tienen diferentes períodos de duración según su propósito:
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
            <Clock className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900">Cookies de Sesión</h4>
              <p className="text-gray-600 text-sm">
                Se eliminan automáticamente cuando cierra su navegador. Se utilizan 
                para mantener su sesión activa mientras navega por el sitio.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
            <Clock className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900">Cookies Persistentes</h4>
              <p className="text-gray-600 text-sm">
                Permanecen en su dispositivo durante un período específico o hasta 
                que las elimine manualmente. Nos ayudan a recordar sus preferencias.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Tiempos de retención típicos:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Cookies de sesión: Hasta cerrar el navegador</li>
            <li>• Cookies de preferencias: 1 año</li>
            <li>• Cookies analíticas: Hasta 2 años</li>
            <li>• Cookies de autenticación: 30 días</li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: "terceros-detalle",
    icono: ExternalLink,
    titulo: "Servicios de Terceros",
    contenido: (
      <>
        <p className="mb-4">
          Nuestro sitio web puede utilizar servicios de terceros que establecen 
          sus propias cookies:
        </p>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Google Analytics</h4>
            <p className="text-gray-600 text-sm mb-2">
              Utilizamos Google Analytics para analizar el uso del sitio web.
            </p>
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 text-sm hover:underline inline-flex items-center gap-1"
            >
              Política de privacidad de Google
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Google Maps</h4>
            <p className="text-gray-600 text-sm mb-2">
              Usamos Google Maps para mostrar la ubicación del FabLab.
            </p>
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 text-sm hover:underline inline-flex items-center gap-1"
            >
              Política de privacidad de Google
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">YouTube</h4>
            <p className="text-gray-600 text-sm mb-2">
              Videos incrustados de YouTube pueden establecer cookies.
            </p>
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 text-sm hover:underline inline-flex items-center gap-1"
            >
              Política de privacidad de Google
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "derechos",
    icono: Shield,
    titulo: "Sus Derechos",
    contenido: (
      <>
        <p className="mb-4">
          De acuerdo con la legislación chilena y las mejores prácticas internacionales, 
          usted tiene los siguientes derechos respecto a las cookies:
        </p>

        <ul className="space-y-3 mb-6">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">
              <strong>Derecho a ser informado:</strong> Conocer qué cookies utilizamos y para qué.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">
              <strong>Derecho a aceptar o rechazar:</strong> Decidir qué cookies acepta 
              (excepto las esenciales).
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">
              <strong>Derecho a eliminar:</strong> Borrar las cookies almacenadas en 
              cualquier momento.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">
              <strong>Derecho a cambiar preferencias:</strong> Modificar su configuración 
              de cookies cuando lo desee.
            </span>
          </li>
        </ul>

        <p className="text-gray-600 text-sm">
          Para más información sobre sus derechos de privacidad, consulte nuestra{" "}
          <Link href="/privacidad" className="text-orange-600 hover:underline">
            Política de Privacidad
          </Link>.
        </p>
      </>
    ),
  },
  {
    id: "actualizaciones",
    icono: Info,
    titulo: "Actualizaciones de esta Política",
    contenido: (
      <>
        <p className="mb-4">
          Podemos actualizar esta Política de Cookies periódicamente para reflejar 
          cambios en nuestras prácticas o por otros motivos operativos, legales o 
          regulatorios.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Proceso de actualización:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• La fecha de &quot;Última actualización&quot; se modificará</li>
            <li>• Los cambios importantes serán notificados en el sitio</li>
            <li>• El uso continuado del sitio implica aceptación</li>
          </ul>
        </div>

        <p className="text-gray-600 text-sm">
          Le recomendamos revisar esta política periódicamente para mantenerse 
          informado sobre cómo utilizamos las cookies.
        </p>
      </>
    ),
  },
  {
    id: "contacto",
    icono: Mail,
    titulo: "Contacto",
    contenido: (
      <>
        <p className="mb-4">
          Si tiene preguntas sobre nuestra Política de Cookies, puede contactarnos:
        </p>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">FabLab INACAP Los Ángeles</h4>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-orange-600" />
              <a
                href="mailto:fablab.losangeles@inacap.cl"
                className="text-gray-700 hover:text-orange-600"
              >
                fablab.losangeles@inacap.cl
              </a>
            </div>
            <div className="flex items-start gap-3">
              <Cookie className="w-5 h-5 text-orange-600 mt-0.5" />
              <span className="text-gray-700">
                Av. Ricardo Vicuña 825<br />
                Los Ángeles, Región del Biobío<br />
                Chile
              </span>
            </div>
          </div>
        </div>

        <p className="mt-6 text-gray-600 text-sm">
          Para consultas generales, visite nuestra{" "}
          <Link href="/contacto" className="text-orange-600 hover:underline">
            página de contacto
          </Link>.
        </p>
      </>
    ),
  },
];

// ============================================================================
// COMPONENTS
// ============================================================================

function HeroCookies() {
  return (
    <section className="relative min-h-[40vh] bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Decorative elements */}
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
            <Cookie className="w-4 h-4" />
            Transparencia digital
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Política de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Cookies
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
            Información sobre cómo utilizamos cookies y tecnologías similares 
            en el sitio web de FabLab INACAP Los Ángeles.
          </p>

          <p className="text-sm text-gray-400">
            Última actualización: {fechaActualizacion}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function TipoCookieCard({ tipo }: { tipo: TipoCookie }) {
  const Icon = tipo.icono;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            tipo.obligatoria
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900">{tipo.nombre}</h3>
            {tipo.obligatoria ? (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Obligatoria
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                Opcional
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm">{tipo.descripcion}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Ejemplos de uso:</h4>
          <ul className="space-y-1">
            {tipo.ejemplos.map((ejemplo, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                <ChevronRight className="w-3 h-3 text-orange-500" />
                {ejemplo}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">Duración: {tipo.duracion}</span>
        </div>
      </div>
    </motion.div>
  );
}

function TableOfContents() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
    >
      <h3 className="font-bold text-gray-900 mb-4">Contenido</h3>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => scrollToSection("tipos-cookies")}
            className="text-sm text-gray-600 hover:text-orange-600 transition-colors text-left w-full flex items-center gap-2"
          >
            <Cookie className="w-4 h-4 flex-shrink-0" />
            <span>Tipos de Cookies</span>
          </button>
        </li>
        {seccionesCookies.map((seccion) => (
          <li key={seccion.id}>
            <button
              onClick={() => scrollToSection(seccion.id)}
              className="text-sm text-gray-600 hover:text-orange-600 transition-colors text-left w-full flex items-center gap-2"
            >
              <seccion.icono className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">{seccion.titulo}</span>
            </button>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}

function SeccionCookiesComponent({
  seccion,
  index,
}: {
  seccion: SeccionCookies;
  index: number;
}) {
  const Icon = seccion.icono;

  return (
    <motion.section
      id={seccion.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-sm p-6 md:p-8 scroll-mt-24"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{seccion.titulo}</h2>
      </div>
      <div className="text-gray-600 leading-relaxed">{seccion.contenido}</div>
    </motion.section>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <HeroCookies />

      {/* Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <TableOfContents />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tipos de Cookies */}
            <motion.section
              id="tipos-cookies"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-24"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Tipos de Cookies</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {tiposCookies.map((tipo) => (
                  <TipoCookieCard key={tipo.id} tipo={tipo} />
                ))}
              </div>
            </motion.section>

            {/* Otras secciones */}
            {seccionesCookies.map((seccion, index) => (
              <SeccionCookiesComponent key={seccion.id} seccion={seccion} index={index} />
            ))}

            {/* Acceptance Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-center text-white"
            >
              <Cookie className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Su Privacidad es Importante</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Nos comprometemos a proteger su privacidad y ser transparentes sobre 
                las tecnologías que utilizamos. Si tiene alguna pregunta, no dude en contactarnos.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  Contáctanos
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/privacidad"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full font-semibold hover:bg-white/20 transition-all"
                >
                  Política de Privacidad
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
