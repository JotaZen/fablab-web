"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/cards/card";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { Badge } from "@/shared/ui/misc/badge";
import { Label } from "@/shared/ui/labels/label";
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
    Users,
    Search,
    Plus,
    Edit,
    Trash2,
    Loader2,
    CheckCircle,
    Upload,
    User as UserIcon,
    Eye,
    EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { 
    getAllTeamUsers,
    createTeamMember, 
    updateTeamMember, 
    deleteTeamMember,
    toggleTeamMemberStatus 
} from "./actions";

interface TeamMemberData {
    id: string;
    name: string;
    email: string;
    role: string;
    category: string;
    specialty: string;
    bio: string;
    experience: string;
    image: string;
    active: boolean;
    userRole: string;
}

export default function TeamMembersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [membersList, setMembersList] = useState<TeamMemberData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const [lastCreatedName, setLastCreatedName] = useState("");
    const [selectedMember, setSelectedMember] = useState<TeamMemberData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        profession: "",
        category: "specialist",
        bio: "",
        active: true,
        image: null as File | null,
    });

    const loadMembers = useCallback(async () => {
        try {
            setIsLoading(true);
            const members = await getAllTeamUsers();
            setMembersList(members);
        } catch (error) {
            console.error("Error cargando miembros:", error);
            toast.error("Error al cargar miembros del equipo");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMembers();
    }, [loadMembers]);

    const activeMembers = membersList.filter(m => m.active).length;
    const totalMembers = membersList.length;

    const filteredMembers = membersList.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (member.role || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            profession: "",
            category: "specialist",
            bio: "",
            active: true,
            image: null,
        });
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddMember = async () => {
        if (!formData.name || !formData.email) {
            toast.error("Nombre y correo son requeridos");
            return;
        }

        try {
            setIsSaving(true);
            const form = new FormData();
            form.append('name', formData.name);
            form.append('email', formData.email);
            if (formData.password) {
                form.append('password', formData.password);
            }
            form.append('role', formData.profession);
            form.append('specialty', formData.profession);
            form.append('category', formData.category);
            form.append('bio', formData.bio);
            
            if (formData.image) {
                form.append('image', formData.image);
            }
            
            const result = await createTeamMember(form);
            
            if (result.success) {
                setLastCreatedName(formData.name);
                setIsAddDialogOpen(false);
                setIsSuccessDialogOpen(true);
                resetForm();
                loadMembers();
            } else {
                toast.error(result.error || "Error al crear miembro");
            }
        } catch (error) {
            console.error("Error creando miembro:", error);
            toast.error("Error al crear miembro");
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditMember = async () => {
        if (!selectedMember || !formData.name) {
            toast.error("Nombre es requerido");
            return;
        }

        try {
            setIsSaving(true);
            const form = new FormData();
            form.append('name', formData.name);
            form.append('email', formData.email);
            form.append('role', formData.profession);
            form.append('specialty', formData.profession);
            form.append('category', formData.category);
            form.append('bio', formData.bio);
            form.append('active', String(formData.active));
            
            if (formData.image) {
                form.append('image', formData.image);
            }
            
            const result = await updateTeamMember(selectedMember.id, form);
            
            if (result.success) {
                setIsEditDialogOpen(false);
                setSelectedMember(null);
                resetForm();
                toast.success("Miembro actualizado correctamente");
                loadMembers();
            } else {
                toast.error(result.error || "Error al actualizar miembro");
            }
        } catch (error) {
            console.error("Error actualizando miembro:", error);
            toast.error("Error al actualizar miembro");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteMember = async (member: TeamMemberData) => {
        if (confirm(`¿Estás seguro de quitar a ${member.name} del equipo?`)) {
            try {
                await deleteTeamMember(member.id);
                toast.success(`${member.name} quitado del equipo`);
                loadMembers();
            } catch (error) {
                console.error("Error eliminando miembro:", error);
                toast.error("Error al eliminar miembro");
            }
        }
    };

    const handleToggleStatus = async (member: TeamMemberData) => {
        try {
            await toggleTeamMemberStatus(member.id, !member.active);
            toast.success(`${member.name} ${!member.active ? 'visible' : 'oculto'} en /equipo`);
            loadMembers();
        } catch (error) {
            console.error("Error cambiando estado:", error);
            toast.error("Error al cambiar estado");
        }
    };

    const openEditDialog = (member: TeamMemberData) => {
        setSelectedMember(member);
        setFormData({
            name: member.name,
            email: member.email,
            password: "",
            profession: member.role || member.specialty,
            category: member.category || "specialist",
            bio: member.bio || "",
            active: member.active,
            image: null,
        });
        setImagePreview(member.image || null);
        setIsEditDialogOpen(true);
    };

    const getCategoryLabel = (cat: string) => {
        const labels: Record<string, string> = {
            'leadership': 'Directivo',
            'specialist': 'Especialista',
            'collaborator': 'Colaborador',
        };
        return labels[cat] || cat;
    };

    const getCategoryColor = (cat: string) => {
        const colors: Record<string, string> = {
            'leadership': 'bg-purple-100 text-purple-700',
            'specialist': 'bg-blue-100 text-blue-700',
            'collaborator': 'bg-green-100 text-green-700',
        };
        return colors[cat] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Equipo</h1>
                <p className="text-gray-600 mt-1">Gestiona los miembros del equipo que aparecen en /equipo</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Total Miembros
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalMembers}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Visibles en /equipo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{activeMembers}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <EyeOff className="h-4 w-4" />
                            Ocultos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-400">{totalMembers - activeMembers}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Actions */}
            <div className="flex gap-3 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar por nombre, correo o cargo..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button className="gap-2 bg-orange-500 hover:bg-orange-600" onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Agregar Miembro
                </Button>
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                            <span className="ml-2 text-gray-600">Cargando...</span>
                        </div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">No hay miembros del equipo</p>
                            <p className="text-sm text-gray-500 mt-1">Agrega el primer miembro para que aparezca en /equipo</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Foto</TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Correo</TableHead>
                                    <TableHead>Cargo</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead className="text-center">Visible</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMembers.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell>
                                            {member.image ? (
                                                <Image 
                                                    src={member.image} 
                                                    alt={member.name}
                                                    width={40}
                                                    height={40}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                                                    {member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{member.name}</TableCell>
                                        <TableCell className="text-gray-600">{member.email}</TableCell>
                                        <TableCell>{member.role || member.specialty || '-'}</TableCell>
                                        <TableCell>
                                            <Badge className={getCategoryColor(member.category)}>
                                                {getCategoryLabel(member.category)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleToggleStatus(member)}
                                                className={member.active ? "text-green-600" : "text-gray-400"}
                                            >
                                                {member.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button 
                                                    size="sm" 
                                                    variant="ghost"
                                                    onClick={() => openEditDialog(member)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="ghost"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDeleteMember(member)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Add Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                setIsAddDialogOpen(open);
                if (!open) resetForm();
            }}>
                <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5 text-orange-500" />
                            Agregar al Equipo
                        </DialogTitle>
                        <DialogDescription>
                            Crea un nuevo miembro que aparecerá en /equipo y podrá iniciar sesión
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {/* Foto */}
                        <div className="space-y-2">
                            <Label>Foto de perfil</Label>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    {imagePreview ? (
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            width={80}
                                            height={80}
                                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                                            <UserIcon className="h-8 w-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="gap-2"
                                    >
                                        <Upload className="h-4 w-4" />
                                        Subir imagen
                                    </Button>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 5MB</p>
                                </div>
                            </div>
                        </div>

                        {/* Nombre */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre completo *</Label>
                            <Input
                                id="name"
                                placeholder="Ej: César Salcedo"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico *</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        {/* Contraseña */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña (para login)</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Mínimo 8 caracteres"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <p className="text-xs text-gray-500">Permite al miembro iniciar sesión en /admin</p>
                        </div>

                        {/* Cargo */}
                        <div className="space-y-2">
                            <Label htmlFor="profession">Cargo / Especialidad</Label>
                            <Input
                                id="profession"
                                placeholder="Ej: Ing. Informático, Diseñador 3D"
                                value={formData.profession}
                                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                            />
                        </div>

                        {/* Categoría */}
                        <div className="space-y-2">
                            <Label>Categoría *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="leadership">Equipo Directivo</SelectItem>
                                    <SelectItem value="specialist">Especialista</SelectItem>
                                    <SelectItem value="collaborator">Colaborador</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <Label htmlFor="bio">Biografía corta</Label>
                            <textarea
                                id="bio"
                                placeholder="Describe brevemente al miembro..."
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full min-h-[80px] px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSaving}>
                            Cancelar
                        </Button>
                        <Button onClick={handleAddMember} disabled={isSaving} className="bg-orange-500 hover:bg-orange-600">
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
                setIsEditDialogOpen(open);
                if (!open) {
                    setSelectedMember(null);
                    resetForm();
                }
            }}>
                <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit className="h-5 w-5 text-orange-500" />
                            Editar Miembro
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {/* Foto */}
                        <div className="space-y-2">
                            <Label>Foto de perfil</Label>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    {imagePreview ? (
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            width={80}
                                            height={80}
                                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                                            <UserIcon className="h-8 w-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="image-upload-edit"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => document.getElementById('image-upload-edit')?.click()}
                                        className="gap-2"
                                    >
                                        <Upload className="h-4 w-4" />
                                        Cambiar imagen
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Nombre */}
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Nombre completo *</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Correo electrónico</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        {/* Cargo */}
                        <div className="space-y-2">
                            <Label htmlFor="edit-profession">Cargo / Especialidad</Label>
                            <Input
                                id="edit-profession"
                                value={formData.profession}
                                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                            />
                        </div>

                        {/* Categoría */}
                        <div className="space-y-2">
                            <Label>Categoría</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="leadership">Equipo Directivo</SelectItem>
                                    <SelectItem value="specialist">Especialista</SelectItem>
                                    <SelectItem value="collaborator">Colaborador</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <Label htmlFor="edit-bio">Biografía corta</Label>
                            <textarea
                                id="edit-bio"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full min-h-[80px] px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        {/* Visible */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="edit-active"
                                checked={formData.active}
                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                            />
                            <Label htmlFor="edit-active">Visible en la página /equipo</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSaving}>
                            Cancelar
                        </Button>
                        <Button onClick={handleEditMember} disabled={isSaving} className="bg-orange-500 hover:bg-orange-600">
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                "Guardar Cambios"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Success Dialog */}
            <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <div className="flex flex-col items-center text-center py-6">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <DialogTitle className="text-xl mb-2">¡Miembro agregado!</DialogTitle>
                        <DialogDescription className="text-base">
                            <span className="font-semibold text-gray-900">{lastCreatedName}</span> ha sido agregado al equipo y aparecerá en /equipo
                        </DialogDescription>
                    </div>
                    <DialogFooter className="sm:justify-center">
                        <Button 
                            onClick={() => setIsSuccessDialogOpen(false)}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Entendido
                        </Button>
                        <Button 
                            variant="outline"
                            onClick={() => {
                                setIsSuccessDialogOpen(false);
                                setIsAddDialogOpen(true);
                            }}
                        >
                            Agregar otro
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
