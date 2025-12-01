"use client";

import { useState } from 'react';
import { Settings, Ruler, Tags, type LucideIcon } from 'lucide-react';
import { cn } from '@/shared/utils';

// Componentes de configuración
import { UnidadesMedidaSettings } from '@/features/inventory/presentation/pages/settings/uom-settings';

type SettingsTab = 'uom' | 'taxonomia';

interface TabItem {
  id: SettingsTab;
  label: string;
  icon: LucideIcon;
}

const tabs: TabItem[] = [
  { id: 'uom', label: 'Unidades de Medida', icon: Ruler },
  { id: 'taxonomia', label: 'Taxonomía', icon: Tags },
];

export default function InventorySettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('uom');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <Settings className="h-6 w-6" />
          Configuración de Inventario
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administra unidades de medida, categorías y otras configuraciones
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex gap-4" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'uom' && <UnidadesMedidaSettings />}
        {activeTab === 'taxonomia' && <TaxonomiaSettings />}
      </div>
    </div>
  );
}

// Placeholder para taxonomía
function TaxonomiaSettings() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-muted-foreground">
      <Tags className="h-12 w-12 mb-4 opacity-50" />
      <h2 className="text-lg font-medium">Taxonomía</h2>
      <p className="text-sm">Gestión de categorías y clasificaciones - Próximamente</p>
    </div>
  );
}
