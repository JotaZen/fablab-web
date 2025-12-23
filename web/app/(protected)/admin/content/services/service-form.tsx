"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/misc/dialog";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { Label } from "@/shared/ui/labels/label";
import { Textarea } from "@/shared/ui/inputs/textarea";
import { Switch } from "@/shared/ui/misc/switch";
import { Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { createService, updateService } from "./actions";
import type { ServiceData } from "./data";

interface ServiceFormProps {
    service: ServiceData | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ServiceForm({ service, isOpen, onOpenChange, onSuccess }: ServiceFormProps) {
    const [loading, setLoading] = useState(false);
    const isEditing = !!service;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            const result = isEditing
                ? await updateService(service.id, formData)
                : await createService(formData);

            if (result.success) {
                toast.success(isEditing ? "Actualizado" : "Creado");
                onSuccess();
            } else {
                toast.error(result.error || "Error");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado");
        }
        setLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Servicio" : "Nuevo Servicio"}</DialogTitle>
                    <DialogDescription>
                        Para editar todos los campos, usa el CMS de Payload
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Nombre *</Label>
                        <Input name="name" required defaultValue={service?.name} />
                    </div>

                    <div>
                        <Label>Descripción *</Label>
                        <Textarea name="description" required defaultValue={service?.description} rows={3} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Estado</Label>
                            <select name="status" defaultValue={service?.status || 'draft'} className="w-full h-10 rounded-md border px-3">
                                <option value="draft">Borrador</option>
                                <option value="published">Publicado</option>
                            </select>
                        </div>
                        <div>
                            <Label>Orden</Label>
                            <Input name="order" type="number" defaultValue={service?.order || 0} />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Switch name="featured" defaultChecked={service?.featured} value="true" />
                        <Label>Destacado</Label>
                    </div>

                    <div className="flex gap-2 justify-end pt-4 border-t">
                        {isEditing && (
                            <Button type="button" variant="outline" onClick={() => window.open(`/cms/collections/services/${service.id}`, '_blank')}>
                                <ExternalLink className="w-4 h-4 mr-2" />Editar en CMS
                            </Button>
                        )}
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isEditing ? "Guardar" : "Crear"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
