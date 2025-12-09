"use client";

import { useState, useEffect } from 'react';
import { Settings, Ruler, Tags, Key, type LucideIcon, Save, Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input'; // Ajusta si la ruta es diferente
import { saveVesselToken, getVesselToken } from '@/features/inventory/actions/token-settings.actions';

// Componentes de configuración
import { UnidadesMedidaSettings } from '@/features/inventory/presentation/pages/settings/uom-settings';

type SettingsTab = 'general' | 'uom' | 'taxonomia';

interface TabItem {
  id: SettingsTab;
  label: string;
  icon: LucideIcon;
}

const tabs: TabItem[] = [
  { id: 'general', label: 'General / API', icon: Key },
  { id: 'uom', label: 'Unidades de Medida', icon: Ruler },
  { id: 'taxonomia', label: 'Taxonomía', icon: Tags },
];

export default function InventorySettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <Settings className="h-6 w-6" />
          Configuración de Inventario
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administra tokens, unidades de medida y categorías
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
        {activeTab === 'general' && <GeneralSettings />}
        {activeTab === 'uom' && <UnidadesMedidaSettings />}
        {activeTab === 'taxonomia' && <TaxonomiaSettings />}
      </div>
    </div>
  );
}

function GeneralSettings() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    getVesselToken().then((val) => {
      if (val) setToken(val);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await saveVesselToken(token);
      if (res.success) {
        setMessage({ type: 'success', text: 'Token guardado exitosamente' });
      } else {
        setMessage({ type: 'error', text: res.error || 'Error desconocido' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Error de conexión' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center gap-2 p-8"><Loader2 className="animate-spin" /> Cargando configuración...</div>;

  return (
    <div className="max-w-2xl space-y-8">
      <div className="rounded-lg border p-6 space-y-4">
        <div>
          <h3 className="text-lg font-medium">Conexión con Vessel API</h3>
          <p className="text-sm text-muted-foreground">Configura el token de acceso para comunicar con el backend de inventario.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">API Token (Private Access)</label>
          <div className="flex gap-2">
            <Input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="vsl_..."
              type="password"
              className="font-mono"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Este token se usará cuando la variable de entorno no esté disponible.
          </p>
        </div>

        {message && (
          <div className={cn("p-3 rounded text-sm", message.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
            {message.text}
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar Configuración
          </Button>
        </div>
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
