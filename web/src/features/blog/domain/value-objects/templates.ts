/**
 * Plantillas de Blog para FabLab
 * 
 * Plantillas predefinidas para diferentes tipos de contenido.
 */

export interface BlogTemplate {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  contenido: string;
  extracto?: string;
  etiquetasSugeridas: string[];
  categoria?: string;
}

// Contenido de plantillas (escapando backticks)
const TEMPLATE_PROYECTO = `## 📋 Descripción del Proyecto

[Describe brevemente de qué trata el proyecto y su objetivo principal]

## 🎯 Objetivos

- Objetivo 1
- Objetivo 2
- Objetivo 3

## 🛠️ Materiales y Herramientas

### Materiales
| Material | Cantidad | Especificaciones |
|----------|----------|------------------|
| Material 1 | X unidades | Detalles |
| Material 2 | X unidades | Detalles |

### Herramientas y Equipos
- Impresora 3D (especificar modelo)
- Cortadora láser
- Herramientas manuales

## 📐 Diseño

[Describe el proceso de diseño, software utilizado, consideraciones técnicas]

## 🔨 Proceso de Fabricación

### Paso 1: Preparación
[Descripción del paso]

### Paso 2: Fabricación
[Descripción del paso]

### Paso 3: Ensamblaje
[Descripción del paso]

## 📸 Galería

[Inserta imágenes del proceso y resultado final]

## 💡 Resultados y Aprendizajes

### Lo que funcionó bien
- Punto 1
- Punto 2

### Desafíos encontrados
- Desafío 1 y cómo se resolvió

## 🔗 Referencias

- [Enlace 1](url)
- [Enlace 2](url)

---

**Autor:** [Tu nombre]  
**Fecha:** [Fecha del proyecto]  
**Tiempo de realización:** [X horas/días]`;

const TEMPLATE_TUTORIAL = `## 🎓 Introducción

[Qué aprenderás en este tutorial y por qué es útil]

### Requisitos Previos
- Conocimiento básico de...
- Acceso a...

### Nivel de Dificultad
⭐⭐⭐☆☆ Intermedio

### Tiempo Estimado
⏱️ Aproximadamente X minutos

---

## 📦 Preparación

### Materiales necesarios
- Item 1
- Item 2

---

## 📝 Paso a Paso

### Paso 1: [Título del paso]

[Descripción detallada]

> 💡 **Tip:** [Consejo útil para este paso]

### Paso 2: [Título del paso]

[Descripción detallada]

### Paso 3: [Título del paso]

[Descripción detallada]

---

## ✅ Verificación

Cómo saber si lo hiciste correctamente:
- [ ] Punto de verificación 1
- [ ] Punto de verificación 2

---

## 🚨 Solución de Problemas

### Problema común 1
**Síntoma:** [Descripción]  
**Solución:** [Cómo resolverlo]

---

## 🎯 Conclusión

[Resumen de lo aprendido y próximos pasos sugeridos]

### Recursos Adicionales
- [Documentación oficial](url)
- [Video complementario](url)`;

const TEMPLATE_EVENTO = `## 📅 [Nombre del Evento]

### 🗓️ Detalles del Evento

| | |
|---|---|
| **Fecha** | [DD/MM/YYYY] |
| **Hora** | [HH:MM] - [HH:MM] |
| **Lugar** | FabLab INACAP [Sede] |
| **Cupos** | [X] participantes |
| **Costo** | Gratuito / $XX.XXX |

---

## 📝 Descripción

[Descripción detallada del evento, qué se hará, qué aprenderán los participantes]

---

## 👥 ¿Para quién es este evento?

Este evento está dirigido a:
- Estudiantes de...
- Profesionales de...
- Entusiastas de...

### Requisitos
- [Requisito 1]
- [Requisito 2]

---

## 📋 Programa

| Hora | Actividad |
|------|-----------|
| 00:00 | Registro y bienvenida |
| 00:30 | [Actividad 1] |
| 01:30 | Coffee break |
| 01:45 | [Actividad 2] |
| 03:00 | Cierre y networking |

---

## 🎤 Facilitadores

### [Nombre del Facilitador]
[Breve biografía y expertise]

---

## 📦 ¿Qué traer?

- [ ] Laptop (opcional/requerido)
- [ ] Muchas ganas de aprender 🚀

---

## 🔗 Inscripción

**[INSCRÍBETE AQUÍ](enlace-formulario)**

⚠️ *Cupos limitados. Las inscripciones cierran el [fecha].*

---

## 📍 Cómo Llegar

[Instrucciones de ubicación, mapa, transporte público cercano]

---

## 📞 Contacto

¿Tienes dudas? Escríbenos a:
- Email: fablab@inacap.cl
- Instagram: @fablab_inacap`;

const TEMPLATE_NOTICIA = `## [Título de la Noticia]

**[Fecha]** — [Lead o resumen en una oración que capture la esencia de la noticia]

---

[Primer párrafo con la información más importante: qué, quién, cuándo, dónde, por qué]

[Segundo párrafo con detalles adicionales y contexto]

> "[Cita relevante de alguna persona involucrada]"
> — **Nombre, Cargo**

[Párrafo con más información de fondo o impacto]

---

## 🔗 Más Información

- [Enlace relacionado 1](url)
- [Enlace relacionado 2](url)

---

## 📸 Galería

[Imágenes relacionadas con la noticia]

---

*Para más información, contactar a [nombre] en [email]*`;

