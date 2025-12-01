"use client";

import { useState } from 'react';
import { Settings, Ruler, Tags, ChevronRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/shared/utils';

// Componentes de configuración
import { UnidadesMedidaSettings } from '@/features/inventory/presentation/pages/settings/uom-settings';

type SettingsSection = 'uom' | 'taxonomia';

interface MenuItem {
  id: SettingsSection;
  label: string;
  description: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  {
    id: 'uom',
    label: 'Unidades de Medida',
    description: 'Gestiona las unidades de medida y conversiones',
    icon: Ruler,
  },
  {
    id: 'taxonomia',
    label: 'Taxonomía',
    description: 'Categorías y clasificaciones de productos',
    icon: Tags,
  },
];

export default function InventorySettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('uom');

  return (
    <div className="flex h-full">
      {/* Sidebar de navegación */}
      <aside className="w-72 border-r bg-card/50 p-4">
        <div className="mb-6 flex items-center gap-2 px-2">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-lg font-semibold">Configuración</h1>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium truncate",
                    isActive && "text-primary-foreground"
                  )}>
                    {item.label}
                  </p>
                  <p className={cn(
                    "text-xs truncate",
                    isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {item.description}
                  </p>
                </div>
                <ChevronRight className={cn(
                  "h-4 w-4 shrink-0 transition-transform",
                  isActive ? "rotate-90" : ""
                )} />
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-auto p-6">
        {activeSection === 'uom' && <UnidadesMedidaSettings />}
        {activeSection === 'taxonomia' && <TaxonomiaSettings />}
      </main>
    </div>
  );
}

// Placeholder para taxonomía (se implementa después)
function TaxonomiaSettings() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
      <Tags className="h-12 w-12 mb-4 opacity-50" />
      <h2 className="text-lg font-medium">Taxonomía</h2>
      <p className="text-sm">Próximamente...</p>
    </div>
  );
}
