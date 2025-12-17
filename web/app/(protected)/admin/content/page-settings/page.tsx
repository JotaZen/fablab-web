"use client";

import { useState, useEffect } from "react";
import { useAuth, isAdmin } from "@/features/auth";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/cards/card";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { Label } from "@/shared/ui/labels/label";
import { Textarea } from "@/shared/ui/inputs/textarea";
import { getPageSettings, updatePageSettings } from "./actions";
import { toast } from "sonner";


export default function PageSettingsAdmin() {
    const { user, isLoading: authLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        heroTitle: "",
        heroDescription: "",
        heroStats: [] as { text: string; icon: string }[],
    });

    useEffect(() => {
        if (user && isAdmin(user)) {
            loadSettings();
        }
    }, [user]);

    const loadSettings = async () => {
        try {
            const data = await getPageSettings();
            setFormData({
                heroTitle: data.heroTitle || "",
                heroDescription: data.heroDescription || "",
                heroStats: data.heroStats || [],
            });
        } catch (error) {
            console.error("Error loading settings:", error);
            toast.error("Error al cargar configuración");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updatePageSettings(formData);
            toast.success("Configuración guardada correctamente");
        } catch (error) {
            console.error("Error saving settings:", error);
            toast.error("Error al guardar cambios");
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading || isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-gray-400" /></div>;

    if (!user || !isAdmin(user)) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Acceso Denegado</h2>
                        <p className="text-muted-foreground">
                            No tienes permisos para acceder a esta sección.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Configuración de Página Equipo</h1>
                    <p className="text-muted-foreground">
                        Edita los textos y configuraciones globales de la página.
                    </p>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar Cambios
                </Button>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Hero Section</CardTitle>
                        <CardDescription>Personaliza el encabezado principal de la página.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título Principal</Label>
                            <Input
                                id="title"
                                value={formData.heroTitle}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, heroTitle: e.target.value })}
                                placeholder="Ej: Las personas detrás de FabLab"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                value={formData.heroDescription}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, heroDescription: e.target.value })}
                                placeholder="Descripción corta del equipo..."
                                rows={4}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
