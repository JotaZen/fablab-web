"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth, isAdmin } from "@/features/auth";
import { Plus, Search, Loader2, ShieldAlert, Star, Pencil, Trash2, Calendar, MoreVertical, MapPin, Users as UsersIcon } from "lucide-react";
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
import { getEvents, createEvent, updateEvent, deleteEvent, EVENT_TYPES, type EventData } from "./actions";

const TYPE_COLORS: Record<string, string> = {
    workshop: 'bg-purple-100 text-purple-700',
    course: 'bg-blue-100 text-blue-700',
    talk: 'bg-green-100 text-green-700',
    hackathon: 'bg-orange-100 text-orange-700',
    'open-day': 'bg-pink-100 text-pink-700',
    meetup: 'bg-cyan-100 text-cyan-700',
};

const STATUS_COLORS: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    published: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
};

export default function EventsAdminPage() {
    const { user } = useAuth();
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    const canManage = user && isAdmin(user);

    const loadData = async () => {
        setLoading(true);
        setEvents(await getEvents());
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const filteredEvents = useMemo(() => {
        return events.filter((e) => {
            return !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [events, searchQuery]);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`¿Eliminar "${title}"?`)) return;
        const result = await deleteEvent(id);
        if (result.success) { toast.success("Eliminado"); loadData(); }
        else toast.error(result.error || "Error");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormLoading(true);
        const formData = new FormData(e.currentTarget);
        const result = editingEvent ? await updateEvent(editingEvent.id, formData) : await createEvent(formData);
        if (result.success) {
            toast.success(editingEvent ? "Actualizado" : "Creado");
            setIsFormOpen(false);
            setEditingEvent(null);
            loadData();
        } else {
            toast.error(result.error || "Error");
        }
        setFormLoading(false);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
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
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Eventos</h1>
                    <p className="text-gray-500">Talleres, cursos y eventos del FabLab</p>
                </div>
                <Button onClick={() => { setEditingEvent(null); setIsFormOpen(true); }} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />Nuevo Evento
                </Button>
            </div>

            <div className="bg-white rounded-xl border p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Buscar eventos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 max-w-md" />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>
            ) : filteredEvents.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay eventos</h3>
                    <Button onClick={() => setIsFormOpen(true)} className="bg-purple-600"><Plus className="w-4 h-4 mr-2" />Crear Evento</Button>
                </div>
            ) : (
                <div className="bg-white rounded-xl border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Evento</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Ubicación</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredEvents.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-900 flex items-center gap-2">
                                            {event.title}
                                            {event.featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{event.description}</div>
                                    </td>
                                    <td className="px-4 py-3"><Badge className={TYPE_COLORS[event.type]}>{EVENT_TYPES[event.type]}</Badge></td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{event.startDate ? formatDate(event.startDate) : '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            {event.isOnline ? <Badge variant="outline">Online</Badge> : <><MapPin className="w-3 h-3" />{event.location || '-'}</>}
                                            {event.capacity && <span className="text-gray-400 ml-2"><UsersIcon className="w-3 h-3 inline" /> {event.capacity}</span>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"><Badge className={STATUS_COLORS[event.status]}>{event.status}</Badge></td>
                                    <td className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button size="sm" variant="ghost"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => { setEditingEvent(event); setIsFormOpen(true); }}><Pencil className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(event.id, event.title)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Eliminar</DropdownMenuItem>
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
                    <DialogHeader><DialogTitle>{editingEvent ? "Editar Evento" : "Nuevo Evento"}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div><Label>Título *</Label><Input name="title" required defaultValue={editingEvent?.title} /></div>
                        <div><Label>Tipo *</Label>
                            <Select name="type" defaultValue={editingEvent?.type || 'workshop'}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(EVENT_TYPES).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div><Label>Descripción *</Label><Textarea name="description" required defaultValue={editingEvent?.description} rows={2} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Fecha Inicio *</Label><Input name="startDate" type="datetime-local" required defaultValue={editingEvent?.startDate?.slice(0, 16)} /></div>
                            <div><Label>Fecha Fin</Label><Input name="endDate" type="datetime-local" defaultValue={editingEvent?.endDate?.slice(0, 16)} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Ubicación</Label><Input name="location" defaultValue={editingEvent?.location} placeholder="FabLab Sede..." /></div>
                            <div><Label>Capacidad</Label><Input name="capacity" type="number" defaultValue={editingEvent?.capacity} /></div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2"><Switch name="isOnline" defaultChecked={editingEvent?.isOnline} value="true" /><Label>Online</Label></div>
                            <div className="flex items-center gap-2"><Switch name="featured" defaultChecked={editingEvent?.featured} value="true" /><Label>Destacado</Label></div>
                        </div>
                        <div><Label>Estado</Label>
                            <Select name="status" defaultValue={editingEvent?.status || 'draft'}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Borrador</SelectItem>
                                    <SelectItem value="published">Publicado</SelectItem>
                                    <SelectItem value="cancelled">Cancelado</SelectItem>
                                    <SelectItem value="completed">Completado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2 justify-end pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={formLoading} className="bg-purple-600">{formLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{editingEvent ? "Guardar" : "Crear"}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
