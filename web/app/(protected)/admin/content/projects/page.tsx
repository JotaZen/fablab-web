"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/cards/card";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { Badge } from "@/shared/ui/misc/badge";
import { Label } from "@/shared/ui/labels/label";
import { Textarea } from "@/shared/ui/inputs/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/inputs/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/misc/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/tables/table";
import {
    FolderTree,
    Search,
    Plus,
    Edit,
    Trash2,
    Loader2,
    CheckCircle,
    Upload,
    Star,
    StarOff,
    Eye,
    EyeOff,
    X,
    Link as LinkIcon,
    Users,
    User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { 
    getProjects,
    getTeamMembersForSelect,
    createProject, 
    updateProject, 
    deleteProject,
    toggleProjectFeatured,
    updateProjectStatus,
} from "./actions";
import type { ProjectData } from "./data";

interface LocalCreator { 
    teamMemberId?: string; 
    teamMemberName?: string;
    externalName?: string; 
    role?: string; 
}

interface LocalLink { 
    label: string; 
    url: string; 
}

interface TeamMemberOption {
    id: string;
    name: string;
    image?: string;
    jobTitle?: string;
}

export default function ProjectsAdminPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [projectsList, setProjectsList] = useState<ProjectData[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMemberOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const [lastCreatedTitle, setLastCreatedTitle] = useState("");
    const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Hardware",
        year: new Date().getFullYear(),
        status: "draft" as "draft" | "published",
        featured: false,
        technologies: [] as string[],
        creators: [] as LocalCreator[],
        links: [] as LocalLink[],
        image: null as File | null,
    });
    
    const [newTech, setNewTech] = useState("");

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [projects, members] = await Promise.all([
                getProjects(),
                getTeamMembersForSelect(),
            ]);
            setProjectsList(projects);
            setTeamMembers(members);
        } catch (error) {
            console.error("Error cargando datos:", error);
            toast.error("Error al cargar datos");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const publishedProjects = projectsList.filter(p => p.status === 'published').length;
    const featuredProjects = projectsList.filter(p => p.featured).length;

    const filteredProjects = projectsList.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            category: "Hardware",
            year: new Date().getFullYear(),
            status: "draft",
            featured: false,
            technologies: [],
            creators: [],
            links: [],
            image: null,
        });
        setNewTech("");
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("La imagen no debe superar 5MB");
                return;
            }
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddTech = () => {
        if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
            setFormData({ 
                ...formData, 
                technologies: [...formData.technologies, newTech.trim()] 
            });
            setNewTech("");
        }
    };

    const handleRemoveTech = (tech: string) => {
        setFormData({
            ...formData,
            technologies: formData.technologies.filter(t => t !== tech),
        });
    };

    const handleAddCreator = (isTeamMember: boolean) => {
        const newCreator: LocalCreator = isTeamMember 
            ? { teamMemberId: '', role: '' }
            : { externalName: '', role: '' };
        setFormData({
            ...formData,
            creators: [...formData.creators, newCreator],
        });
    };

    const handleUpdateCreator = (index: number, field: string, value: string) => {
        const updated = [...formData.creators];
        (updated[index] as any)[field] = value;
        if (field === 'teamMemberId') {
            const member = teamMembers.find(m => m.id === value);
            updated[index].teamMemberName = member?.name;
        }
        setFormData({ ...formData, creators: updated });
    };

    const handleRemoveCreator = (index: number) => {
        setFormData({
            ...formData,
            creators: formData.creators.filter((_, i) => i !== index),
        });
    };

    const handleAddLink = () => {
        setFormData({
            ...formData,
            links: [...formData.links, { label: '', url: '' }],
        });
    };

    const handleUpdateLink = (index: number, field: 'label' | 'url', value: string) => {
        const updated = [...formData.links];
        updated[index][field] = value;
        setFormData({ ...formData, links: updated });
    };

    const handleRemoveLink = (index: number) => {
        setFormData({
            ...formData,
            links: formData.links.filter((_, i) => i !== index),
        });
    };

    const handleAddProject = async () => {
        if (!formData.title || !formData.description) {
            toast.error("Título y descripción son requeridos");
            return;
        }

        try {
            setIsSaving(true);
            const form = new FormData();
            form.append('title', formData.title);
            form.append('description', formData.description);
            form.append('category', formData.category);
            form.append('year', String(formData.year));
            form.append('status', formData.status);
            form.append('featured', String(formData.featured));
            form.append('technologies', formData.technologies.join(','));
            form.append('creators', JSON.stringify(formData.creators.map(c => ({
                teamMember: c.teamMemberId || undefined,
                externalName: c.externalName || undefined,
                role: c.role,
            }))));
            form.append('links', JSON.stringify(formData.links));
            
            if (formData.image) {
                form.append('image', formData.image);
            }
            
            const result = await createProject(form);
            
            if (result.success) {
                setLastCreatedTitle(formData.title);
                setIsAddDialogOpen(false);
                setIsSuccessDialogOpen(true);
                resetForm();
                loadData();
            } else {
                toast.error(result.error || "Error al crear proyecto");
            }
        } catch (error) {
            console.error("Error creando proyecto:", error);
            toast.error("Error al crear proyecto");
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditProject = async () => {
        if (!selectedProject || !formData.title) {
            toast.error("Título es requerido");
            return;
        }

        try {
            setIsSaving(true);
            const form = new FormData();
            form.append('title', formData.title);
            form.append('description', formData.description);
            form.append('category', formData.category);
            form.append('year', String(formData.year));
            form.append('status', formData.status);
            form.append('featured', String(formData.featured));
            form.append('technologies', formData.technologies.join(','));
            form.append('creators', JSON.stringify(formData.creators.map(c => ({
                teamMember: c.teamMemberId || undefined,
                externalName: c.externalName || undefined,
                role: c.role,
            }))));
            form.append('links', JSON.stringify(formData.links));
            
            if (formData.image) {
                form.append('image', formData.image);
            }
            
            const result = await updateProject(selectedProject.id, form);
            
            if (result.success) {
                setIsEditDialogOpen(false);
                setSelectedProject(null);
                resetForm();
                toast.success("Proyecto actualizado correctamente");
                loadData();
            } else {
                toast.error(result.error || "Error al actualizar proyecto");
            }
        } catch (error) {
            console.error("Error actualizando proyecto:", error);
            toast.error("Error al actualizar proyecto");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteProject = async (project: ProjectData) => {
        if (confirm(`¿Estás seguro de eliminar "${project.title}"?`)) {
            try {
                const result = await deleteProject(project.id);
                if (result.success) {
                    toast.success(`"${project.title}" eliminado`);
                    loadData();
                } else {
                    toast.error(result.error || "Error al eliminar");
                }
            } catch (error) {
                console.error("Error eliminando proyecto:", error);
                toast.error("Error al eliminar proyecto");
            }
        }
    };

    const handleToggleFeatured = async (project: ProjectData) => {
        try {
            const result = await toggleProjectFeatured(project.id);
            if (result.success) {
                toast.success(`${project.title} ${!project.featured ? 'destacado' : 'sin destacar'}`);
                loadData();
            }
        } catch (error) {
            toast.error("Error al cambiar estado");
        }
    };

    const handleToggleStatus = async (project: ProjectData) => {
        try {
            const newStatus = project.status === 'published' ? 'draft' : 'published';
            const result = await updateProjectStatus(project.id, newStatus);
            if (result.success) {
                toast.success(`${project.title} ${newStatus === 'published' ? 'publicado' : 'como borrador'}`);
                loadData();
            }
        } catch (error) {
            toast.error("Error al cambiar estado");
        }
    };

    const openEditDialog = (project: ProjectData) => {
        setSelectedProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            category: project.category,
            year: project.year,
            status: project.status as "draft" | "published",
            featured: project.featured,
            technologies: project.technologies,
            creators: project.creators.map(c => ({
                teamMemberId: c.teamMemberId,
                teamMemberName: c.teamMemberName,
                externalName: c.externalName,
                role: c.role,
            })),
            links: project.links,
            image: null,
        });
        setImagePreview(project.featuredImage || null);
        setIsEditDialogOpen(true);
    };

    const getCategoryColor = (cat: string) => {
        const colors: Record<string, string> = {
            'Hardware': 'bg-blue-100 text-blue-700',
            'Software': 'bg-green-100 text-green-700',
            'Diseño': 'bg-purple-100 text-purple-700',
            'IoT': 'bg-orange-100 text-orange-700',
        };
        return colors[cat] || 'bg-gray-100 text-gray-700';
    };

    const renderFormContent = () => (
        <div className="space-y-6 py-4">
            <div className="space-y-2">
                <Label>Imagen principal</Label>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        {imagePreview ? (
                            <div className="relative w-32 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
                                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                <button type="button" onClick={() => { setImagePreview(null); setFormData({ ...formData, image: null }); }} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ) : (
                            <div onClick={() => fileInputRef.current?.click()} className="w-32 h-24 rounded-lg bg-gray-100 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:border-orange-400 hover:bg-orange-50">
                                <Upload className="h-6 w-6 text-gray-400" />
                                <span className="text-xs text-gray-500 mt-1">Subir</span>
                            </div>
                        )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input id="title" placeholder="Nombre del proyecto" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="description">Descripción *</Label>
                    <Textarea id="description" placeholder="Describe brevemente el proyecto..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <Label>Categoría *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Hardware">Hardware</SelectItem>
                            <SelectItem value="Software">Software</SelectItem>
                            <SelectItem value="Diseño">Diseño</SelectItem>
                            <SelectItem value="IoT">IoT</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="year">Año</Label>
                    <Input id="year" type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })} />
                </div>
                <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select value={formData.status} onValueChange={(value: "draft" | "published") => setFormData({ ...formData, status: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Borrador</SelectItem>
                            <SelectItem value="published">Publicado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500 h-5 w-5" />
                <div>
                    <Label htmlFor="featured" className="font-medium cursor-pointer flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Proyecto destacado
                    </Label>
                    <p className="text-sm text-gray-500">Aparecerá primero en la lista</p>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Tecnologías utilizadas</Label>
                <div className="flex gap-2">
                    <Input value={newTech} onChange={(e) => setNewTech(e.target.value)} placeholder="Arduino, Python, React..." onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())} />
                    <Button type="button" variant="outline" onClick={handleAddTech}><Plus className="h-4 w-4" /></Button>
                </div>
                {formData.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.technologies.map((tech) => (
                            <span key={tech} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                                {tech}
                                <button type="button" onClick={() => handleRemoveTech(tech)} className="text-gray-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label className="flex items-center gap-2"><Users className="h-4 w-4" />Creadores del proyecto</Label>
                <div className="flex gap-2 mb-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => handleAddCreator(true)} className="gap-1">
                        <Users className="h-3 w-3" /> Agregar especialista
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleAddCreator(false)} className="gap-1">
                        <UserIcon className="h-3 w-3" /> Agregar externo
                    </Button>
                </div>
                {formData.creators.length > 0 && (
                    <div className="space-y-2">
                        {formData.creators.map((creator, index) => (
                            <div key={index} className="flex gap-2 items-center p-2 bg-gray-50 rounded-lg">
                                {creator.teamMemberId !== undefined ? (
                                    <Select value={creator.teamMemberId} onValueChange={(value) => handleUpdateCreator(index, 'teamMemberId', value)}>
                                        <SelectTrigger className="flex-1"><SelectValue placeholder="Seleccionar especialista" /></SelectTrigger>
                                        <SelectContent>
                                            {teamMembers.map((member) => (
                                                <SelectItem key={member.id} value={member.id}>
                                                    <div className="flex items-center gap-2">
                                                        {member.image ? (
                                                            <Image src={member.image} alt={member.name} width={20} height={20} className="rounded-full" />
                                                        ) : (
                                                            <div className="w-5 h-5 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs">{member.name.charAt(0)}</div>
                                                        )}
                                                        {member.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input value={creator.externalName || ''} onChange={(e) => handleUpdateCreator(index, 'externalName', e.target.value)} placeholder="Nombre del colaborador externo" className="flex-1" />
                                )}
                                <Input value={creator.role || ''} onChange={(e) => handleUpdateCreator(index, 'role', e.target.value)} placeholder="Rol" className="w-32" />
                                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveCreator(index)} className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label className="flex items-center gap-2"><LinkIcon className="h-4 w-4" />Enlaces (repositorio, video, demo)</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddLink} className="gap-1 mb-2"><Plus className="h-3 w-3" /> Agregar enlace</Button>
                {formData.links.length > 0 && (
                    <div className="space-y-2">
                        {formData.links.map((link, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <Input value={link.label} onChange={(e) => handleUpdateLink(index, 'label', e.target.value)} placeholder="Nombre (ej: GitHub)" className="w-32" />
                                <Input value={link.url} onChange={(e) => handleUpdateLink(index, 'url', e.target.value)} placeholder="https://..." className="flex-1" />
                                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveLink(index)} className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
                <p className="text-gray-600 mt-1">Gestiona los proyectos del FabLab</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2"><FolderTree className="h-4 w-4" />Total Proyectos</CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold">{projectsList.length}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2"><Eye className="h-4 w-4" />Publicados</CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold text-green-600">{publishedProjects}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2"><Star className="h-4 w-4" />Destacados</CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold text-yellow-600">{featuredProjects}</div></CardContent>
                </Card>
            </div>

            <div className="flex gap-3 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Buscar por título, descripción o categoría..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
                <Button className="gap-2 bg-orange-500 hover:bg-orange-600" onClick={() => setIsAddDialogOpen(true)}><Plus className="h-4 w-4" />Nuevo Proyecto</Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /><span className="ml-2 text-gray-600">Cargando...</span></div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="text-center py-12"><FolderTree className="h-12 w-12 text-gray-400 mx-auto mb-3" /><p className="text-gray-600">No hay proyectos</p><p className="text-sm text-gray-500 mt-1">Crea el primer proyecto del FabLab</p></div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Imagen</TableHead>
                                    <TableHead>Título</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Año</TableHead>
                                    <TableHead>Creadores</TableHead>
                                    <TableHead className="text-center">Estado</TableHead>
                                    <TableHead className="text-center">Destacado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProjects.map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell>
                                            {project.featuredImage ? (
                                                <Image src={project.featuredImage} alt={project.title} width={60} height={40} className="w-15 h-10 rounded object-cover" />
                                            ) : (
                                                <div className="w-15 h-10 rounded bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center"><FolderTree className="h-5 w-5 text-gray-400" /></div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div><p className="font-medium">{project.title}</p><p className="text-xs text-gray-500 line-clamp-1">{project.description}</p></div>
                                        </TableCell>
                                        <TableCell><Badge className={getCategoryColor(project.category)}>{project.category}</Badge></TableCell>
                                        <TableCell className="text-gray-600">{project.year}</TableCell>
                                        <TableCell>
                                            {project.creators.length > 0 ? (
                                                <div className="flex -space-x-2">
                                                    {project.creators.slice(0, 3).map((creator, i) => (
                                                        <div key={i} className="w-7 h-7 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs border-2 border-white" title={creator.teamMemberName || creator.externalName}>
                                                            {(creator.teamMemberName || creator.externalName || 'U').charAt(0)}
                                                        </div>
                                                    ))}
                                                    {project.creators.length > 3 && <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs border-2 border-white">+{project.creators.length - 3}</div>}
                                                </div>
                                            ) : <span className="text-gray-400 text-sm">—</span>}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(project)} className={project.status === 'published' ? "text-green-600" : "text-gray-400"}>
                                                {project.status === 'published' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button variant="ghost" size="sm" onClick={() => handleToggleFeatured(project)} className={project.featured ? "text-yellow-500" : "text-gray-400"}>
                                                {project.featured ? <Star className="h-4 w-4 fill-yellow-500" /> : <StarOff className="h-4 w-4" />}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button size="sm" variant="ghost" onClick={() => openEditDialog(project)}><Edit className="h-4 w-4" /></Button>
                                                <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteProject(project)}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) resetForm(); }}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><FolderTree className="h-5 w-5 text-orange-500" />Nuevo Proyecto</DialogTitle>
                        <DialogDescription>Completa la información del proyecto</DialogDescription>
                    </DialogHeader>
                    {renderFormContent()}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSaving}>Cancelar</Button>
                        <Button onClick={handleAddProject} disabled={isSaving} className="bg-orange-500 hover:bg-orange-600">
                            {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Guardando...</> : <><Plus className="h-4 w-4 mr-2" />Crear Proyecto</>}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={(open) => { setIsEditDialogOpen(open); if (!open) { setSelectedProject(null); resetForm(); } }}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle className="flex items-center gap-2"><Edit className="h-5 w-5 text-orange-500" />Editar Proyecto</DialogTitle></DialogHeader>
                    {renderFormContent()}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSaving}>Cancelar</Button>
                        <Button onClick={handleEditProject} disabled={isSaving} className="bg-orange-500 hover:bg-orange-600">
                            {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Guardando...</> : "Guardar Cambios"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <div className="flex flex-col items-center text-center py-6">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4"><CheckCircle className="h-8 w-8 text-green-600" /></div>
                        <DialogTitle className="text-xl mb-2">¡Proyecto creado!</DialogTitle>
                        <DialogDescription className="text-base"><span className="font-semibold text-gray-900">"{lastCreatedTitle}"</span> ha sido creado exitosamente</DialogDescription>
                    </div>
                    <DialogFooter className="sm:justify-center">
                        <Button onClick={() => setIsSuccessDialogOpen(false)} className="bg-green-600 hover:bg-green-700">Entendido</Button>
                        <Button variant="outline" onClick={() => { setIsSuccessDialogOpen(false); setIsAddDialogOpen(true); }}>Crear otro</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
