"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth, isAdmin } from "@/features/auth";
import { Plus, Search, Loader2, ShieldAlert, Pencil, Trash2, Cpu, MoreVertical, GraduationCap, MapPin } from "lucide-react";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { Card, CardContent } from "@/shared/ui/cards/card";
import { Badge } from "@/shared/ui/misc/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/misc/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/misc/dialog";
import { Label } from "@/shared/ui/labels/label";
import { Textarea } from "@/shared/ui/inputs/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/inputs/select";
import { Switch } from "@/shared/ui/misc/switch";
import { toast } from "sonner";
import { getEquipment, createEquipment, updateEquipment, deleteEquipment, EQUIPMENT_CATEGORIES, EQUIPMENT_STATUS, type EquipmentData } from "./actions";

const STATUS_COLORS: Record<string, string> = {
    available: 'bg-green-100 text-green-700',
    maintenance: 'bg-yellow-100 text-yellow-700',
    'out-of-service': 'bg-red-100 text-red-700',
};

const CATEGORY_COLORS: Record<string, string> = {
    '3d-printer': 'bg-blue-100 text-blue-700',
    'laser-cutter': 'bg-red-100 text-red-700',
    'cnc': 'bg-purple-100 text-purple-700',
    'electronics': 'bg-green-100 text-green-700',
    'hand-tools': 'bg-gray-100 text-gray-700',
    '3d-scanner': 'bg-cyan-100 text-cyan-700',
    'other': 'bg-gray-100 text-gray-700',
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
        setEquipment(await getEquipment());
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const filteredEquipment = useMemo(() => {
        return equipment.filter((e) => {
            return !searchQuery || e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.description.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [equipment, searchQuery]);

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
        } else {
            toast.error(result.error || "Error");
        }
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
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Equipamiento</h1>
                    <p className="text-gray-500">Máquinas y herramientas del FabLab</p>
                </div>
                <Button onClick={() => { setEditingEquipment(null); setIsFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />Nuevo Equipo
                </Button>
            </div>

            <div className="bg-white rounded-xl border p-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Buscar equipos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
            ) : filteredEquipment.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border">
                    <Cpu className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay equipos</h3>
                    <Button onClick={() => setIsFormOpen(true)} className="bg-blue-600"><Plus className="w-4 h-4 mr-2" />Crear Equipo</Button>
                </div>
            ) : (
                <div className="bg-white rounded-xl border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Equipo</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Categoría</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Ubicación</th>
                                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredEquipment.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <Cpu className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 flex items-center gap-2">
                                                    {item.name}
                                                    {item.requiresTraining && <span title="Requiere capacitación"><GraduationCap className="w-4 h-4 text-orange-500" /></span>}
                                                </div>
                                                <div className="text-sm text-gray-500">{item.brand} {item.model}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"><Badge className={CATEGORY_COLORS[item.category]}>{EQUIPMENT_CATEGORIES[item.category as keyof typeof EQUIPMENT_CATEGORIES]}</Badge></td>
                                    <td className="px-4 py-3"><Badge className={STATUS_COLORS[item.status]}>{EQUIPMENT_STATUS[item.status]}</Badge></td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {item.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</span>}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button size="sm" variant="ghost"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => { setEditingEquipment(item); setIsFormOpen(true); }}><Pencil className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
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
                        <div><Label>Categoría *</Label>
                            <Select name="category" defaultValue={editingEquipment?.category || '3d-printer'}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(EQUIPMENT_CATEGORIES).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div><Label>Descripción *</Label><Textarea name="description" required defaultValue={editingEquipment?.description} rows={2} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Estado</Label>
                                <Select name="status" defaultValue={editingEquipment?.status || 'available'}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(EQUIPMENT_STATUS).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div><Label>Ubicación</Label><Input name="location" defaultValue={editingEquipment?.location} placeholder="Sala 1..." /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Orden</Label><Input name="order" type="number" defaultValue={editingEquipment?.order || 0} /></div>
                            <div className="flex items-center gap-2 pt-6"><Switch name="requiresTraining" defaultChecked={editingEquipment?.requiresTraining} value="true" /><Label>Requiere Capacitación</Label></div>
                        </div>
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
