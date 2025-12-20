"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/misc/dialog";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { Label } from "@/shared/ui/labels/label";
import { Textarea } from "@/shared/ui/inputs/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/inputs/select";
import { Switch } from "@/shared/ui/misc/switch";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createService, updateService, CATEGORIES, CATEGORY_LABELS, type ServiceData, type ServiceCategory } from "./actions";

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
                toast.success(isEditing ? "Servicio actualizado" : "Servicio creado");
                onSuccess();
            } else {
                toast.error(result.error || "Error");
            }
        } catch (error) {
            toast.error("Error inesperado");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Servicio" : "Nuevo Servicio"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nombre del Servicio *</Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            defaultValue={service?.name}
                            placeholder="Ej: Impresión 3D FDM"
                        />
                    </div>

                    <div>
                        <Label htmlFor="category">Categoría *</Label>
                        <Select name="category" defaultValue={service?.category || '3d-printing'}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {CATEGORY_LABELS[cat]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="description">Descripción *</Label>
                        <Textarea
                            id="description"
                            name="description"
                            required
                            defaultValue={service?.description}
                            placeholder="Describe el servicio..."
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="icon">Icono (Lucide)</Label>
                        <Input
                            id="icon"
                            name="icon"
                            defaultValue={service?.icon}
                            placeholder="Ej: Printer, Cpu, Scissors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="status">Estado</Label>
                            <Select name="status" defaultValue={service?.status || 'draft'}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Borrador</SelectItem>
                                    <SelectItem value="published">Publicado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="order">Orden</Label>
                            <Input
                                id="order"
                                name="order"
                                type="number"
                                defaultValue={service?.order || 0}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Switch
                            id="featured"
                            name="featured"
                            defaultChecked={service?.featured}
                            value="true"
                        />
                        <Label htmlFor="featured">Destacado</Label>
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
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
