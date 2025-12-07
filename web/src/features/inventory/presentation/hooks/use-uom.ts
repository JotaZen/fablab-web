/**
 * Hook para unidades de medida
 */

"use client";

import { useState, useEffect, useCallback } from 'react';
import { getUoMClient } from '../../infrastructure/vessel/uom.client';
import type { UnidadMedida } from '../../domain/entities/uom';

export function useUoM() {
    const [unidades, setUnidades] = useState<UnidadMedida[]>([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarUnidades = useCallback(async () => {
        setCargando(true);
        setError(null);
        try {
            const client = getUoMClient();
            const data = await client.listar();
            setUnidades(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar unidades');
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        cargarUnidades();
    }, [cargarUnidades]);

    return {
        unidades,
        cargando,
        error,
        recargar: cargarUnidades,
    };
}
