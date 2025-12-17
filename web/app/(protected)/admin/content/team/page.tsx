"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth, isAdmin } from "@/features/auth";
import { AlertCircle, Loader2, Plus, Pencil, Trash2, MoreHorizontal, Filter, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/cards/card";
import { Button } from "@/shared/ui/buttons/button";
import { Switch } from "@/shared/ui/misc/switch";
import { Badge } from "@/shared/ui/misc/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/tables/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/shared/ui/misc/dropdown-menu";
import { getTeamMembers, deleteTeamMember, toggleTeamMemberStatus } from "./actions";
import Image from "next/image";
import { toast } from "sonner";
import { TeamMemberForm } from "./team-member-form";

interface TeamMember {
    id: string;
    name: string;
    role: string;
    category: string;
    image: string;
    active: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
    leadership: 'Liderazgo',
    specialist: 'Especialista',
    collaborator: 'Colaborador',
};

export default function TeamContentPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TeamMember | undefined>(undefined);
    const [filterCategory, setFilterCategory] = useState<string | null>(null);

    useEffect(() => {
        if (user && isAdmin(user)) {
            loadMembers();
        }
    }, [user]);

    const loadMembers = async () => {
        try {
            const data = await getTeamMembers();
            setMembers(data);
        } catch (error) {
            console.error("Error loading team members:", error);
            toast.error("Error al cargar miembros");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este miembro?")) return;
        try {
            await deleteTeamMember(id);
            toast.success("Miembro eliminado");
            loadMembers();
        } catch (error) {
            console.error(error);
            toast.error("Error al eliminar");
        }
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            // Optimistic update
            setMembers(prev => prev.map(m => m.id === id ? { ...m, active: !currentStatus } : m));

            await toggleTeamMemberStatus(id, !currentStatus);
            toast.success(currentStatus ? "Miembro desactivado" : "Miembro activado");
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar estado");
            loadMembers(); // Revert on error
        }
    };

    const handleEdit = (member: TeamMember) => {
        setSelectedMember(member);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setSelectedMember(undefined);
        setIsFormOpen(true);
    };

    const handleFormSuccess = () => {
        loadMembers();
    };

    const filteredMembers = useMemo(() => {
        if (!filterCategory) return members;
        return members.filter(m => m.category === filterCategory);
    }, [members, filterCategory]);

    if (authLoading || isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-gray-400" /></div>;

    if (!user || !isAdmin(user)) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Acceso Denegado</h2>
                        <p className="text-muted-foreground">
                            No tienes permisos para acceder a esta sección.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Gestión del Equipo</h1>
                    <p className="text-muted-foreground">
                        Administra los miembros del equipo y su visibilidad.
                    </p>
                </div>
                <Button onClick={handleCreate} className="bg-zinc-900 text-white hover:bg-zinc-800">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Miembro
                </Button>
            </div>

            <TeamMemberForm
                isOpen={isFormOpen}
                onOpenChange={setIsFormOpen}
                member={selectedMember}
                onSuccess={handleFormSuccess}
            />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle>Miembros del Equipo ({filteredMembers.length})</CardTitle>
                    <div className="flex items-center gap-2">
                        {filterCategory && (
                            <Button variant="ghost" size="sm" onClick={() => setFilterCategory(null)} className="h-8 px-2 text-muted-foreground">
                                Limpiar filtro
                                <X className="ml-2 h-3 w-3" />
                            </Button>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 gap-1">
                                    <Filter className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filtrar</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filtrar por categoría</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked={filterCategory === null} onCheckedChange={() => setFilterCategory(null)}>
                                    Todos
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={filterCategory === 'leadership'} onCheckedChange={() => setFilterCategory('leadership')}>
                                    Liderazgo
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={filterCategory === 'specialist'} onCheckedChange={() => setFilterCategory('specialist')}>
                                    Especialistas
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={filterCategory === 'collaborator'} onCheckedChange={() => setFilterCategory('collaborator')}>
                                    Colaboradores
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Miembro</TableHead>
                                    <TableHead>Cargo</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="w-[70px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMembers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No se encontraron miembros.
                                        </TableCell>
                                    </TableRow>
                                ) : filteredMembers.map((member) => (
                                    <TableRow key={member.id} className="group">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                {member.image ? (
                                                    <div className="w-9 h-9 rounded-full overflow-hidden relative bg-gray-100 border border-gray-200">
                                                        <Image src={member.image} alt={member.name} fill className="object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold border border-gray-200">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span>{member.name}</span>
                                                    <span className="text-xs text-muted-foreground sm:hidden">{member.role}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">{member.role}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
                                                {CATEGORY_LABELS[member.category] || member.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={member.active}
                                                    onCheckedChange={() => handleToggleActive(member.id, member.active)}
                                                />
                                                <span className={`text-xs font-medium ${member.active ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {member.active ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Acciones</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(member)}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50" onClick={() => handleDelete(member.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
