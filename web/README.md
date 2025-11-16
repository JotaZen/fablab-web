# FabLab INACAP - Frontend

Sitio web moderno para el Laboratorio de Fabricación Digital del Instituto INACAP, desarrollado con Next.js 15, TypeScript, Tailwind CSS y shadcn/ui.

## 🚀 Características

- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Componentes**: shadcn/ui
- **Iconos**: Lucide React
- **Fuente**: Inter
- **3D Graphics**: Three.js con React Three Fiber
- **Animaciones**: Framer Motion con scroll triggers

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx          # Página de inicio
│   └── globals.css       # Estilos globales
├── components/            # Componentes React
│   ├── ui/               # Componentes base de shadcn/ui
│   ├── layout/           # Componentes de layout
│   │   ├── navbar.tsx    # Barra de navegación
│   │   └── footer.tsx    # Pie de página
│   ├── common/           # Componentes comunes reutilizables
│   │   ├── titles.tsx    # Componentes de títulos
│   │   ├── text.tsx      # Componentes de texto
│   │   └── images.tsx    # Componentes de imágenes
│   ├── sections/         # Secciones de páginas
│   │   ├── hero-section.tsx        # Sección hero
│   │   ├── technologies-section.tsx # Sección de tecnologías
│   │   └── projects-section.tsx    # Sección de proyectos
│   ├── graphics/         # Componentes gráficos
│   │   └── patterns.tsx  # Patrones y efectos visuales
│   └── index.ts         # Exportaciones centralizadas
├── lib/                  # Utilidades y funciones auxiliares
│   ├── hooks/           # Custom hooks
│   ├── helpers/         # Funciones helper
│   ├── constants/       # Constantes del proyecto
│   └── utils.ts         # Utilidades generales
```

## 🎨 Diseño Futurista y Minimalista

- **Colores**: Gradientes azul-púrpura para elementos principales
- **Responsive**: Mobile-first design
- **Animaciones**: Transiciones suaves y efectos hover
- **Tipografía**: Inter para legibilidad moderna

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Servidor de producción
npm start

# Linting
npm run lint
```

## 📱 Funcionalidades Implementadas

### Landing Page

1. **Hero Section**: Presentación principal con estadísticas
2. **Technologies Section**: Showcase de equipamiento y capacidades
3. **Projects Section**: Galería de proyectos estudiantiles

### Navegación

- **Navbar**: Responsive con menú móvil
- **Footer**: Información de contacto y enlaces
- **Scroll Effects**: Navbar transparente que se solidifica

### Componentes Organizados

- **Layout**: Navbar y Footer
- **Common**: Títulos, textos e imágenes reutilizables
- **Sections**: Secciones específicas de páginas con modelos 3D
- **Graphics**: Efectos visuales, patrones y modelos 3D interactivos

## 🎮 Modelos 3D y Animaciones

### Three.js Integration

- **React Three Fiber**: Renderer 3D para React
- **React Three Drei**: Helpers y componentes 3D
- **Modelos disponibles**: Impresora 3D, Chip tecnológico, Cubo interactivo

### Scroll Animations

- **Framer Motion**: Animaciones basadas en scroll
- **Parallax Effects**: Múltiples capas con diferentes velocidades
- **Reveal Animations**: Elementos que aparecen al hacer scroll
- **3D Model Interactions**: Modelos que rotan y escalan con el scroll

---

**Desarrollado para FabLab INACAP** - Laboratorio de Fabricación Digital
