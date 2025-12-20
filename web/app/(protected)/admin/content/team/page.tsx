"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth, isAdmin } from "@/features/auth";
import {
    AlertCircle,
    Loader2,
    Plus,
    Pencil,
    Trash2,
    Users,
    Crown,
    Briefcase,
    UserCircle,
    Search,
    Eye,
    EyeOff,
    ArrowUpDown,
    CheckCircle2,
    XCircle,
    X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/cards/card";
import { Button } from "@/shared/ui/buttons/button";
import { Switch } from "@/shared/ui/misc/switch";
import { Badge } from "@/shared/ui/misc/badge";
import { Input } from "@/shared/ui/inputs/input";
import {
    DropdownMenu,
    DropdownMenuContent,
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
    specialty?: string;
    image: string;
    active: boolean;
}

const CATEGORY_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
    leadership: {
        label: 'Liderazgo',
        icon: Crown,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50 border-amber-200'
    },
    specialist: {
        label: 'Especialista',
        icon: Briefcase,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 border-blue-200'
    },
    collaborator: {
        label: 'Colaborador',
        icon: UserCircle,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50 border-emerald-200'
    },
};

export default function TeamContentPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TeamMember | undefined>(undefined);
    const [filterCategory, setFilterCategory] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const canManage = user && isAdmin(user);

    useEffect(() => {
        if (canManage) {
            loadMembers();
        }
    }, [canManage]);

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

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`¿Estás seguro de eliminar a "${name}" del equipo?`)) return;
        try {
            await deleteTeamMember(id);
            toast.success("Miembro eliminado del equipo");
            loadMembers();
        } catch (error) {
            console.error(error);
            toast.error("Error al eliminar");
        }
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            setMembers(prev => prev.map(m => m.id === id ? { ...m, active: !currentStatus } : m));
            await toggleTeamMemberStatus(id, !currentStatus);
            toast.success(currentStatus ? "Miembro oculto de la web" : "Miembro visible en la web");
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar estado");
            loadMembers();
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
        let result = members;

        if (filterCategory) {
            result = result.filter(m => m.category === filterCategory);
        }

        if (filterStatus !== 'all') {
            result = result.filter(m => filterStatus === 'active' ? m.active : !m.active);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(m =>
                m.name.toLowerCase().includes(query) ||
                m.role.toLowerCase().includes(query) ||
                m.specialty?.toLowerCase().includes(query)
            );
        }

        return result;
    }, [members, filterCategory, filterStatus, searchQuery]);

    // Stats
    const stats = useMemo(() => ({
        total: members.length,
        active: members.filter(m => m.active).length,
        leadership: members.filter(m => m.category === 'leadership').length,
        specialist: members.filter(m => m.category === 'specialist').length,
        collaborator: members.filter(m => m.category === 'collaborator').length,
    }), [members]);

    const hasFilters = filterCategory || filterStatus !== 'all' || searchQuery.trim();

    if (authLoading || isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 gap-4">
                <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
                <p className="text-sm text-gray-500">Cargando equipo...</p>
            </div>
        );
    }

    if (!canManage) {
        return (
            <div className="space-y-6">
                <Card className="border-red-200 bg-red-50/50">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="p-4 rounded-full bg-red-100 mb-4">
                            <AlertCircle className="h-8 w-8 text-red-500" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2 text-red-900">Acceso Denegado</h2>
                        <p className="text-red-700 text-center max-w-md">
                            No tienes permisos para gestionar el equipo. Contacta a un administrador.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Gestión del Equipo</h1>
                    <p className="text-gray-500 mt-1">
                        Administra los miembros y su visibilidad en la página pública.
                    </p>
                </div>
                <Button
                    onClick={handleCreate}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Miembro
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setFilterCategory(null); setFilterStatus('all'); }}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gray-100">
                                <Users className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-xs text-gray-500">Total</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilterStatus('active')}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-100">
                                <Eye className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-700">{stats.active}</p>
                                <p className="text-xs text-green-600">Visibles</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={`bg-amber-50 border-amber-200 hover:shadow-md transition-shadow cursor-pointer ${filterCategory === 'leadership' ? 'ring-2 ring-amber-400' : ''}`} onClick={() => setFilterCategory(filterCategory === 'leadership' ? null : 'leadership')}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-100">
                                <Crown className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-amber-700">{stats.leadership}</p>
                                <p className="text-xs text-amber-600">Liderazgo</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={`bg-blue-50 border-blue-200 hover:shadow-md transition-shadow cursor-pointer ${filterCategory === 'specialist' ? 'ring-2 ring-blue-400' : ''}`} onClick={() => setFilterCategory(filterCategory === 'specialist' ? null : 'specialist')}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100">
                                <Briefcase className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-700">{stats.specialist}</p>
                                <p className="text-xs text-blue-600">Especialistas</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={`bg-emerald-50 border-emerald-200 hover:shadow-md transition-shadow cursor-pointer ${filterCategory === 'collaborator' ? 'ring-2 ring-emerald-400' : ''}`} onClick={() => setFilterCategory(filterCategory === 'collaborator' ? null : 'collaborator')}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-100">
                                <UserCircle className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-emerald-700">{stats.collaborator}</p>
                                <p className="text-xs text-emerald-600">Colaboradores</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Form Sheet */}
            <TeamMemberForm
                isOpen={isFormOpen}
                onOpenChange={setIsFormOpen}
                member={selectedMember}
                onSuccess={handleFormSuccess}
            />

            {/* Main Content */}
            <Card className="overflow-hidden">
                <CardHeader className="border-b bg-gray-50/50 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <CardTitle className="text-lg">
                                Miembros del Equipo
                            </CardTitle>
                            {hasFilters && (
                                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                    {filteredMembers.length} resultados
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Buscar miembros..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-9 w-[200px] bg-white"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                                    >
                                        <X className="h-3 w-3 text-gray-400" />
                                    </button>
                                )}
                            </div>

                            {/* Status Filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-9 gap-2">
                                        {filterStatus === 'active' ? <Eye className="h-4 w-4" /> :
                                            filterStatus === 'inactive' ? <EyeOff className="h-4 w-4" /> :
                                                <ArrowUpDown className="h-4 w-4" />}
                                        <span className="hidden sm:inline">
                                            {filterStatus === 'all' ? 'Todos' : filterStatus === 'active' ? 'Visibles' : 'Ocultos'}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Estado de visibilidad</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem checked={filterStatus === 'all'} onCheckedChange={() => setFilterStatus('all')}>
                                        Todos
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem checked={filterStatus === 'active'} onCheckedChange={() => setFilterStatus('active')}>
                                        Visibles
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem checked={filterStatus === 'inactive'} onCheckedChange={() => setFilterStatus('inactive')}>
                                        Ocultos
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Clear Filters */}
                            {hasFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setFilterCategory(null);
                                        setFilterStatus('all');
                                        setSearchQuery('');
                                    }}
                                    className="h-9 text-gray-500 hover:text-gray-900"
                                >
                                    <X className="mr-1 h-4 w-4" />
                                    Limpiar
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {filteredMembers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="p-4 rounded-full bg-gray-100 mb-4">
                                <Users className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                {hasFilters ? 'No se encontraron miembros' : 'Sin miembros'}
                            </h3>
                            <p className="text-gray-500 text-center max-w-md mb-4">
                                {hasFilters
                                    ? 'Intenta con otros filtros o términos de búsqueda.'
                                    : 'Comienza agregando el primer miembro del equipo.'
                                }
                            </p>
                            {!hasFilters && (
                                <Button onClick={handleCreate} variant="outline">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Agregar Primer Miembro
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                            {filteredMembers.map((member) => {
                                const categoryConfig = CATEGORY_CONFIG[member.category] || CATEGORY_CONFIG.collaborator;
                                const CategoryIcon = categoryConfig.icon;

                                return (
                                    <div
                                        key={member.id}
                                        className={`group relative bg-white rounded-xl border ${member.active ? 'border-gray-200' : 'border-gray-200 bg-gray-50'} overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300`}
                                    >
                                        {/* Status Indicator */}
                                        <div className={`absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${member.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {member.active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                            {member.active ? 'Visible' : 'Oculto'}
                                        </div>

                                        {/* Image */}
                                        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                            {member.image ? (
                                                <Image
                                                    src={member.image}
                                                    alt={member.name}
                                                    fill
                                                    className={`object-cover transition-all duration-500 group-hover:scale-105 ${!member.active ? 'grayscale opacity-70' : ''}`}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-400">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                            {/* Hover Actions */}
                                            <div className="absolute inset-x-0 bottom-0 p-3 flex justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => handleEdit(member)}
                                                    className="h-8 bg-white/90 backdrop-blur-sm hover:bg-white"
                                                >
                                                    <Pencil className="h-3.5 w-3.5 mr-1" />
                                                    Editar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(member.id, member.name)}
                                                    className="h-8"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
                                                    <p className="text-sm text-gray-500 truncate">{member.role}</p>
                                                </div>
                                            </div>

                                            {/* Category Badge */}
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${categoryConfig.bgColor} ${categoryConfig.color}`}>
                                                <CategoryIcon className="h-3 w-3" />
                                                {categoryConfig.label}
                                            </div>

                                            {/* Toggle Switch */}
                                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                                <span className="text-xs text-gray-500">Mostrar en web</span>
                                                <Switch
                                                    checked={member.active}
                                                    onCheckedChange={() => handleToggleActive(member.id, member.active)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