const TEMPLATE_RECURSO = `## 📁 [Nombre del Recurso]

### 📋 Descripción

[Describe qué es este recurso y para qué sirve]

---

## 📊 Información del Archivo

| Propiedad | Valor |
|-----------|-------|
| **Formato** | STL / DXF / PDF / etc. |
| **Tamaño** | X MB |
| **Versión** | 1.0 |
| **Licencia** | CC BY-SA 4.0 / MIT / etc. |
| **Última actualización** | DD/MM/YYYY |

---

## ⬇️ Descarga

**[DESCARGAR ARCHIVO](enlace-descarga)** 

*Alternativa: [Google Drive](enlace) | [GitHub](enlace)*

---

## 🔧 Especificaciones Técnicas

### Para Impresión 3D
- Material recomendado: PLA/PETG
- Resolución: 0.2mm
- Relleno: 20%
- Soportes: Sí/No
- Tiempo estimado: X horas

### Para Corte Láser
- Material: MDF 3mm / Acrílico 5mm
- Potencia: X%
- Velocidad: Xmm/s

---

## 📸 Vista Previa

[Imágenes del recurso, renders, ejemplos de uso]

---

## 📝 Instrucciones de Uso

1. Descarga el archivo
2. [Paso 2]
3. [Paso 3]

---

## ⚠️ Notas Importantes

- [Nota 1]
- [Nota 2]

---

## 🙏 Créditos

Diseñado por: [Nombre]  
Basado en: [Referencia si aplica]`;

/**
 * Plantillas disponibles para posts del FabLab
 */
export const BLOG_TEMPLATES: BlogTemplate[] = [
  {
    id: 'proyecto',
    nombre: 'Proyecto FabLab',
    descripcion: 'Documenta un proyecto realizado en el FabLab',
    icono: '🔧',
    etiquetasSugeridas: ['proyecto', 'fablab', 'maker'],
    categoria: 'proyectos',
    contenido: TEMPLATE_PROYECTO,
    extracto: 'Documentación completa de un proyecto realizado en el FabLab INACAP.',
  },
  {
    id: 'tutorial',
    nombre: 'Tutorial/Guía',
    descripcion: 'Tutorial paso a paso para aprender algo nuevo',
    icono: '📚',
    etiquetasSugeridas: ['tutorial', 'guía', 'aprendizaje'],
    categoria: 'tutoriales',
    contenido: TEMPLATE_TUTORIAL,
    extracto: 'Aprende paso a paso con este tutorial detallado.',
  },
  {
    id: 'evento',
    nombre: 'Evento/Taller',
    descripcion: 'Anuncia o documenta un evento del FabLab',
    icono: '🎉',
    etiquetasSugeridas: ['evento', 'taller', 'workshop'],
    categoria: 'eventos',
    contenido: TEMPLATE_EVENTO,
    extracto: 'Únete a nuestro próximo evento en el FabLab.',
  },
  {
    id: 'noticia',
    nombre: 'Noticia/Anuncio',
    descripcion: 'Comparte noticias y anuncios del FabLab',
    icono: '📢',
    etiquetasSugeridas: ['noticia', 'anuncio', 'actualización'],
    categoria: 'noticias',
    contenido: TEMPLATE_NOTICIA,
    extracto: 'Últimas noticias y anuncios del FabLab INACAP.',
  },
  {
    id: 'recurso',
    nombre: 'Recurso/Descarga',
    descripcion: 'Comparte archivos, modelos 3D, plantillas, etc.',
    icono: '📁',
    etiquetasSugeridas: ['recurso', 'descarga', 'archivo'],
    categoria: 'recursos',
    contenido: TEMPLATE_RECURSO,
    extracto: 'Descarga recursos gratuitos del FabLab.',
  },
  {
    id: 'vacio',
    nombre: 'En Blanco',
    descripcion: 'Comienza desde cero con una página en blanco',
    icono: '📝',
    etiquetasSugeridas: [],
    contenido: '',
    extracto: '',
  },
];

/**
 * Obtiene una plantilla por ID
 */
export function getTemplate(id: string): BlogTemplate | undefined {
  return BLOG_TEMPLATES.find(t => t.id === id);
}

/**
 * Obtiene todas las plantillas
 */
export function getTemplates(): BlogTemplate[] {
  return BLOG_TEMPLATES;
}

/**
 * Categorías predefinidas para el blog
 */
export const BLOG_CATEGORIES = [
  { id: 'proyectos', nombre: 'Proyectos', slug: 'proyectos', color: 'blue' },
  { id: 'tutoriales', nombre: 'Tutoriales', slug: 'tutoriales', color: 'green' },
  { id: 'eventos', nombre: 'Eventos', slug: 'eventos', color: 'purple' },
  { id: 'noticias', nombre: 'Noticias', slug: 'noticias', color: 'orange' },
  { id: 'recursos', nombre: 'Recursos', slug: 'recursos', color: 'cyan' },
] as const;

export type BlogCategoryId = typeof BLOG_CATEGORIES[number]['id'];
