/**
 * Cliente Mock de Taxonomía - Datos locales para desarrollo
 * 
 * Simula la API de Vessel con datos en memoria.
 * Usar mientras el backend no esté disponible.
 */

import type {
  Vocabulario,
  Termino,
  ArbolTermino,
  Breadcrumb,
  FiltrosTerminos,
} from '../../domain/entities/taxonomy';

import {
  VOCABULARIOS_BASE,
  TERMINOS_CATEGORIAS,
  TERMINOS_MARCAS,
  TERMINOS_ETIQUETAS,
  TERMINOS_ESTADOS,
  TERMINOS_COLORES,
} from '../../domain/constants';

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Datos en memoria
let vocabularios: Vocabulario[] = VOCABULARIOS_BASE.map(v => ({
  id: v.id,
  nombre: v.nombre,
  descripcion: v.descripcion,
  fechaCreacion: new Date(),
  fechaActualizacion: new Date(),
}));

let terminos: Termino[] = [
  ...TERMINOS_CATEGORIAS,
  ...TERMINOS_MARCAS,
  ...TERMINOS_ETIQUETAS,
  ...TERMINOS_ESTADOS,
  ...TERMINOS_COLORES,
].map(t => ({
  id: t.id,
  nombre: t.nombre,
  vocabularioId: t.vocabularioId,
  fechaCreacion: new Date(),
  fechaActualizacion: new Date(),
}));

let nextVocabId = 100;
let nextTermId = 100;

/**
 * Cliente Mock que simula la API de taxonomías
 */
export class MockTaxonomyClient {
  
  // ==================== VOCABULARIOS ====================

  async getVocabularios(): Promise<Vocabulario[]> {
    await delay(200);
    return [...vocabularios];
  }

  async getVocabulario(id: string): Promise<Vocabulario> {
    await delay(100);
    const vocab = vocabularios.find(v => v.id === id);
    if (!vocab) throw new Error(`Vocabulario ${id} no encontrado`);
    return { ...vocab };
  }

  async createVocabulario(data: Omit<Vocabulario, 'id'>): Promise<Vocabulario> {
    await delay(200);
    const nuevo: Vocabulario = {
      id: `vocab-${nextVocabId++}`,
      nombre: data.nombre,
      descripcion: data.descripcion,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };
    vocabularios.push(nuevo);
    return { ...nuevo };
  }

  async updateVocabulario(id: string, data: Partial<Vocabulario>): Promise<Vocabulario> {
    await delay(200);
    const idx = vocabularios.findIndex(v => v.id === id);
    if (idx === -1) throw new Error(`Vocabulario ${id} no encontrado`);
    
    vocabularios[idx] = {
      ...vocabularios[idx],
      ...data,
      fechaActualizacion: new Date(),
    };
    return { ...vocabularios[idx] };
  }

  async deleteVocabulario(id: string): Promise<void> {
    await delay(200);
    const idx = vocabularios.findIndex(v => v.id === id);
    if (idx === -1) throw new Error(`Vocabulario ${id} no encontrado`);
    vocabularios.splice(idx, 1);
    // También eliminar términos asociados
    terminos = terminos.filter(t => t.vocabularioId !== id);
  }

  // ==================== TÉRMINOS ====================

  async getTerminos(filtros?: FiltrosTerminos): Promise<Termino[]> {
    await delay(200);
    let resultado = [...terminos];
    
    if (filtros?.vocabularioId) {
      resultado = resultado.filter(t => t.vocabularioId === filtros.vocabularioId);
    }
    if (filtros?.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(t => 
        t.nombre.toLowerCase().includes(busqueda)
      );
    }
    if (filtros?.padreId) {
      resultado = resultado.filter(t => t.padreId === filtros.padreId);
    }
    
    return resultado;
  }

  async getTermino(id: string): Promise<Termino> {
    await delay(100);
    const term = terminos.find(t => t.id === id);
    if (!term) throw new Error(`Término ${id} no encontrado`);
    return { ...term };
  }

  async createTermino(data: Omit<Termino, 'id'>): Promise<Termino> {
    await delay(200);
    const nuevo: Termino = {
      id: `term-${nextTermId++}`,
      nombre: data.nombre,
      vocabularioId: data.vocabularioId,
      padreId: data.padreId,
      descripcion: data.descripcion,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };
    terminos.push(nuevo);
    return { ...nuevo };
  }

  async updateTermino(id: string, data: Partial<Termino>): Promise<Termino> {
    await delay(200);
    const idx = terminos.findIndex(t => t.id === id);
    if (idx === -1) throw new Error(`Término ${id} no encontrado`);
    
    terminos[idx] = {
      ...terminos[idx],
      ...data,
      fechaActualizacion: new Date(),
    };
    return { ...terminos[idx] };
  }

  async deleteTermino(id: string): Promise<void> {
    await delay(200);
    const idx = terminos.findIndex(t => t.id === id);
    if (idx === -1) throw new Error(`Término ${id} no encontrado`);
    terminos.splice(idx, 1);
  }

  async getArbolTerminos(vocabularioId?: string): Promise<ArbolTermino[]> {
    await delay(200);
    let items = [...terminos];
    
    if (vocabularioId) {
      items = items.filter(t => t.vocabularioId === vocabularioId);
    }
    
    // Construir árbol (solo términos raíz por ahora)
    return items
      .filter(t => !t.padreId)
      .map(t => ({
        ...t,
        hijos: items.filter(h => h.padreId === t.id).map(h => ({ ...h, hijos: [] })),
      }));
  }

  async getBreadcrumb(terminoId: string): Promise<Breadcrumb[]> {
    await delay(100);
    const term = terminos.find(t => t.id === terminoId);
    if (!term) return [];
    
    const breadcrumbs: Breadcrumb[] = [{ id: term.id, nombre: term.nombre }];
    
    // Agregar padres si existen
    let current = term;
    while (current.padreId) {
      const padre = terminos.find(t => t.id === current.padreId);
      if (!padre) break;
      breadcrumbs.unshift({ id: padre.id, nombre: padre.nombre });
      current = padre;
    }
    
    return breadcrumbs;
  }
}

// Singleton
let mockInstance: MockTaxonomyClient | null = null;

export function getMockTaxonomyClient(): MockTaxonomyClient {
  if (!mockInstance) {
    mockInstance = new MockTaxonomyClient();
  }
  return mockInstance;
}

/**
 * Resetear datos mock (útil para tests)
 */
export function resetMockData(): void {
  vocabularios = VOCABULARIOS_BASE.map(v => ({
    id: v.id,
    nombre: v.nombre,
    descripcion: v.descripcion,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date(),
  }));
  
  terminos = [
    ...TERMINOS_CATEGORIAS,
    ...TERMINOS_MARCAS,
    ...TERMINOS_ETIQUETAS,
    ...TERMINOS_ESTADOS,
    ...TERMINOS_COLORES,
  ].map(t => ({
    id: t.id,
    nombre: t.nombre,
    vocabularioId: t.vocabularioId,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date(),
  }));
  
  nextVocabId = 100;
  nextTermId = 100;
}
