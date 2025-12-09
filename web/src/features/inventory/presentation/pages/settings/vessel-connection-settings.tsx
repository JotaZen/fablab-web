"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/cards/card";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { Label } from "@/shared/ui/labels/label";
import { saveVesselToken, saveVesselUrl, getVesselToken, getVesselUrl } from "@/features/inventory/actions/token-settings.actions";
import { AlertCircle, CheckCircle2, Save, Wifi } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/feedback/alert";

export default function VesselConnectionSettings() {
    const [url, setUrl] = useState("");
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [testStatus, setTestStatus] = useState<"idle" | "success" | "error">("idle");
    const [testMessage, setTestMessage] = useState("");

    useEffect(() => {
        // Cargar config guardada
        const loadConfig = async () => {
            const savedUrl = await getVesselUrl();
            const savedToken = await getVesselToken();
            if (savedUrl) setUrl(savedUrl);
            if (savedToken) setToken(savedToken);
        };
        loadConfig();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            if (url) await saveVesselUrl(url);
            if (token) await saveVesselToken(token);
            setTestMessage("Configuración guardada correctamente.");
            setTestStatus("success");
        } catch (error) {
            setTestStatus("error");
            setTestMessage("Error al guardar la configuración.");
        } finally {
            setLoading(false);
        }
    };

    const handleTestConnection = async () => {
        setLoading(true);
        setTestStatus("idle");
        try {
            // Usar la URL ingresada o guardada para probar
            const targetUrl = url.replace(/\/$/, "");

            const res = await fetch(`${targetUrl}/api/v1/taxonomy/vocabularies/read`, {
                headers: {
                    "Content-Type": "application/json",
                    "VESSEL-ACCESS-PRIVATE": token
                }
            });

            if (res.ok) {
                setTestStatus("success");
                setTestMessage("Conexión exitosa con Vessel API.");
            } else {
                setTestStatus("error");
                setTestMessage(`Error de conexión: ${res.statusText}`);
            }
        } catch (error) {
            setTestStatus("error");
            setTestMessage("No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Conexión Vessel</h2>
                    <p className="text-muted-foreground">Configura el acceso a la API de Vessel.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Credenciales de API</CardTitle>
                    <CardDescription>
                        Define la URL base y el token de acceso privado para sincronizar con Vessel.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="vessel-url">URL de API</Label>
                        <Input
                            id="vessel-url"
                            placeholder="http://localhost:8000"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <p className="text-[0.8rem] text-muted-foreground">
                            La dirección base donde está corriendo Vessel (ej. http://127.0.0.1:8000).
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="vessel-token">Token de Acceso Privado</Label>
                        <Input
                            id="vessel-token"
                            type="password"
                            placeholder="vessel_..."
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                        <p className="text-[0.8rem] text-muted-foreground">
                            El token configurado en las variables de entorno de Vessel (VESSEL_ACCESS_PRIVATE).
                        </p>
                    </div>

                    {testStatus !== "idle" && (
                        <Alert variant={testStatus === "error" ? "destructive" : "default"} className={testStatus === "success" ? "border-green-500 text-green-700 bg-green-50" : ""}>
                            {testStatus === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            <AlertTitle>{testStatus === "success" ? "Éxito" : "Error"}</AlertTitle>
                            <AlertDescription>{testMessage}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={handleTestConnection} disabled={loading}>
                            <Wifi className="mr-2 h-4 w-4" />
                            Probar Conexión
                        </Button>
                        <Button onClick={handleSave} disabled={loading}>
                            <Save className="mr-2 h-4 w-4" />
                            Guardar Configuración
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
