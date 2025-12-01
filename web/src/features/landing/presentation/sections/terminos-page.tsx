"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  FileText,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Wrench,
  BookOpen,
  Scale,
  Handshake,
  Ban,
  RefreshCw,
  Mail,
  ChevronRight,
  Printer,
  Cpu,
  Layers,
} from "lucide-react";
import Link from "next/link";

// ============================================================================
// TYPES
// ============================================================================

interface SeccionTerminos {
  id: string;
  icono: LucideIcon;
  titulo: string;
  contenido: React.ReactNode;
}

// ============================================================================
// DATA
// ============================================================================

const fechaActualizacion = "30 de noviembre de 2025";

const seccionesTerminos: SeccionTerminos[] = [
  {
    id: "introduccion",
    icono: FileText,
    titulo: "Introducción",
    contenido: (
      <>
        <p className="mb-4">
          Bienvenido a FabLab INACAP Los Ángeles. Estos Términos y Condiciones de Uso 
          (en adelante, &quot;Términos&quot;) regulan el acceso y uso de nuestras instalaciones, 
          equipos, servicios y sitio web.
        </p>
        <p className="mb-4">
          Al utilizar cualquiera de nuestros servicios, ya sea de forma presencial o digital, 
          usted acepta cumplir con estos Términos en su totalidad. Si no está de acuerdo con 
          alguna de estas condiciones, le rogamos que no utilice nuestros servicios.
        </p>
        <p>
          FabLab INACAP Los Ángeles es un espacio de colaboración para diseñar y construir 
          prototipos, potenciando la aceleración del proceso de desarrollo de ideas. Operamos 
          bajo el alero de INACAP Sede Los Ángeles.
        </p>
      </>
    ),
  },
  {
    id: "definiciones",
    icono: BookOpen,
    titulo: "Definiciones",
    contenido: (
      <>
        <p className="mb-4">Para efectos de estos Términos, se entenderá por:</p>
        
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900">&quot;FabLab&quot; o &quot;Laboratorio&quot;</h4>
            <p className="text-gray-600 text-sm">
              FabLab INACAP Los Ángeles, incluyendo sus instalaciones físicas, equipos, 
              personal y servicios digitales.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900">&quot;Usuario&quot;</h4>
            <p className="text-gray-600 text-sm">
              Toda persona que acceda a las instalaciones del FabLab, utilice sus equipos, 
              participe en capacitaciones o use el sitio web.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900">&quot;Equipos&quot;</h4>
            <p className="text-gray-600 text-sm">
              Máquinas, herramientas, dispositivos y recursos tecnológicos disponibles en el 
              laboratorio (impresoras 3D, cortadoras láser, CNC, equipos de electrónica, etc.).
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900">&quot;Proyecto&quot;</h4>
            <p className="text-gray-600 text-sm">
              Cualquier trabajo, prototipo, diseño o creación desarrollada utilizando los 
              recursos del FabLab.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900">&quot;Capacitación&quot;</h4>
            <p className="text-gray-600 text-sm">
              Cursos, talleres, inducciones y certificaciones impartidas por el personal del FabLab.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "acceso",
    icono: Users,
    titulo: "Acceso al Laboratorio",
    contenido: (
      <>
        <p className="mb-4">
          El FabLab INACAP Los Ángeles está abierto a estudiantes, académicos, emprendedores, 
          profesionales y público general de la provincia del Biobío. El acceso es gratuito, 
          sujeto a las siguientes condiciones:
        </p>

        <h4 className="font-semibold text-gray-900 mb-3">Requisitos de acceso:</h4>
        <ul className="space-y-2 mb-6">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Registro previo con datos personales válidos</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Aceptación de estos Términos y Condiciones</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Completar la inducción básica de seguridad</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Presentar documento de identidad válido</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Ser mayor de 18 años o contar con autorización de tutor legal</span>
          </li>
        </ul>

        <h4 className="font-semibold text-gray-900 mb-3">Horario de atención:</h4>
        <div className="bg-orange-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-gray-900">Horario regular</span>
          </div>
          <p className="text-gray-600 text-sm">Lunes a Viernes: 08:30 - 18:30</p>
          <p className="text-gray-600 text-sm">Sábados: 09:00 - 14:00</p>
          <p className="text-gray-500 text-xs mt-2">
            * El horario puede variar durante períodos de vacaciones o días feriados.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "uso-equipos",
    icono: Wrench,
    titulo: "Uso de Equipos",
    contenido: (
      <>
        <p className="mb-4">
          Los equipos del FabLab están disponibles para todos los usuarios registrados, 
          sujeto a disponibilidad y nivel de certificación requerido.
        </p>

        <h4 className="font-semibold text-gray-900 mb-3">Niveles de certificación:</h4>
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="font-bold text-gray-600">0</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Básico</p>
              <p className="text-sm text-gray-500">Acceso libre sin capacitación previa</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 border border-green-200 bg-green-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="font-bold text-green-600">1</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Nivel 1</p>
              <p className="text-sm text-gray-500">Inducción básica de 1 hora</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="font-bold text-yellow-600">2</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Nivel 2</p>
              <p className="text-sm text-gray-500">Taller de 4 horas + práctica supervisada</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 border border-orange-200 bg-orange-50 rounded-lg">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="font-bold text-orange-600">3</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Nivel 3</p>
              <p className="text-sm text-gray-500">Curso completo de 8+ horas</p>
            </div>
          </div>
        </div>

        <h4 className="font-semibold text-gray-900 mb-3">Obligaciones del usuario:</h4>
        <ul className="space-y-2">
          <li className="flex items-start gap-3">
            <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Utilizar los equipos únicamente para los fines autorizados</span>
          </li>
          <li className="flex items-start gap-3">
            <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Seguir las instrucciones del personal del laboratorio</span>
          </li>
          <li className="flex items-start gap-3">
            <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Respetar los tiempos de reserva asignados</span>
          </li>
          <li className="flex items-start gap-3">
            <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Dejar los equipos y el área de trabajo limpios y ordenados</span>
          </li>
          <li className="flex items-start gap-3">
            <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Reportar inmediatamente cualquier falla o daño en los equipos</span>
          </li>
          <li className="flex items-start gap-3">
            <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Utilizar elementos de protección personal cuando sea requerido</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "reservas",
    icono: Clock,
    titulo: "Sistema de Reservas",
    contenido: (
      <>
        <p className="mb-4">
          Para garantizar el acceso equitativo a los equipos, implementamos un sistema de reservas:
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Anticipación máxima</h4>
            <p className="text-2xl font-bold text-orange-600">7 días</p>
            <p className="text-gray-500 text-sm">previos a la fecha de uso</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Tiempo máximo por sesión</h4>
            <p className="text-2xl font-bold text-orange-600">4 horas</p>
            <p className="text-gray-500 text-sm">por equipo, por día</p>
          </div>
        </div>

        <h4 className="font-semibold text-gray-900 mb-3">Políticas de reserva:</h4>
        <ul className="space-y-2 mb-4">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Las reservas pueden realizarse en persona o por correo electrónico</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Confirme su asistencia al menos 2 horas antes</span>
          </li>
          <li className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Llegadas tardías de más de 15 minutos liberan la reserva</span>
          </li>
          <li className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">3 inasistencias sin aviso pueden resultar en suspensión temporal</span>
          </li>
        </ul>

        <p className="text-sm text-gray-500 bg-blue-50 p-4 rounded-xl">
          <strong>Nota:</strong> Los proyectos de larga duración pueden solicitar extensiones 
          especiales, sujetas a disponibilidad y aprobación del personal.
        </p>
      </>
    ),
  },
  {
    id: "materiales",
    icono: Layers,
    titulo: "Materiales y Consumibles",
    contenido: (
      <>
        <p className="mb-4">
          El FabLab proporciona algunos materiales básicos, pero los usuarios son responsables 
          de traer sus propios insumos para la mayoría de los proyectos.
        </p>

        <h4 className="font-semibold text-gray-900 mb-3">Materiales proporcionados:</h4>
        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
          <li>Filamento PLA de uso educativo (cantidades limitadas)</li>
          <li>Componentes electrónicos básicos para prácticas</li>
          <li>Materiales de desecho para pruebas</li>
        </ul>

        <h4 className="font-semibold text-gray-900 mb-3">Materiales que debe traer el usuario:</h4>
        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
          <li>Filamentos especiales (ABS, PETG, TPU, etc.)</li>
          <li>Acrílico, madera, MDF para corte láser</li>
          <li>Componentes electrónicos específicos</li>
          <li>Resinas para impresión SLA</li>
        </ul>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Materiales prohibidos</h4>
              <p className="text-gray-600 text-sm">
                No se permite el uso de materiales que generen gases tóxicos (PVC, policarbonato 
                en láser), materiales inflamables no autorizados, o sustancias peligrosas. 
                Consulte con el personal antes de usar materiales no convencionales.
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "propiedad-intelectual",
    icono: Shield,
    titulo: "Propiedad Intelectual",
    contenido: (
      <>
        <p className="mb-4">
          FabLab INACAP Los Ángeles respeta y promueve la propiedad intelectual de sus usuarios:
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900">Sus creaciones son suyas</h4>
              <p className="text-gray-600 text-sm">
                Usted mantiene todos los derechos de propiedad intelectual sobre los diseños, 
                prototipos y creaciones que desarrolle utilizando nuestras instalaciones.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
            <Handshake className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900">Filosofía Open Source</h4>
              <p className="text-gray-600 text-sm">
                Promovemos (pero no exigimos) compartir conocimientos y diseños con la comunidad 
                bajo licencias abiertas cuando sea apropiado.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl">
            <Shield className="w-6 h-6 text-orange-600 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900">Respeto a terceros</h4>
              <p className="text-gray-600 text-sm">
                No está permitido reproducir diseños protegidos por derechos de autor o patentes 
                sin la debida autorización del titular.
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-600">
          FabLab puede solicitar autorización para fotografiar o documentar proyectos destacados 
          con fines promocionales o educativos, siempre con el consentimiento previo del autor.
        </p>
      </>
    ),
  },
  {
    id: "conducta",
    icono: Users,
    titulo: "Código de Conducta",
    contenido: (
      <>
        <p className="mb-4">
          El FabLab es un espacio de colaboración y aprendizaje. Esperamos que todos los usuarios 
          mantengan un comportamiento respetuoso y profesional.
        </p>

        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          Comportamiento esperado:
        </h4>
        <ul className="space-y-2 mb-6">
          <li className="flex items-start gap-3">
            <ChevronRight className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Tratar a todos con respeto y cortesía</span>
          </li>
          <li className="flex items-start gap-3">
            <ChevronRight className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Colaborar y compartir conocimientos con otros usuarios</span>
          </li>
          <li className="flex items-start gap-3">
            <ChevronRight className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Mantener un ambiente de trabajo limpio y ordenado</span>
          </li>
          <li className="flex items-start gap-3">
            <ChevronRight className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Respetar los espacios de trabajo de otros usuarios</span>
          </li>
          <li className="flex items-start gap-3">
            <ChevronRight className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Seguir las normas de seguridad en todo momento</span>
          </li>
        </ul>

        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-500" />
          Conductas prohibidas:
        </h4>
        <ul className="space-y-2">
          <li className="flex items-start gap-3">
            <Ban className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Discriminación o acoso de cualquier tipo</span>
          </li>
          <li className="flex items-start gap-3">
            <Ban className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Uso de equipos bajo efectos de alcohol o drogas</span>
          </li>
          <li className="flex items-start gap-3">
            <Ban className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Fabricación de armas o elementos peligrosos</span>
          </li>
          <li className="flex items-start gap-3">
            <Ban className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Uso comercial no autorizado de las instalaciones</span>
          </li>
          <li className="flex items-start gap-3">
            <Ban className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Daño intencional a equipos o instalaciones</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "seguridad",
    icono: AlertTriangle,
    titulo: "Seguridad",
    contenido: (
      <>
        <p className="mb-4">
          La seguridad es nuestra prioridad. Todos los usuarios deben cumplir con las 
          siguientes normas de seguridad:
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <Printer className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 text-sm">Impresión 3D</h4>
            <p className="text-xs text-gray-500 mt-1">Ventilación, no tocar boquilla caliente</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <Layers className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 text-sm">Corte Láser</h4>
            <p className="text-xs text-gray-500 mt-1">Gafas protectoras, supervisión constante</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <Cpu className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 text-sm">Electrónica</h4>
            <p className="text-xs text-gray-500 mt-1">Descargar estática, cuidado con soldadura</p>
          </div>
        </div>

        <h4 className="font-semibold text-gray-900 mb-3">Normas generales de seguridad:</h4>
        <ul className="space-y-2 mb-4">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Usar elementos de protección personal (EPP) según corresponda</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Conocer la ubicación de extintores y salidas de emergencia</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">No operar equipos sin la certificación correspondiente</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Reportar inmediatamente cualquier incidente o accidente</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Mantener las áreas de trabajo despejadas</span>
          </li>
        </ul>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">En caso de emergencia</h4>
              <p className="text-gray-600 text-sm">
                Detenga inmediatamente el equipo, alerte al personal del laboratorio y 
                siga las instrucciones de evacuación. En caso de lesión, no mueva a la 
                persona afectada y llame a emergencias.
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "responsabilidades",
    icono: Scale,
    titulo: "Responsabilidades y Limitaciones",
    contenido: (
      <>
        <h4 className="font-semibold text-gray-900 mb-3">Responsabilidad del usuario:</h4>
        <ul className="space-y-2 mb-6">
          <li className="flex items-start gap-3">
            <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">
              El usuario es responsable de los daños causados a equipos por uso indebido o negligencia
            </span>
          </li>
          <li className="flex items-start gap-3">
            <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">
              El usuario asume la responsabilidad por la calidad y seguridad de sus creaciones
            </span>
          </li>
          <li className="flex items-start gap-3">
            <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">
              El usuario debe informar sobre cualquier condición de salud relevante antes de usar ciertos equipos
            </span>
          </li>
        </ul>

        <h4 className="font-semibold text-gray-900 mb-3">Limitaciones de responsabilidad del FabLab:</h4>
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="text-gray-600 text-sm mb-3">
            FabLab INACAP Los Ángeles no será responsable por:
          </p>
          <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
            <li>Pérdida de materiales o proyectos dejados en las instalaciones</li>
            <li>Fallas en los proyectos creados por usuarios</li>
            <li>Daños derivados del uso comercial de prototipos</li>
            <li>Lesiones causadas por incumplimiento de normas de seguridad</li>
            <li>Interrupciones del servicio por mantenimiento o fuerza mayor</li>
          </ul>
        </div>

        <p className="text-sm text-gray-500">
          El uso del laboratorio implica la aceptación de estos riesgos inherentes a las 
          actividades de fabricación digital.
        </p>
      </>
    ),
  },
  {
    id: "sanciones",
    icono: Ban,
    titulo: "Sanciones",
    contenido: (
      <>
        <p className="mb-4">
          El incumplimiento de estos Términos puede resultar en las siguientes sanciones, 
          aplicadas según la gravedad de la falta:
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 border-l-4 border-yellow-400 bg-yellow-50 rounded-r-xl">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-yellow-600">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Amonestación verbal</h4>
              <p className="text-gray-600 text-sm">Para faltas leves o primera infracción menor.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border-l-4 border-orange-400 bg-orange-50 rounded-r-xl">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-orange-600">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Suspensión temporal</h4>
              <p className="text-gray-600 text-sm">De 1 a 30 días, según la gravedad. Aplica para reincidencias o faltas moderadas.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border-l-4 border-red-400 bg-red-50 rounded-r-xl">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-red-600">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Suspensión permanente</h4>
              <p className="text-gray-600 text-sm">Para faltas graves: daño intencional, conductas peligrosas, acoso.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border-l-4 border-gray-400 bg-gray-100 rounded-r-xl">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-gray-600">+</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Compensación por daños</h4>
              <p className="text-gray-600 text-sm">Se puede requerir el pago por reparación o reemplazo de equipos dañados.</p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "modificaciones",
    icono: RefreshCw,
    titulo: "Modificaciones",
    contenido: (
      <>
        <p className="mb-4">
          FabLab INACAP Los Ángeles se reserva el derecho de modificar estos Términos y 
          Condiciones en cualquier momento.
        </p>

        <h4 className="font-semibold text-gray-900 mb-3">Proceso de actualización:</h4>
        <ul className="space-y-2 mb-4">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Las modificaciones serán publicadas en esta página</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Se actualizará la fecha de &quot;Última actualización&quot;</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Cambios significativos serán comunicados por correo electrónico</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">El uso continuado implica aceptación de los nuevos términos</span>
          </li>
        </ul>

        <p className="text-sm text-gray-500">
          Le recomendamos revisar periódicamente estos Términos para mantenerse informado 
          sobre las condiciones de uso del laboratorio.
        </p>
      </>
    ),
  },
  {
    id: "legislacion",
    icono: Scale,
    titulo: "Legislación Aplicable",
    contenido: (
      <>
        <p className="mb-4">
          Estos Términos y Condiciones se rigen por las leyes de la República de Chile.
        </p>

        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Marco legal aplicable:</h4>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>• Ley N° 19.628 sobre Protección de la Vida Privada</li>
            <li>• Ley N° 19.496 sobre Protección de los Derechos de los Consumidores</li>
            <li>• Ley N° 17.336 sobre Propiedad Intelectual</li>
            <li>• Normativa interna de INACAP</li>
          </ul>
        </div>

        <p className="mt-4 text-gray-600">
          Cualquier controversia derivada de estos Términos será sometida a la jurisdicción 
          de los tribunales ordinarios de la ciudad de Los Ángeles, Región del Biobío, Chile.
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
          Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos:
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
              <Mail className="w-5 h-5 text-orange-600" />
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
          Para consultas específicas sobre capacitaciones, reservas o proyectos colaborativos, 
          visite nuestra{" "}
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

function HeroTerminos() {
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
            <Scale className="w-4 h-4" />
            Normativa de uso
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Términos y{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Condiciones
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
            Conoce las reglas y condiciones de uso del FabLab INACAP Los Ángeles, 
            nuestras instalaciones, equipos y servicios.
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
        {seccionesTerminos.map((seccion) => (
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

function SeccionTerminosComponent({ seccion, index }: { seccion: SeccionTerminos; index: number }) {
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

export function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <HeroTerminos />

      {/* Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <TableOfContents />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {seccionesTerminos.map((seccion, index) => (
              <SeccionTerminosComponent key={seccion.id} seccion={seccion} index={index} />
            ))}

            {/* Acceptance Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-center text-white"
            >
              <Scale className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Aceptación de Términos</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Al utilizar las instalaciones, equipos o servicios de FabLab INACAP Los Ángeles, 
                usted declara haber leído, entendido y aceptado estos Términos y Condiciones en su totalidad.
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
