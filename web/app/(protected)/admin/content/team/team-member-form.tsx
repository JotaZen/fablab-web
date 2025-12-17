"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { Label } from "@/shared/ui/labels/label";
import { Textarea } from "@/shared/ui/inputs/textarea";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/shared/ui/misc/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/inputs/select";
import { createTeamMember, updateTeamMember } from "./actions";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

interface TeamMemberFormProps {
    member?: any;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function TeamMemberForm({ member, isOpen, onOpenChange, onSuccess }: TeamMemberFormProps) {
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (member) {
            setImagePreview(member.image || null);
        } else {
            setImagePreview(null);
        }
    }, [member]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            if (member?.id) {
                await updateTeamMember(member.id, formData);
                toast.success("Miembro actualizado exitosamente");
            } else {
                const file = formData.get('image') as File;
                if (!file || file.size === 0) {
                    toast.error("Debes subir una foto para el nuevo miembro");
                    setLoading(false);
                    return;
                }
                await createTeamMember(formData);
                toast.success("Miembro creado exitosamente");
            }
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar los datos");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImagePreview(url);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col h-full bg-white">
                <SheetHeader className="px-8 py-6 border-b border-gray-100 flex-none bg-white z-10">
                    <SheetTitle className="text-xl font-bold">{member ? "Editar Miembro" : "Nuevo Talento"}</SheetTitle>
                    <SheetDescription className="text-base text-gray-500">
                        Completa la ficha profesional. Todos los campos marcados son relevantes para la web.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">

                        {/* Image Upload Section */}
                        <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                            <Label className="text-base font-medium mb-4 block">Foto de Perfil</Label>
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                {imagePreview ? (
                                    <div className="relative w-40 h-40 rounded-xl overflow-hidden shadow-sm border border-gray-200 shrink-0 group">
                                        <Image src={imagePreview} alt="Preview" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg transform hover:scale-110"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-40 h-40 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-white hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-all shrink-0 gap-3 group"
                                    >
                                        <div className="p-3 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors">
                                            <Upload className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">Subir foto</span>
                                    </div>
                                )}

                                <div className="flex-1 space-y-3 pt-2 w-full text-center sm:text-left">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Requisitos de imagen</h4>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Recomendamos una imagen cuadrada (1:1) de al menos 500x500px.
                                            Formatos: JPG, PNG. Máx 2MB.
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="mt-2"
                                    >
                                        Seleccionar archivo
                                    </Button>
                                    <Input
                                        ref={fileInputRef}
                                        id="image"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2.5">
                                    <Label htmlFor="name" className="text-sm font-medium">Nombre Completo</Label>
                                    <Input id="name" name="name" defaultValue={member?.name} required placeholder="Ej: Marcela Silva" className="h-11 bg-gray-50/30 focus:bg-white transition-colors" />
                                </div>
                                <div className="space-y-2.5">
                                    <Label htmlFor="role" className="text-sm font-medium">Cargo / Puesto</Label>
                                    <Input id="role" name="role" defaultValue={member?.role} required placeholder="Ej: Coordinadora de Proyectos" className="h-11 bg-gray-50/30 focus:bg-white transition-colors" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2.5">
                                    <Label htmlFor="category" className="text-sm font-medium">Categoría Organizacional</Label>
                                    <Select name="category" defaultValue={member?.category || "specialist"}>
                                        <SelectTrigger className="h-11 bg-gray-50/30 focus:bg-white transition-colors">
                                            <SelectValue placeholder="Selecciona una categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="leadership">Liderazgo & Dirección</SelectItem>
                                            <SelectItem value="specialist">Especialistas Técnicos</SelectItem>
                                            <SelectItem value="collaborator">Colaboradores & Staff</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2.5">
                                    <Label htmlFor="specialty" className="text-sm font-medium">Especialidad Principal</Label>
                                    <Input id="specialty" name="specialty" defaultValue={member?.specialty} placeholder="Ej: Fabricación Digital" className="h-11 bg-gray-50/30 focus:bg-white transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <Label htmlFor="experience" className="text-sm font-medium">Experiencia / Trayectoria</Label>
                                <Input id="experience" name="experience" defaultValue={member?.experience} placeholder="Ej: 8 años liderando proyectos de innovación social..." className="h-11 bg-gray-50/30 focus:bg-white transition-colors" />
                            </div>

                            <div className="space-y-2.5">
                                <Label htmlFor="bio" className="text-sm font-medium">Biografía Pública</Label>
                                <Textarea id="bio" name="bio" defaultValue={member?.bio} rows={5} placeholder="Escribe un breve perfil profesional que aparecerá en la web..." className="bg-gray-50/30 focus:bg-white transition-colors resize-none p-3 leading-relaxed" />
                                <p className="text-xs text-muted-foreground text-right">Máx. 300 caracteres recomendados</p>
                            </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Label className="text-base font-medium">Presencia Digital</Label>
                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium">Opcional</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2.5">
                                    <Label htmlFor="email" className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Email de Contacto</Label>
                                    <Input id="email" name="email" defaultValue={member?.social?.email} placeholder="nombre@fablab.com" className="h-10 text-sm" />
                                </div>
                                <div className="space-y-2.5">
                                    <Label htmlFor="linkedin" className="text-xs uppercase tracking-wider text-gray-500 font-semibold">LinkedIn</Label>
                                    <Input id="linkedin" name="linkedin" defaultValue={member?.social?.linkedin} placeholder="URL del perfil" className="h-10 text-sm" />
                                </div>
                                <div className="space-y-2.5">
                                    <Label htmlFor="github" className="text-xs uppercase tracking-wider text-gray-500 font-semibold">GitHub / Portfolio</Label>
                                    <Input id="github" name="github" defaultValue={member?.social?.github} placeholder="URL del portfolio" className="h-10 text-sm" />
                                </div>
                                <div className="space-y-2.5">
                                    <Label htmlFor="twitter" className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Twitter / X</Label>
                                    <Input id="twitter" name="twitter" defaultValue={member?.social?.twitter} placeholder="@usuario" className="h-10 text-sm" />
                                </div>
                            </div>
                        </div>

                        <SheetFooter className="py-6 border-t border-gray-100 flex-none bg-white">
                            <div className="flex w-full gap-4 items-center justify-end">
                                <Button variant="ghost" onClick={() => onOpenChange(false)} type="button" className="h-11 px-6 text-gray-500 hover:text-gray-900">
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={loading} className="h-11 px-8 bg-zinc-900 hover:bg-zinc-800 text-white min-w-[140px]">
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {member ? "Guardar Cambios" : "Crear Ficha"}
                                </Button>
                            </div>
                        </SheetFooter>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    );
}
