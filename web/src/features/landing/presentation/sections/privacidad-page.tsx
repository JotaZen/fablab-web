"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  Mail,
  FileText,
  AlertCircle,
  Clock,
  Globe,
  Server,
  Trash2,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

// ============================================================================
// TYPES
// ============================================================================

interface SeccionPrivacidad {
  id: string;
  icono: React.ElementType;
  titulo: string;
  contenido: React.ReactNode;
}

// ============================================================================
// DATA
// ============================================================================

const fechaActualizacion = "30 de noviembre de 2025";

const seccionesPrivacidad: SeccionPrivacidad[] = [
  {
    id: "introduccion",
    icono: Shield,
    titulo: "Introducción",
    contenido: (
      <>
        <p className="mb-4">
          FabLab INACAP Los Ángeles (en adelante, &quot;FabLab&quot;, &quot;nosotros&quot; o &quot;nuestro&quot;) 
          se compromete a proteger la privacidad y seguridad de los datos personales de nuestros usuarios, 
          visitantes y miembros de la comunidad.
        </p>
        <p className="mb-4">
          Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos 
          su información personal cuando utiliza nuestro sitio web, servicios y las instalaciones 
          del laboratorio de fabricación digital ubicado en INACAP Sede Los Ángeles.
        </p>
        <p>
          Al utilizar nuestros servicios, usted acepta las prácticas descritas en esta política. 
          Le recomendamos leer este documento detenidamente y contactarnos si tiene alguna pregunta.
        </p>
      </>
    ),
  },
  {
    id: "responsable",
    icono: UserCheck,
    titulo: "Responsable del Tratamiento",
    contenido: (
      <>
        <p className="mb-4">El responsable del tratamiento de sus datos personales es:</p>
        <div className="bg-gray-50 rounded-xl p-6 mb-4">
          <p className="font-semibold text-gray-900">FabLab INACAP Los Ángeles</p>
          <p className="text-gray-600">Av. Ricardo Vicuña 825</p>
          <p className="text-gray-600">Los Ángeles, Región del Biobío, Chile</p>
          <p className="text-gray-600 mt-2">
            <strong>Correo electrónico:</strong>{" "}
            <a href="mailto:fablab.losangeles@inacap.cl" className="text-orange-600 hover:underline">
              fablab.losangeles@inacap.cl
            </a>
          </p>
          <p className="text-gray-600">
            <strong>Teléfono:</strong>{" "}
            <a href="tel:+56432524800" className="text-orange-600 hover:underline">
              +56 43 252 4800
            </a>
          </p>
        </div>
        <p>
          FabLab opera bajo el alero de INACAP y cumple con la normativa vigente en materia 
          de protección de datos personales en Chile, incluyendo la Ley N° 19.628 sobre 
          Protección de la Vida Privada.
        </p>
      </>
    ),
  },
  {
    id: "datos-recopilados",
    icono: Database,
    titulo: "Datos que Recopilamos",
    contenido: (
      <>
        <p className="mb-4">Podemos recopilar los siguientes tipos de información personal:</p>
        
        <h4 className="font-semibold text-gray-900 mb-2">Datos de identificación:</h4>
        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
          <li>Nombre completo</li>
          <li>RUT o documento de identidad</li>
          <li>Correo electrónico</li>
          <li>Número de teléfono</li>
          <li>Dirección postal (opcional)</li>
        </ul>

        <h4 className="font-semibold text-gray-900 mb-2">Datos académicos o profesionales:</h4>
        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
          <li>Institución educativa o empresa</li>
          <li>Carrera o área de especialización</li>
          <li>Nivel de estudios</li>
          <li>Experiencia con tecnologías de fabricación</li>
        </ul>

        <h4 className="font-semibold text-gray-900 mb-2">Datos de uso del servicio:</h4>
        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
          <li>Historial de reservas de equipos</li>
          <li>Capacitaciones completadas</li>
          <li>Proyectos desarrollados en el laboratorio</li>
          <li>Preferencias de comunicación</li>
        </ul>

        <h4 className="font-semibold text-gray-900 mb-2">Datos técnicos:</h4>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Dirección IP</li>
          <li>Tipo de navegador y dispositivo</li>
          <li>Páginas visitadas y tiempo de permanencia</li>
          <li>Cookies y tecnologías similares</li>
        </ul>
      </>
    ),
  },
  {
    id: "finalidad",
    icono: Eye,
    titulo: "Finalidad del Tratamiento",
    contenido: (
      <>
        <p className="mb-4">Utilizamos sus datos personales para los siguientes fines:</p>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-orange-600 font-bold text-sm">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Prestación de servicios</h4>
              <p className="text-gray-600 text-sm">
                Gestionar su registro, reservas de equipos, acceso al laboratorio y participación en capacitaciones.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-orange-600 font-bold text-sm">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Comunicaciones</h4>
              <p className="text-gray-600 text-sm">
                Enviar información sobre eventos, talleres, novedades del FabLab y responder a sus consultas.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-orange-600 font-bold text-sm">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Seguridad</h4>
              <p className="text-gray-600 text-sm">
                Garantizar la seguridad de las instalaciones y el correcto uso de los equipos del laboratorio.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-orange-600 font-bold text-sm">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Mejora continua</h4>
              <p className="text-gray-600 text-sm">
                Analizar el uso de nuestros servicios para mejorar la experiencia de usuario y la oferta del FabLab.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-orange-600 font-bold text-sm">5</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Obligaciones legales</h4>
              <p className="text-gray-600 text-sm">
                Cumplir con requerimientos legales, regulatorios y de auditoría aplicables.
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "base-legal",
    icono: FileText,
    titulo: "Base Legal del Tratamiento",
    contenido: (
      <>
        <p className="mb-4">El tratamiento de sus datos personales se fundamenta en las siguientes bases legales:</p>
        
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900">Consentimiento:</strong>
              <span className="text-gray-600"> Cuando usted nos proporciona voluntariamente sus datos a través de formularios, registro o solicitudes.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900">Ejecución de un contrato:</strong>
              <span className="text-gray-600"> Cuando el tratamiento es necesario para prestarle los servicios solicitados.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900">Interés legítimo:</strong>
              <span className="text-gray-600"> Para mejorar nuestros servicios y garantizar la seguridad del laboratorio.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900">Obligación legal:</strong>
              <span className="text-gray-600"> Cuando estemos obligados por ley a tratar determinados datos.</span>
            </div>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "compartir-datos",
    icono: Globe,
    titulo: "Compartición de Datos",
    contenido: (
      <>
        <p className="mb-4">
          No vendemos, alquilamos ni comercializamos sus datos personales. Sin embargo, podemos compartir 
          su información en los siguientes casos:
        </p>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-1">INACAP</h4>
            <p className="text-gray-600 text-sm">
              Como parte de la institución, compartimos información con áreas relevantes de INACAP para 
              coordinación académica y administrativa.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-1">Proveedores de servicios</h4>
            <p className="text-gray-600 text-sm">
              Empresas que nos prestan servicios de hosting, correo electrónico, análisis web y 
              otras herramientas tecnológicas, bajo estrictos acuerdos de confidencialidad.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-1">Autoridades competentes</h4>
            <p className="text-gray-600 text-sm">
              Cuando sea requerido por ley, orden judicial o para proteger nuestros derechos legales.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-1">Proyectos colaborativos</h4>
            <p className="text-gray-600 text-sm">
              Con su consentimiento previo, en el contexto de proyectos de innovación con empresas 
              o instituciones asociadas.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "seguridad",
    icono: Lock,
    titulo: "Seguridad de los Datos",
    contenido: (
      <>
        <p className="mb-4">
          Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos personales 
          contra acceso no autorizado, pérdida, alteración o destrucción:
        </p>
        
        <ul className="space-y-2 mb-4">
          <li className="flex items-center gap-2 text-gray-600">
            <Lock className="w-4 h-4 text-green-500" />
            Encriptación SSL/TLS para todas las comunicaciones web
          </li>
          <li className="flex items-center gap-2 text-gray-600">
            <Server className="w-4 h-4 text-green-500" />
            Servidores seguros con acceso restringido
          </li>
          <li className="flex items-center gap-2 text-gray-600">
            <UserCheck className="w-4 h-4 text-green-500" />
            Control de acceso basado en roles para el personal
          </li>
          <li className="flex items-center gap-2 text-gray-600">
            <RefreshCw className="w-4 h-4 text-green-500" />
            Copias de seguridad periódicas
          </li>
          <li className="flex items-center gap-2 text-gray-600">
            <Eye className="w-4 h-4 text-green-500" />
            Monitoreo continuo de seguridad
          </li>
        </ul>

        <p className="text-gray-600 text-sm bg-yellow-50 p-4 rounded-xl">
          <AlertCircle className="w-4 h-4 inline mr-2 text-yellow-600" />
          Ningún sistema es 100% seguro. En caso de una brecha de seguridad que afecte sus datos, 
          le notificaremos de acuerdo con la legislación vigente.
        </p>
      </>
    ),
  },
  {
    id: "retencion",
    icono: Clock,
    titulo: "Retención de Datos",
    contenido: (
      <>
        <p className="mb-4">
          Conservamos sus datos personales solo durante el tiempo necesario para cumplir con los 
          fines para los que fueron recopilados:
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Tipo de dato</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Período de retención</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">Datos de registro de usuario</td>
                <td className="py-3 px-4">Mientras mantenga su cuenta activa + 2 años</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">Historial de reservas</td>
                <td className="py-3 px-4">5 años desde la última reserva</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">Certificaciones</td>
                <td className="py-3 px-4">Indefinido (registro académico)</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">Mensajes de contacto</td>
                <td className="py-3 px-4">2 años desde la comunicación</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Datos de navegación (cookies)</td>
                <td className="py-3 px-4">Máximo 13 meses</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: "derechos",
    icono: UserCheck,
    titulo: "Sus Derechos",
    contenido: (
      <>
        <p className="mb-4">
          De acuerdo con la legislación chilena de protección de datos, usted tiene los siguientes derechos:
        </p>
        
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-orange-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-1">Derecho de acceso</h4>
            <p className="text-gray-600 text-sm">
              Conocer qué datos personales tenemos sobre usted.
            </p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-1">Derecho de rectificación</h4>
            <p className="text-gray-600 text-sm">
              Corregir datos inexactos o incompletos.
            </p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-1">Derecho de cancelación</h4>
            <p className="text-gray-600 text-sm">
              Solicitar la eliminación de sus datos cuando ya no sean necesarios.
            </p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-1">Derecho de oposición</h4>
            <p className="text-gray-600 text-sm">
              Oponerse al tratamiento de sus datos para fines específicos.
            </p>
          </div>
        </div>

        <p className="mb-4">
          Para ejercer cualquiera de estos derechos, puede contactarnos a través de:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>
            Correo electrónico:{" "}
            <a href="mailto:fablab.losangeles@inacap.cl" className="text-orange-600 hover:underline">
              fablab.losangeles@inacap.cl
            </a>
          </li>
          <li>Presencialmente en nuestras instalaciones con documento de identidad</li>
        </ul>
        <p className="mt-4 text-sm text-gray-500">
          Responderemos a su solicitud dentro de los plazos establecidos por la ley (máximo 2 días hábiles).
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    icono: Database,
    titulo: "Política de Cookies",
    contenido: (
      <>
        <p className="mb-4">
          Nuestro sitio web utiliza cookies y tecnologías similares para mejorar su experiencia de navegación:
        </p>
        
        <h4 className="font-semibold text-gray-900 mb-2">Tipos de cookies que utilizamos:</h4>
        
        <div className="space-y-3 mb-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-gray-900">Cookies esenciales</h5>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Necesarias</span>
            </div>
            <p className="text-gray-600 text-sm">
              Permiten la navegación básica y el funcionamiento del sitio. No pueden desactivarse.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-gray-900">Cookies analíticas</h5>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Opcionales</span>
            </div>
            <p className="text-gray-600 text-sm">
              Nos ayudan a entender cómo los usuarios interactúan con el sitio (ej: Google Analytics).
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-gray-900">Cookies de preferencias</h5>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Opcionales</span>
            </div>
            <p className="text-gray-600 text-sm">
              Recuerdan sus preferencias como idioma o tema visual.
            </p>
          </div>
        </div>

        <p className="text-gray-600 text-sm">
          Puede gestionar sus preferencias de cookies a través de la configuración de su navegador. 
          Tenga en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad del sitio.
        </p>
      </>
    ),
  },
  {
    id: "menores",
    icono: AlertCircle,
    titulo: "Menores de Edad",
    contenido: (
      <>
        <p className="mb-4">
          Nuestros servicios están dirigidos principalmente a personas mayores de 18 años. 
          Los menores de edad pueden utilizar el FabLab y nuestro sitio web bajo las siguientes condiciones:
        </p>
        
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <strong>Menores de 14 años:</strong> Requieren autorización y supervisión de un padre, 
            madre o tutor legal para el uso del laboratorio y el tratamiento de sus datos.
          </li>
          <li>
            <strong>Entre 14 y 18 años:</strong> Pueden registrarse con consentimiento de sus 
            representantes legales, el cual puede ser revocado en cualquier momento.
          </li>
        </ul>

        <p className="mt-4 text-gray-600">
          Si cree que hemos recopilado datos de un menor sin el consentimiento apropiado, 
          por favor contáctenos inmediatamente.
        </p>
      </>
    ),
  },
  {
    id: "cambios",
    icono: RefreshCw,
    titulo: "Cambios en esta Política",
    contenido: (
      <>
        <p className="mb-4">
          Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en 
          nuestras prácticas, servicios o requisitos legales.
        </p>
        
        <p className="mb-4">
          Cuando realicemos cambios significativos:
        </p>
        
        <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
          <li>Publicaremos la nueva versión en esta página</li>
          <li>Actualizaremos la fecha de &quot;Última actualización&quot;</li>
          <li>En caso de cambios materiales, le notificaremos por correo electrónico</li>
        </ul>

        <p className="text-gray-600">
          Le recomendamos revisar esta página periódicamente para mantenerse informado sobre 
          cómo protegemos sus datos.
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
          Si tiene preguntas, comentarios o inquietudes sobre esta Política de Privacidad o el 
          tratamiento de sus datos personales, puede contactarnos:
        </p>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">FabLab INACAP Los Ángeles</h4>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-orange-600" />
              <a href="mailto:fablab.losangeles@inacap.cl" className="text-gray-700 hover:text-orange-600">
                fablab.losangeles@inacap.cl
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-orange-600" />
              <a href="mailto:losangeles@inacap.cl" className="text-gray-700 hover:text-orange-600">
                losangeles@inacap.cl
              </a>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-orange-600 mt-0.5" />
              <span className="text-gray-700">
                Av. Ricardo Vicuña 825<br />
                Los Ángeles, Región del Biobío<br />
                Chile
              </span>
            </div>
          </div>
        </div>

        <p className="mt-6 text-gray-600 text-sm">
          También puede presentar una reclamación ante la autoridad de protección de datos competente 
          si considera que sus derechos han sido vulnerados.
        </p>
      </>
    ),
  },
];

// ============================================================================
// COMPONENTS
// ============================================================================

function HeroPrivacidad() {
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
            <Shield className="w-4 h-4" />
            Tu privacidad es importante
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Política de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Privacidad
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
            Conoce cómo recopilamos, usamos y protegemos tu información personal 
            en FabLab INACAP Los Ángeles.
          </p>

          <p className="text-sm text-gray-400">
            Última actualización: {fechaActualizacion}
          </p>
        </motion.div>
      </div>
    </section>
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
        {seccionesPrivacidad.map((seccion) => (
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

function SeccionPrivacidadComponent({ seccion, index }: { seccion: SeccionPrivacidad; index: number }) {
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

export function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <HeroPrivacidad />

      {/* Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <TableOfContents />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {seccionesPrivacidad.map((seccion, index) => (
              <SeccionPrivacidadComponent key={seccion.id} seccion={seccion} index={index} />
            ))}

            {/* Back to top & Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-center text-white"
            >
              <h3 className="text-2xl font-bold mb-4">¿Tienes preguntas?</h3>
              <p className="text-gray-300 mb-6">
                Si tienes dudas sobre nuestra Política de Privacidad o cómo manejamos tus datos, 
                no dudes en contactarnos.
              </p>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                Contáctanos
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
