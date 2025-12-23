"use client";

import { Label } from '@/shared/ui/labels/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/inputs/select';
import {
    FEATURE_MODULES,
    FULL_MODULE_ACCESS,
    type FeatureModule,
    type AccessLevel,
    type UserModuleAccess
} from '@/features/auth/domain/value-objects/permission';
import {
    Package,
    Globe,
    FileText,
    Users,
    Settings,
    type LucideIcon
} from 'lucide-react';

interface FeatureModulesSelectorProps {
    moduleAccess: UserModuleAccess;
    onChange: (access: UserModuleAccess) => void;
    disabled?: boolean;
    /** Si es super_admin, muestra todo habilitado sin permitir cambios */
    isSuperAdmin?: boolean;
}

/** Mapeo de nombre de icono a componente */
const ICON_MAP: Record<string, LucideIcon> = {
    Package,
    Globe,
    FileText,
    Users,
    Settings,
};

/**
 * Selector de niveles de acceso por módulo usando dropdowns
 */
export function FeatureModulesSelector({
    moduleAccess,
    onChange,
    disabled = false,
    isSuperAdmin = false,
}: FeatureModulesSelectorProps) {

    const handleChange = (moduleKey: FeatureModule, level: AccessLevel) => {
        if (disabled || isSuperAdmin) return;
        onChange({
            ...moduleAccess,
            [moduleKey]: level,
        });
    };

    const moduleEntries = Object.entries(FEATURE_MODULES) as [FeatureModule, typeof FEATURE_MODULES[FeatureModule]][];

    // Si es super admin, mostrar mensaje de acceso completo
    if (isSuperAdmin) {
        return (
            <div className="space-y-2">
                <Label className="text-sm font-medium">Acceso a Módulos</Label>
                <p className="text-xs bg-green-50 text-green-700 px-3 py-2 rounded-md border border-green-200">
                    Super Administrador: Acceso completo a todos los módulos
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <Label className="text-sm font-medium">Acceso a Módulos</Label>
            <div className="grid gap-2">
                {moduleEntries.map(([key, module]) => {
                    const Icon = ICON_MAP[module.icon] || Package;
                    const currentLevel = moduleAccess[key] || 'none';

                    return (
                        <div
                            key={key}
                            className="flex items-center gap-3 p-2 rounded-lg border bg-gray-50/50"
                        >
                            <Icon className="h-4 w-4 text-gray-500 shrink-0" />
                            <span className="text-sm font-medium min-w-[90px]">{module.name}</span>
                            <Select
                                value={currentLevel}
                                onValueChange={(value) => handleChange(key, value as AccessLevel)}
                                disabled={disabled}
                            >
                                <SelectTrigger className="h-8 text-xs flex-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {module.accessLevels.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                            className="text-xs"
                                        >
                                            <span>{option.label}</span>
                                            {option.description && (
                                                <span className="text-muted-foreground ml-1">
                                                    - {option.description}
                                                </span>
                                            )}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
