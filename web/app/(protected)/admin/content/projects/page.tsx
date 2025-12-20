"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth, isAdmin } from "@/features/auth";
import Image from "next/image";
import { Plus, Search, Loader2, ShieldAlert, Star, StarOff, Pencil, Trash2, FolderOpen, Eye, EyeOff, MoreVertical } from "lucide-react";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { Card, CardContent } from "@/shared/ui/cards/card";
import { Badge } from "@/shared/ui/misc/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/misc/dropdown-menu";
import { toast } from "sonner";
import { getProjects, deleteProject, toggleProjectFeatured, updateProjectStatus, CATEGORIES, type ProjectData } from "./actions";
import { ProjectForm } from "./project-form";

const CATEGORY_COLORS: Record<string, string> = {
    'Hardware': 'bg-blue-100 text-blue-700',
    'Software': 'bg-purple-100 text-purple-700',
    'Diseño': 'bg-pink-100 text-pink-700',
    'IoT': 'bg-green-100 text-green-700',
};

export default function ProjectsAdminPage() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<ProjectData | null>(null);

    const canManage = user && isAdmin(user);

    const loadData = async () => {
        setLoading(true);
        setProjects(await getProjects());
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const filteredProjects = useMemo(() => {
        return projects.filter((p) => {
            const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = !categoryFilter || p.category === categoryFilter;
            const matchesStatus = statusFilter === "all" || p.status === statusFilter;
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [projects, searchQuery, categoryFilter, statusFilter]);

    const stats = useMemo(() => ({
        total: projects.length,
        published: projects.filter(p => p.status === 'published').length,
        featured: projects.filter(p => p.featured).length,
    }), [projects]);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`¿Eliminar "${title}"?`)) return;
        const result = await deleteProject(id);
        if (result.success) { toast.success("Eliminado"); loadData(); }
        else toast.error(result.error || "Error");
    };

    const handleToggleFeatured = async (id: string) => {
        const result = await toggleProjectFeatured(id);
        if (result.success) { toast.success("Actualizado"); loadData(); }
        else toast.error(result.error || "Error");
    };

    const handleStatusChange = async (id: string, status: 'draft' | 'published') => {
        const result = await updateProjectStatus(id, status);
        if (result.success) { toast.success("Actualizado"); loadData(); }
        else toast.error(result.error || "Error");
    };

    if (!canManage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="max-w-md"><CardContent className="p-8 text-center">
                    <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Acceso Restringido</h2>
                    <p className="text-gray-600">No tienes permisos para gestionar proyectos.</p>
                </CardContent></Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Gestión de Proyectos</h1>
                            <p className="text-gray-500 mt-1">Administra los proyectos del FabLab</p>
                        </div>
                        <Button onClick={() => { setEditingProject(null); setIsFormOpen(true); }} className="bg-orange-500 hover:bg-orange-600">
                            <Plus className="w-4 h-4 mr-2" />Nuevo Proyecto
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                    <span className="text-gray-500">Total: <Badge variant="secondary">{stats.total}</Badge></span>
                    <span className="text-gray-500">Publicados: <Badge className="bg-green-100 text-green-700">{stats.published}</Badge></span>
                    <span className="text-gray-500">Destacados: <Badge className="bg-orange-100 text-orange-700">{stats.featured}</Badge></span>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input placeholder="Buscar proyectos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Button variant={categoryFilter === null ? "default" : "outline"} size="sm" onClick={() => setCategoryFilter(null)} className={categoryFilter === null ? "bg-gray-700" : ""}>Todos</Button>
                            {CATEGORIES.map((cat) => (
                                <Button key={cat} variant={categoryFilter === cat ? "default" : "outline"} size="sm" onClick={() => setCategoryFilter(cat)} className={categoryFilter === cat ? "bg-orange-500" : ""}>{cat}</Button>
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
                    <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border">
                        <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">{projects.length === 0 ? "No hay proyectos" : "Sin resultados"}</h3>
                        <p className="text-gray-500 mb-6">{projects.length === 0 ? "Crea tu primer proyecto" : "Prueba otros filtros"}</p>
                        {projects.length === 0 && <Button onClick={() => setIsFormOpen(true)} className="bg-orange-500 hover:bg-orange-600"><Plus className="w-4 h-4 mr-2" />Crear Proyecto</Button>}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                                <div className="relative aspect-video bg-gray-100">
                                    {project.featuredImage ? <Image src={project.featuredImage} alt={project.title} fill className="object-cover" /> : <div className="absolute inset-0 flex items-center justify-center"><FolderOpen className="w-16 h-16 text-gray-300" /></div>}
                                    <div className="absolute top-2 left-2 flex gap-2">
                                        {project.featured && <Badge className="bg-orange-500 text-white"><Star className="w-3 h-3 mr-1" />Destacado</Badge>}
                                        <Badge className={project.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>{project.status === 'published' ? 'Publicado' : 'Borrador'}</Badge>
                                    </div>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button size="sm" variant="secondary" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => { setEditingProject(project); setIsFormOpen(true); }}><Pencil className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleToggleFeatured(project.id)}>{project.featured ? <><StarOff className="w-4 h-4 mr-2" />Quitar destacado</> : <><Star className="w-4 h-4 mr-2" />Destacar</>}</DropdownMenuItem>
                                                {project.status !== 'published' && <DropdownMenuItem onClick={() => handleStatusChange(project.id, 'published')}><Eye className="w-4 h-4 mr-2" />Publicar</DropdownMenuItem>}
                                                {project.status === 'published' && <DropdownMenuItem onClick={() => handleStatusChange(project.id, 'draft')}><EyeOff className="w-4 h-4 mr-2" />Despublicar</DropdownMenuItem>}
                                                <DropdownMenuItem onClick={() => handleDelete(project.id, project.title)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Eliminar</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className={CATEGORY_COLORS[project.category]}>{project.category}</Badge>
                                        <span className="text-xs text-gray-400">{project.year}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{project.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{project.description}</p>
                                    {project.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {project.technologies.slice(0, 3).map((tech, idx) => <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{tech}</span>)}
                                            {project.technologies.length > 3 && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded">+{project.technologies.length - 3}</span>}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <ProjectForm project={editingProject} isOpen={isFormOpen} onOpenChange={setIsFormOpen} onSuccess={() => { setIsFormOpen(false); setEditingProject(null); loadData(); }} />
        </div>
    );
}
