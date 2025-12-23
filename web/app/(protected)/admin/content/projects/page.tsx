"use client";

import { useState, useEffect } from "react";
import { useAuth, isAdmin } from "@/features/auth";
import Image from "next/image";
import { Plus, Search, Loader2, ShieldAlert, Star, StarOff, Pencil, Trash2, FolderOpen, Eye, EyeOff, MoreVertical, ExternalLink } from "lucide-react";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { Card, CardContent } from "@/shared/ui/cards/card";
import { Badge } from "@/shared/ui/misc/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/misc/dropdown-menu";
import { toast } from "sonner";
import { getProjects, deleteProject, toggleProjectFeatured, updateProjectStatus } from "./actions";
import type { ProjectData } from "./data";
import { ProjectForm } from "./project-form";

export default function ProjectsAdminPage() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<ProjectData | null>(null);

    const canManage = user && isAdmin(user);

    const loadData = async () => {
        setLoading(true);
        try { setProjects(await getProjects()); }
        catch { toast.error("Error al cargar"); }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const filteredProjects = projects.filter((p) =>
        !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`¿Eliminar "${title}"?`)) return;
        const result = await deleteProject(id);
        if (result.success) { toast.success("Eliminado"); loadData(); }
        else toast.error(result.error || "Error");
    };

    const handleToggleFeatured = async (id: string) => {
        const result = await toggleProjectFeatured(id);
        if (result.success) loadData();
        else toast.error(result.error || "Error");
    };

    const handleStatusChange = async (id: string, status: 'draft' | 'published') => {
        const result = await updateProjectStatus(id, status);
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
                    <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
                    <p className="text-gray-500">Proyectos del FabLab</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.open('/cms/collections/projects', '_blank')}>
                        <ExternalLink className="w-4 h-4 mr-2" />CMS
                    </Button>
                    <Button onClick={() => { setEditingProject(null); setIsFormOpen(true); }} className="bg-orange-600 hover:bg-orange-700">
                        <Plus className="w-4 h-4 mr-2" />Nuevo
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl border p-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Buscar proyectos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
            ) : filteredProjects.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border">
                    <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">{projects.length === 0 ? "No hay proyectos" : "Sin resultados"}</h3>
                    {projects.length === 0 && <Button onClick={() => setIsFormOpen(true)} className="bg-orange-600">Crear Proyecto</Button>}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((project) => (
                        <Card key={project.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200">
                                {project.featuredImage ? (
                                    <Image src={project.featuredImage} alt={project.title} fill className="object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FolderOpen className="w-16 h-16 text-gray-300" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-1">
                                    {project.featured && <Badge className="bg-yellow-500 text-white"><Star className="w-3 h-3 mr-1 fill-current" />Destacado</Badge>}
                                    <Badge className={project.status === 'published' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                                        {project.status === 'published' ? 'Publicado' : 'Borrador'}
                                    </Badge>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">{project.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button size="sm" variant="ghost"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => { setEditingProject(project); setIsFormOpen(true); }}><Pencil className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleToggleFeatured(project.id)}>{project.featured ? <><StarOff className="w-4 h-4 mr-2" />Quitar destacado</> : <><Star className="w-4 h-4 mr-2" />Destacar</>}</DropdownMenuItem>
                                            {project.status !== 'published' && <DropdownMenuItem onClick={() => handleStatusChange(project.id, 'published')}><Eye className="w-4 h-4 mr-2" />Publicar</DropdownMenuItem>}
                                            {project.status === 'published' && <DropdownMenuItem onClick={() => handleStatusChange(project.id, 'draft')}><EyeOff className="w-4 h-4 mr-2" />Despublicar</DropdownMenuItem>}
                                            <DropdownMenuItem onClick={() => window.open(`/cms/collections/projects/${project.id}`, '_blank')}><ExternalLink className="w-4 h-4 mr-2" />Abrir en CMS</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(project.id, project.title)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Eliminar</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                {project.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {project.technologies.slice(0, 3).map((tech) => (
                                            <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                                        ))}
                                        {project.technologies.length > 3 && <Badge variant="secondary" className="text-xs">+{project.technologies.length - 3}</Badge>}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <ProjectForm project={editingProject} isOpen={isFormOpen} onOpenChange={setIsFormOpen} onSuccess={() => { setIsFormOpen(false); setEditingProject(null); loadData(); }} />
        </div>
    );
}
