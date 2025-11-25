/**
 * Constantes y datos semilla para el módulo de Inventario/Taxonomía
 * 
 * Vocabularios base para FabLab y términos iniciales en español
 */

/** IDs de vocabularios predefinidos */
export const VOCABULARIOS = {
  CATEGORIAS: 'vocab-categorias',
  MARCAS: 'vocab-marcas',
  ETIQUETAS: 'vocab-etiquetas',
  COLORES: 'vocab-colores',
  ESTADOS: 'vocab-estados',
} as const;

/** Vocabularios base para inicialización */
export const VOCABULARIOS_BASE = [
  { id: VOCABULARIOS.CATEGORIAS, nombre: 'Categorías', descripcion: 'Clasificación principal de items' },
  { id: VOCABULARIOS.MARCAS, nombre: 'Marcas', descripcion: 'Fabricantes y marcas de productos' },
  { id: VOCABULARIOS.ETIQUETAS, nombre: 'Etiquetas', descripcion: 'Tags para búsqueda y filtrado' },
  { id: VOCABULARIOS.COLORES, nombre: 'Colores', descripcion: 'Colores disponibles de productos' },
  { id: VOCABULARIOS.ESTADOS, nombre: 'Estados', descripcion: 'Estado del item en inventario' },
] as const;

/** Términos base por categoría */
export const TERMINOS_CATEGORIAS = [
  { id: 'term-microcontrolador', nombre: 'Microcontrolador', vocabularioId: VOCABULARIOS.CATEGORIAS },
  { id: 'term-sensor', nombre: 'Sensor', vocabularioId: VOCABULARIOS.CATEGORIAS },
  { id: 'term-actuador', nombre: 'Actuador', vocabularioId: VOCABULARIOS.CATEGORIAS },
  { id: 'term-componente', nombre: 'Componente Electrónico', vocabularioId: VOCABULARIOS.CATEGORIAS },
  { id: 'term-herramienta', nombre: 'Herramienta', vocabularioId: VOCABULARIOS.CATEGORIAS },
  { id: 'term-material', nombre: 'Material', vocabularioId: VOCABULARIOS.CATEGORIAS },
  { id: 'term-modulo', nombre: 'Módulo', vocabularioId: VOCABULARIOS.CATEGORIAS },
] as const;

/** Términos base por marca */
export const TERMINOS_MARCAS = [
  { id: 'term-arduino', nombre: 'Arduino', vocabularioId: VOCABULARIOS.MARCAS },
  { id: 'term-espressif', nombre: 'Espressif', vocabularioId: VOCABULARIOS.MARCAS },
  { id: 'term-raspberry', nombre: 'Raspberry Pi', vocabularioId: VOCABULARIOS.MARCAS },
  { id: 'term-adafruit', nombre: 'Adafruit', vocabularioId: VOCABULARIOS.MARCAS },
  { id: 'term-sparkfun', nombre: 'SparkFun', vocabularioId: VOCABULARIOS.MARCAS },
  { id: 'term-seeed', nombre: 'Seeed Studio', vocabularioId: VOCABULARIOS.MARCAS },
  { id: 'term-generico', nombre: 'Genérico', vocabularioId: VOCABULARIOS.MARCAS },
] as const;

/** Términos base por etiqueta */
export const TERMINOS_ETIQUETAS = [
  { id: 'term-wifi', nombre: 'WiFi', vocabularioId: VOCABULARIOS.ETIQUETAS },
  { id: 'term-bluetooth', nombre: 'Bluetooth', vocabularioId: VOCABULARIOS.ETIQUETAS },
  { id: 'term-iot', nombre: 'IoT', vocabularioId: VOCABULARIOS.ETIQUETAS },
  { id: 'term-3d', nombre: 'Impresión 3D', vocabularioId: VOCABULARIOS.ETIQUETAS },
  { id: 'term-cnc', nombre: 'CNC', vocabularioId: VOCABULARIOS.ETIQUETAS },
  { id: 'term-laser', nombre: 'Láser', vocabularioId: VOCABULARIOS.ETIQUETAS },
] as const;

/** Términos base por estado */
export const TERMINOS_ESTADOS = [
  { id: 'term-disponible', nombre: 'Disponible', vocabularioId: VOCABULARIOS.ESTADOS },
  { id: 'term-prestado', nombre: 'Prestado', vocabularioId: VOCABULARIOS.ESTADOS },
  { id: 'term-reparacion', nombre: 'En Reparación', vocabularioId: VOCABULARIOS.ESTADOS },
  { id: 'term-agotado', nombre: 'Agotado', vocabularioId: VOCABULARIOS.ESTADOS },
  { id: 'term-descontinuado', nombre: 'Descontinuado', vocabularioId: VOCABULARIOS.ESTADOS },
] as const;

/** Colores base */
export const TERMINOS_COLORES = [
  { id: 'term-rojo', nombre: 'Rojo', vocabularioId: VOCABULARIOS.COLORES },
  { id: 'term-azul', nombre: 'Azul', vocabularioId: VOCABULARIOS.COLORES },
  { id: 'term-verde', nombre: 'Verde', vocabularioId: VOCABULARIOS.COLORES },
  { id: 'term-negro', nombre: 'Negro', vocabularioId: VOCABULARIOS.COLORES },
  { id: 'term-blanco', nombre: 'Blanco', vocabularioId: VOCABULARIOS.COLORES },
] as const;
