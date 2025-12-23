"use client";

import { useState, useEffect } from "react";
import { useAuth, isAdmin } from "@/features/auth";
import { Plus, Search, Loader2, ShieldAlert, Pencil, Trash2, Cpu, MoreVertical, ExternalLink } from "lucide-react";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { Card, CardContent } from "@/shared/ui/cards/card";
import { Badge } from "@/shared/ui/misc/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/misc/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/misc/dialog";
import { Label } from "@/shared/ui/labels/label";
import { Textarea } from "@/shared/ui/inputs/textarea";
import { toast } from "sonner";
import { getEquipment, createEquipment, updateEquipment, deleteEquipment } from "./actions";
import { STATUS_LABELS, type EquipmentData } from "./data";

const STATUS_COLORS: Record<string, string> = {
    available: 'bg-green-100 text-green-700',
    maintenance: 'bg-yellow-100 text-yellow-700',
    'out-of-service': 'bg-red-100 text-red-700',
};

export default function EquipmentAdminPage() {
    const { user } = useAuth();
    const [equipment, setEquipment] = useState<EquipmentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState<EquipmentData | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    const canManage = user && isAdmin(user);

    const loadData = async () => {
        setLoading(true);
        try { setEquipment(await getEquipment()); }
        catch { toast.error("Error al cargar"); }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const filteredEquipment = equipment.filter((e) =>
        !searchQuery || e.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`¿Eliminar "${name}"?`)) return;
        const result = await deleteEquipment(id);
        if (result.success) { toast.success("Eliminado"); loadData(); }
        else toast.error(result.error || "Error");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormLoading(true);
        const formData = new FormData(e.currentTarget);
        const result = editingEquipment ? await updateEquipment(editingEquipment.id, formData) : await createEquipment(formData);
        if (result.success) {
            toast.success(editingEquipment ? "Actualizado" : "Creado");
            setIsFormOpen(false);
            setEditingEquipment(null);
            loadData();
        } else toast.error(result.error || "Error");
        setFormLoading(false);
    };

    if (!canManage) {
        return (
            <div className="flex items-center justify-center py-20">
                <Card className="max-w-md"><CardContent className="p-8 text-center">
                    <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold">Acceso Restringido</h2>
                </CardContent></Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Equipamiento</h1>
                    <p className="text-gray-500">Máquinas y herramientas del FabLab</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.open('/cms/collections/equipment', '_blank')}>
                        <ExternalLink className="w-4 h-4 mr-2" />CMS
                    </Button>
                    <Button onClick={() => { setEditingEquipment(null); setIsFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />Nuevo
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl border p-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Buscar equipo..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
            ) : filteredEquipment.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border">
                    <Cpu className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay equipos</h3>
                    <Button onClick={() => setIsFormOpen(true)} className="bg-blue-600">Crear Equipo</Button>
                </div>
            ) : (
                <div className="bg-white rounded-xl border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Equipo</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredEquipment.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-900">{item.name}</div>
                                        <div className="text-sm text-gray-500">{item.brand} {item.model}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge className={STATUS_COLORS[item.status] || 'bg-gray-100'}>{STATUS_LABELS[item.status] || item.status}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button size="sm" variant="ghost"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => { setEditingEquipment(item); setIsFormOpen(true); }}><Pencil className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => window.open(`/cms/collections/equipment/${item.id}`, '_blank')}><ExternalLink className="w-4 h-4 mr-2" />Abrir en CMS</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(item.id, item.name)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Eliminar</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader><DialogTitle>{editingEquipment ? "Editar Equipo" : "Nuevo Equipo"}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div><Label>Nombre *</Label><Input name="name" required defaultValue={editingEquipment?.name} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Marca</Label><Input name="brand" defaultValue={editingEquipment?.brand} /></div>
                            <div><Label>Modelo</Label><Input name="model" defaultValue={editingEquipment?.model} /></div>
                        </div>
                        <div><Label>Descripción *</Label><Textarea name="description" required defaultValue={editingEquipment?.description} rows={2} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Categoría *</Label>
                                <select name="category" defaultValue={editingEquipment?.category || '3d-printer'} className="w-full h-10 rounded-md border px-3">
                                    <option value="3d-printer">Impresora 3D</option>
                                    <option value="laser-cutter">Cortadora Láser</option>
                                    <option value="cnc">CNC</option>
                                    <option value="electronics">Electrónica</option>
                                    <option value="hand-tools">Herramientas Manuales</option>
                                    <option value="3d-scanner">Escáner 3D</option>
                                    <option value="other">Otro</option>
                                </select>
                            </div>
                            <div>
                                <Label>Estado</Label>
                                <select name="status" defaultValue={editingEquipment?.status || 'available'} className="w-full h-10 rounded-md border px-3">
                                    <option value="available">Disponible</option>
                                    <option value="maintenance">En Mantenimiento</option>
                                    <option value="out-of-service">Fuera de Servicio</option>
                                </select>
                            </div>
                        </div>
                        <div><Label>Ubicación</Label><Input name="location" defaultValue={editingEquipment?.location} /></div>
                        <div className="flex gap-2 justify-end pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={formLoading} className="bg-blue-600">{formLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{editingEquipment ? "Guardar" : "Crear"}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
