"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth, isAdmin } from "@/features/auth";
import { Plus, Search, Loader2, ShieldAlert, Star, StarOff, Pencil, Trash2, Wrench, Eye, EyeOff, MoreVertical } from "lucide-react";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { Card, CardContent } from "@/shared/ui/cards/card";
import { Badge } from "@/shared/ui/misc/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/misc/dropdown-menu";
import { toast } from "sonner";
import { getServices, deleteService, toggleServiceFeatured, updateServiceStatus, CATEGORIES, CATEGORY_LABELS, type ServiceData, type ServiceCategory } from "./actions";
import { ServiceForm } from "./service-form";

const CATEGORY_COLORS: Record<ServiceCategory, string> = {
    '3d-printing': 'bg-blue-100 text-blue-700',
    'laser-cutting': 'bg-red-100 text-red-700',
    'cnc': 'bg-purple-100 text-purple-700',
    'electronics': 'bg-green-100 text-green-700',
    'design': 'bg-pink-100 text-pink-700',
    'training': 'bg-yellow-100 text-yellow-700',
};

export default function ServicesAdminPage() {
    const { user } = useAuth();
    const [services, setServices] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | null>(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceData | null>(null);

    const canManage = user && isAdmin(user);

    const loadData = async () => {
        setLoading(true);
        setServices(await getServices());
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const filteredServices = useMemo(() => {
        return services.filter((s) => {
            const matchesSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = !categoryFilter || s.category === categoryFilter;
            const matchesStatus = statusFilter === "all" || s.status === statusFilter;
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [services, searchQuery, categoryFilter, statusFilter]);

    const stats = useMemo(() => ({
        total: services.length,
        published: services.filter(s => s.status === 'published').length,
        featured: services.filter(s => s.featured).length,
    }), [services]);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`¿Eliminar "${name}"?`)) return;
        const result = await deleteService(id);
        if (result.success) { toast.success("Eliminado"); loadData(); }
        else toast.error(result.error || "Error");
    };

    const handleToggleFeatured = async (id: string) => {
        const result = await toggleServiceFeatured(id);
        if (result.success) { toast.success("Actualizado"); loadData(); }
        else toast.error(result.error || "Error");
    };

    const handleStatusChange = async (id: string, status: 'draft' | 'published') => {
        const result = await updateServiceStatus(id, status);
        if (result.success) { toast.success("Actualizado"); loadData(); }
        else toast.error(result.error || "Error");
    };

    if (!canManage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="max-w-md"><CardContent className="p-8 text-center">
                    <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Acceso Restringido</h2>
                    <p className="text-gray-600">No tienes permisos para gestionar servicios.</p>
                </CardContent></Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Servicios</h1>
                    <p className="text-gray-500 mt-1">Administra los servicios del FabLab</p>
                </div>
                <Button onClick={() => { setEditingService(null); setIsFormOpen(true); }} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />Nuevo Servicio
                </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="text-gray-500">Total: <Badge variant="secondary">{stats.total}</Badge></span>
                <span className="text-gray-500">Publicados: <Badge className="bg-green-100 text-green-700">{stats.published}</Badge></span>
                <span className="text-gray-500">Destacados: <Badge className="bg-yellow-100 text-yellow-700">{stats.featured}</Badge></span>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input placeholder="Buscar servicios..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Button variant={categoryFilter === null ? "default" : "outline"} size="sm" onClick={() => setCategoryFilter(null)} className={categoryFilter === null ? "bg-gray-700" : ""}>Todos</Button>
                        {CATEGORIES.map((cat) => (
                            <Button key={cat} variant={categoryFilter === cat ? "default" : "outline"} size="sm" onClick={() => setCategoryFilter(cat)} className={categoryFilter === cat ? "bg-green-600" : ""}>{CATEGORY_LABELS[cat]}</Button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Button variant={statusFilter === "published" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(statusFilter === "published" ? "all" : "published")} className={statusFilter === "published" ? "bg-green-600" : ""}>
                            <Eye className="w-4 h-4 mr-1" />Publicados
                        </Button>
                        <Button variant={statusFilter === "draft" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(statusFilter === "draft" ? "all" : "draft")} className={statusFilter === "draft" ? "bg-gray-500" : ""}>
                            <EyeOff className="w-4 h-4 mr-1" />Borradores
                        </Button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-500" /></div>
            ) : filteredServices.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border">
                    <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">{services.length === 0 ? "No hay servicios" : "Sin resultados"}</h3>
                    <p className="text-gray-500 mb-6">{services.length === 0 ? "Crea tu primer servicio" : "Prueba otros filtros"}</p>
                    {services.length === 0 && <Button onClick={() => setIsFormOpen(true)} className="bg-green-600 hover:bg-green-700"><Plus className="w-4 h-4 mr-2" />Crear Servicio</Button>}
                </div>
            ) : (
                <div className="bg-white rounded-xl border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Servicio</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Categoría</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Orden</th>
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
                                        <Badge className={CATEGORY_COLORS[service.category]}>{CATEGORY_LABELS[service.category]}</Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge className={service.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                                            {service.status === 'published' ? 'Publicado' : 'Borrador'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-500">{service.order}</td>
                                    <td className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button size="sm" variant="ghost" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
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
