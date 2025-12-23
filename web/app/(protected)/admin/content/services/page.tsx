"use client";

import { useState, useEffect } from "react";
import { useAuth, isAdmin } from "@/features/auth";
import { Plus, Search, Loader2, ShieldAlert, Star, StarOff, Pencil, Trash2, Wrench, Eye, EyeOff, MoreVertical, ExternalLink } from "lucide-react";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { Card, CardContent } from "@/shared/ui/cards/card";
import { Badge } from "@/shared/ui/misc/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/misc/dropdown-menu";
import { toast } from "sonner";
import { getServices, deleteService, toggleServiceFeatured, updateServiceStatus } from "./actions";
import type { ServiceData } from "./data";
import { ServiceForm } from "./service-form";

export default function ServicesAdminPage() {
    const { user } = useAuth();
    const [services, setServices] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceData | null>(null);

    const canManage = user && isAdmin(user);

    const loadData = async () => {
        setLoading(true);
        try {
            setServices(await getServices());
        } catch (error) {
            console.error("Error loading services:", error);
            toast.error("Error al cargar servicios");
        }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const filteredServices = services.filter((s) =>
        !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`¿Eliminar "${name}"?`)) return;
        const result = await deleteService(id);
        if (result.success) { toast.success("Eliminado"); loadData(); }
        else toast.error(result.error || "Error");
    };

    const handleToggleFeatured = async (id: string) => {
        const result = await toggleServiceFeatured(id);
        if (result.success) loadData();
        else toast.error(result.error || "Error");
    };

    const handleStatusChange = async (id: string, status: 'draft' | 'published') => {
        const result = await updateServiceStatus(id, status);
        if (result.success) loadData();
        else toast.error(result.error || "Error");
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
                    <h1 className="text-2xl font-bold text-gray-900">Servicios</h1>
                    <p className="text-gray-500">Administra los servicios del FabLab</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.open('/cms/collections/services', '_blank')}>
                        <ExternalLink className="w-4 h-4 mr-2" />Abrir en CMS
                    </Button>
                    <Button onClick={() => { setEditingService(null); setIsFormOpen(true); }} className="bg-green-600 hover:bg-green-700">
                        <Plus className="w-4 h-4 mr-2" />Nuevo
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl border p-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Buscar servicios..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-500" /></div>
            ) : filteredServices.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border">
                    <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">{services.length === 0 ? "No hay servicios" : "Sin resultados"}</h3>
                    {services.length === 0 && <Button onClick={() => setIsFormOpen(true)} className="bg-green-600">Crear Servicio</Button>}
                </div>
            ) : (
                <div className="bg-white rounded-xl border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Servicio</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredServices.map((service) => (
                                <tr key={service.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                                <Wrench className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 flex items-center gap-2">
                                                    {service.name}
                                                    {service.featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                                                </div>
                                                <div className="text-sm text-gray-500 truncate max-w-xs">{service.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge className={service.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                                            {service.status === 'published' ? 'Publicado' : 'Borrador'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button size="sm" variant="ghost"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => { setEditingService(service); setIsFormOpen(true); }}><Pencil className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleToggleFeatured(service.id)}>{service.featured ? <><StarOff className="w-4 h-4 mr-2" />Quitar destacado</> : <><Star className="w-4 h-4 mr-2" />Destacar</>}</DropdownMenuItem>
                                                {service.status !== 'published' && <DropdownMenuItem onClick={() => handleStatusChange(service.id, 'published')}><Eye className="w-4 h-4 mr-2" />Publicar</DropdownMenuItem>}
                                                {service.status === 'published' && <DropdownMenuItem onClick={() => handleStatusChange(service.id, 'draft')}><EyeOff className="w-4 h-4 mr-2" />Despublicar</DropdownMenuItem>}
                                                <DropdownMenuItem onClick={() => handleDelete(service.id, service.name)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Eliminar</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ServiceForm service={editingService} isOpen={isFormOpen} onOpenChange={setIsFormOpen} onSuccess={() => { setIsFormOpen(false); setEditingService(null); loadData(); }} />
        </div>
    );
}
