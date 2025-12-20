import type { Metadata } from "next";
import {
  TuyaApiConfig,
  BreakerControlPanel,
  MessageServiceConfig,
  RefreshConfig
} from "@/features/iot";

export const metadata: Metadata = {
  title: "Control IoT - Breaker Inteligente | FabLab INACAP",
  description: "Panel de control para dispositivos IoT. Monitor y controla tu breaker inteligente Tuya desde una interfaz web moderna.",
  keywords: ["IoT", "Tuya", "breaker", "control", "smart switch", "FabLab"],
};

export default function ControlIoTPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8 space-y-8">


        {/* Main Content */}
        <div className="flex flex-col xl:flex-row gap-6 mt-20">
          {/* Configuration Panel - Left sidebar */}
          <div className="xl:w-1/4 w-full space-y-4">
            <TuyaApiConfig />
            <MessageServiceConfig />
            <RefreshConfig />
          </div>

          {/* Control Panel - Right main area */}
          <div className="xl:w-3/4 w-full">
            <BreakerControlPanel />
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-muted-foreground bg-muted/30 p-6 rounded-lg">
          <p className="font-medium mb-2">🔧 Panel de Control IoT - FabLab INACAP</p>
          <p>
            Esta herramienta permite el control remoto de dispositivos IoT compatibles con Tuya.
            Todos los datos se procesan localmente para garantizar la seguridad.
          </p>
        </div>
      </div>
    </div>
  );
}
