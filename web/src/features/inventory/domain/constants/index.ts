/**
 * Constantes de dominio para el módulo de inventario/taxonomía
 */

export interface VocabularioBase {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface TerminoBase {
  id: string;
  nombre: string;
  vocabularioId: string;
  padreId?: string;
}

export const VOCABULARIOS_BASE: VocabularioBase[] = [
  { id: 'categorias', nombre: 'Categorías', descripcion: 'Categorías principales de equipos y materiales' },
  { id: 'marcas', nombre: 'Marcas', descripcion: 'Marcas de fabricantes' },
  { id: 'etiquetas', nombre: 'Etiquetas', descripcion: 'Etiquetas descriptivas' },
  { id: 'estados', nombre: 'Estados', descripcion: 'Estados de los items' },
  { id: 'colores', nombre: 'Colores', descripcion: 'Colores disponibles' },
];

export const TERMINOS_CATEGORIAS: TerminoBase[] = [
  { id: 'cat-impresion3d', nombre: 'Impresión 3D', vocabularioId: 'categorias' },
  { id: 'cat-corte-laser', nombre: 'Corte Láser', vocabularioId: 'categorias' },
  { id: 'cat-electronica', nombre: 'Electrónica', vocabularioId: 'categorias' },
  { id: 'cat-herramientas', nombre: 'Herramientas', vocabularioId: 'categorias' },
  { id: 'cat-materiales', nombre: 'Materiales', vocabularioId: 'categorias' },
];

export const TERMINOS_MARCAS: TerminoBase[] = [
  { id: 'marca-prusa', nombre: 'Prusa', vocabularioId: 'marcas' },
  { id: 'marca-creality', nombre: 'Creality', vocabularioId: 'marcas' },
  { id: 'marca-arduino', nombre: 'Arduino', vocabularioId: 'marcas' },
  { id: 'marca-raspberry', nombre: 'Raspberry Pi', vocabularioId: 'marcas' },
];

export const TERMINOS_ETIQUETAS: TerminoBase[] = [
  { id: 'tag-nuevo', nombre: 'Nuevo', vocabularioId: 'etiquetas' },
  { id: 'tag-popular', nombre: 'Popular', vocabularioId: 'etiquetas' },
  { id: 'tag-reservado', nombre: 'Reservado', vocabularioId: 'etiquetas' },
];

export const TERMINOS_ESTADOS: TerminoBase[] = [
  { id: 'estado-disponible', nombre: 'Disponible', vocabularioId: 'estados' },
  { id: 'estado-en-uso', nombre: 'En Uso', vocabularioId: 'estados' },
  { id: 'estado-mantenimiento', nombre: 'En Mantenimiento', vocabularioId: 'estados' },
  { id: 'estado-fuera-servicio', nombre: 'Fuera de Servicio', vocabularioId: 'estados' },
];

export const TERMINOS_COLORES: TerminoBase[] = [
  { id: 'color-blanco', nombre: 'Blanco', vocabularioId: 'colores' },
  { id: 'color-negro', nombre: 'Negro', vocabularioId: 'colores' },
  { id: 'color-rojo', nombre: 'Rojo', vocabularioId: 'colores' },
  { id: 'color-azul', nombre: 'Azul', vocabularioId: 'colores' },
  { id: 'color-verde', nombre: 'Verde', vocabularioId: 'colores' },
];
