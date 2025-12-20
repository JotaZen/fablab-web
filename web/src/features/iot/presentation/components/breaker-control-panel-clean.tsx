"use client";

import { BreakerStatusPanel } from './breaker-status-panel';

export function BreakerControlPanel() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Panel de Control IoT</h2>
          <p className="text-muted-foreground">
            Control y monitoreo del interruptor inteligente conectado
          </p>
        </div>
      </div>

      {/* Main Panel */}
      <BreakerStatusPanel />
    </div>
  );
}
