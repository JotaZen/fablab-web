/**
 * QuantityInput - Input numérico con botones +/-
 * 
 * Incrementos respetan la unidad de medida:
 * - Unidades (un, pz): +1/-1
 * - Kilogramos (kg): +0.1/-0.1
 * - Metros (m): +0.5/-0.5
 * - Litros (L): +0.1/-0.1
 */

"use client";

import { useState, useCallback } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

/** Configuración de incrementos por categoría de UoM */
const INCREMENTOS_UOM: Record<string, number> = {
    // Unidades discretas - incremento de 1
    'un': 1,
    'pz': 1,
    'pieza': 1,
    'unidad': 1,

    // Peso - incremento de 0.1
    'kg': 0.1,
    'g': 1,
    'lb': 0.1,

    // Longitud - incremento de 0.5
    'm': 0.5,
    'cm': 1,
    'mm': 10,

    // Volumen - incremento de 0.1
    'L': 0.1,
    'ml': 10,

    // Default
    'default': 1,
};

/** Determina los decimales a mostrar según el incremento */
function getDecimales(incremento: number): number {
    if (incremento >= 1) return 0;
    if (incremento >= 0.1) return 1;
    if (incremento >= 0.01) return 2;
    return 3;
}

interface QuantityInputProps {
    value: number;
    onChange: (value: number) => void;
    /** Símbolo de la unidad de medida (ej: "kg", "un") */
    uomSimbolo?: string;
    /** Valor mínimo permitido */
    min?: number;
    /** Valor máximo permitido */
    max?: number;
    /** Incremento personalizado (override del default por UoM) */
    step?: number;
    /** Deshabilitar el input */
    disabled?: boolean;
    /** Clase CSS adicional */
    className?: string;
    /** Mostrar advertencia de exceder máximo */
    showMaxWarning?: boolean;
    /** Placeholder */
    placeholder?: string;
}

export function QuantityInput({
    value,
    onChange,
    uomSimbolo = 'un',
    min = 0,
    max,
    step,
    disabled = false,
    className,
    showMaxWarning = false,
    placeholder = '0',
}: QuantityInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    // Determinar incremento basado en UoM o step personalizado
    const incremento = step ?? INCREMENTOS_UOM[uomSimbolo.toLowerCase()] ?? INCREMENTOS_UOM['default'];
    const decimales = getDecimales(incremento);

    // Validar y redondear valor
    const roundValue = useCallback((val: number): number => {
        const rounded = Math.round(val / incremento) * incremento;
        return Number(rounded.toFixed(decimales));
    }, [incremento, decimales]);

    // Incrementar
    const handleIncrement = useCallback(() => {
        const newValue = roundValue(value + incremento);
        if (max !== undefined && newValue > max) return;
        onChange(newValue);
    }, [value, incremento, max, onChange, roundValue]);

    // Decrementar
    const handleDecrement = useCallback(() => {
        const newValue = roundValue(value - incremento);
        if (newValue < min) return;
        onChange(newValue);
    }, [value, incremento, min, onChange, roundValue]);

    // Cambio manual
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        if (rawValue === '') {
            onChange(0);
            return;
        }

        const parsed = parseFloat(rawValue);
        if (!isNaN(parsed)) {
            let newValue = parsed;
            if (newValue < min) newValue = min;
            if (max !== undefined && newValue > max) newValue = max;
            onChange(newValue);
        }
    }, [min, max, onChange]);

    // Validar al perder foco
    const handleBlur = useCallback(() => {
        setIsFocused(false);
        onChange(roundValue(value));
    }, [value, onChange, roundValue]);

    const excedeMax = max !== undefined && value > max;

    return (
        <div className={cn("flex items-center gap-1", className)}>
            {/* Botón decrementar */}
            <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0"
                onClick={handleDecrement}
                disabled={disabled || value <= min}
            >
                <Minus className="h-4 w-4" />
            </Button>

            {/* Input numérico */}
            <div className="relative flex-1">
                <Input
                    type="number"
                    value={isFocused ? value : value.toFixed(decimales)}
                    onChange={handleInputChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={handleBlur}
                    min={min}
                    max={max}
                    step={incremento}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={cn(
                        "text-center text-lg font-medium h-10",
                        "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                        uomSimbolo && "pr-10",
                        excedeMax && showMaxWarning && "border-amber-500 bg-amber-50"
                    )}
                />
                {/* Símbolo UoM */}
                {uomSimbolo && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {uomSimbolo}
                    </span>
                )}
            </div>

            {/* Botón incrementar */}
            <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0"
                onClick={handleIncrement}
                disabled={disabled || (max !== undefined && value >= max)}
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
}
