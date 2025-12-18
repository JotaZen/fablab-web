/**
 * Hook para cargar datos de selectores del formulario de Item
 * 
 * Carga: categorías, marcas, UoM, locaciones (warehouse + storage_unit)
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Termino } from '../../domain/entities/taxonomy';
import type { UnidadMedida } from '../../domain/entities/uom';
import type { Locacion, LocacionConHijos } from '../../domain/entities/location';

interface SelectoresData {
  categorias: Termino[];
  marcas: Termino[];
  tags: Termino[];
  unidadesMedida: UnidadMedida[];
  locaciones: Locacion[];
  arbolLocaciones: LocacionConHijos[];
}

interface UseSelectoresItemReturn extends SelectoresData {
  cargando: boolean;
  error: string | null;
  cargar: () => Promise<void>;
  /** Obtiene locaciones hijas de una locación padre */
  hijosDeLocacion: (padreId?: string) => Locacion[];
  /** Solo locaciones tipo warehouse */
  soloLocaciones: Locacion[];
  /** Solo unidades de almacenamiento */
  soloUnidades: Locacion[];
}

/** Construye árbol de locaciones */
function construirArbol(locaciones: Locacion[], padreId?: string): LocacionConHijos[] {
  return locaciones
    .filter(loc => loc.padreId === padreId)
    .map(loc => ({
      ...loc,
      hijos: loc.tipo === 'warehouse'
        ? construirArbol(locaciones, loc.id)
        : [],
    }));
}

export function useSelectoresItem(): UseSelectoresItemReturn {
  const [data, setData] = useState<SelectoresData>({
    categorias: [],
    marcas: [],
    tags: [],
    unidadesMedida: [],
    locaciones: [],
    arbolLocaciones: [],
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const baseUrl = '/api/vessel';

      // Cargar en paralelo
      const [
        vocabRes,
        termsRes,
        uomRes,
        locationsRes,
      ] = await Promise.all([
        fetch(`${baseUrl}/v1/taxonomy/vocabularies/read`),
        fetch(`${baseUrl}/v1/taxonomy/terms/read`),
        fetch(`${baseUrl}/v1/uom/measures/read`).catch(() => ({ ok: false })),
        fetch(`${baseUrl}/v1/locations/read`).catch(() => ({ ok: false })),
      ]);

      // Procesar vocabularios y términos
      const categorias: Termino[] = [];
      const marcas: Termino[] = [];
      const tags: Termino[] = [];

      if (vocabRes.ok && termsRes.ok) {
        const vocabData = await vocabRes.json();
        const termsData = await termsRes.json();

        const vocabularios = vocabData.data || vocabData || [];
        const terminos = termsData.data || termsData || [];

        // Mapear vocabularios por nombre
        const vocabMap: Record<string, string> = {};
        vocabularios.forEach((v: { id: string; name: string }) => {
          const nameLower = v.name.toLowerCase();
          if (nameLower.includes('categor')) vocabMap['categorias'] = v.id;
          else if (nameLower.includes('marca')) vocabMap['marcas'] = v.id;
          else if (nameLower.includes('tag') || nameLower.includes('etiqueta')) vocabMap['tags'] = v.id;
        });

        // Filtrar términos por vocabulario
        terminos.forEach((t: { id: string; name: string; vocabulary_id: string; description?: string; parent_id?: string; level?: number; items_count?: number }) => {
          const termino: Termino = {
            id: t.id,
            nombre: t.name,
            vocabularioId: t.vocabulary_id,
            descripcion: t.description,
            padreId: t.parent_id,
            nivel: t.level || 0,
            conteoItems: t.items_count || 0,
          };

          if (t.vocabulary_id === vocabMap['categorias']) categorias.push(termino);
          else if (t.vocabulary_id === vocabMap['marcas']) marcas.push(termino);
          else if (t.vocabulary_id === vocabMap['tags']) tags.push(termino);
        });
      }

      // Procesar UoM
      let unidadesMedida: UnidadMedida[] = [];
      if (uomRes.ok) {
        const uomData = await (uomRes as Response).json();
        const measures = uomData.data || uomData || [];
        unidadesMedida = measures.map((m: {
          id: string;
          code: string;
          name: string;
          symbol: string;
          category: string;
          is_base: boolean;
          conversion_factor: number;
        }) => ({
          // Usamos el code como ID porque la API de Items espera el código (ej: "kg")
          // no el id interno (ej: "uom-kg")
          id: m.code,
          codigo: m.code,
          nombre: m.name,
          simbolo: m.symbol,
          categoria: m.category,
          esBase: m.is_base,
          factorConversion: m.conversion_factor,
        }));
      }

      // Procesar Locaciones
      let locaciones: Locacion[] = [];
      if (locationsRes.ok) {
        const locData = await (locationsRes as Response).json();
        const locs = locData.data || locData || [];
        locaciones = locs.map((l: {
          id: string;
          name: string;
          type: string;
          parent_id?: string | null;
          address_id?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        }) => ({
          id: l.id,
          nombre: l.name,
          tipo: l.type || 'warehouse',
          padreId: l.parent_id || undefined,
          addressId: l.address_id || undefined,
          descripcion: l.description || undefined,
          creadoEn: l.created_at || new Date().toISOString(),
          actualizadoEn: l.updated_at || new Date().toISOString(),
        }));
      }

      // Construir árbol
      const arbolLocaciones = construirArbol(locaciones, undefined);

      setData({
        categorias,
        marcas,
        tags,
        unidadesMedida,
        locaciones,
        arbolLocaciones,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setCargando(false);
    }
  }, []);

  // Cargar al montar
  useEffect(() => {
    cargar();
  }, [cargar]);

  // Helper para obtener hijos de una locación
  const hijosDeLocacion = useCallback((padreId?: string): Locacion[] => {
    return data.locaciones.filter(loc => loc.padreId === padreId);
  }, [data.locaciones]);

  // Solo locaciones (warehouse)
  const soloLocaciones = useMemo(() => {
    return data.locaciones.filter(loc => loc.tipo === 'warehouse');
  }, [data.locaciones]);

  // Solo unidades de almacenamiento
  const soloUnidades = useMemo(() => {
    return data.locaciones.filter(loc => loc.tipo === 'storage_unit');
  }, [data.locaciones]);

  return {
    ...data,
    cargando,
    error,
    cargar,
    hijosDeLocacion,
    soloLocaciones,
    soloUnidades,
  };
}
