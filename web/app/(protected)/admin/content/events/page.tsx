"use client";

import { useState, useEffect } from "react";
import { useAuth, isAdmin } from "@/features/auth";
import { Plus, Search, Loader2, ShieldAlert, Pencil, Trash2, Calendar, MoreVertical, ExternalLink } from "lucide-react";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { Card, CardContent } from "@/shared/ui/cards/card";
import { Badge } from "@/shared/ui/misc/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/misc/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/misc/dialog";
import { Label } from "@/shared/ui/labels/label";
import { Textarea } from "@/shared/ui/inputs/textarea";
import { toast } from "sonner";
import { getEvents, createEvent, updateEvent, deleteEvent } from "./actions";
import { STATUS_LABELS, type EventData } from "./data";

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
        try { setEvents(await getEvents()); }
        catch { toast.error("Error al cargar"); }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const filteredEvents = events.filter((e) =>
        !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        } else toast.error(result.error || "Error");
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
                    <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
                    <p className="text-gray-500">Talleres, cursos y charlas</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.open('/cms/collections/events', '_blank')}>
                        <ExternalLink className="w-4 h-4 mr-2" />CMS
                    </Button>
                    <Button onClick={() => { setEditingEvent(null); setIsFormOpen(true); }} className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="w-4 h-4 mr-2" />Nuevo
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl border p-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Buscar eventos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>
            ) : filteredEvents.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay eventos</h3>
                    <Button onClick={() => setIsFormOpen(true)} className="bg-purple-600">Crear Evento</Button>
                </div>
            ) : (
                <div className="bg-white rounded-xl border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Evento</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredEvents.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-900">{event.title}</div>
                                        <div className="text-sm text-gray-500">{event.location || 'Sin ubicación'}</div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {event.startDate ? new Date(event.startDate).toLocaleDateString('es-CL') : '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge className={STATUS_COLORS[event.status] || 'bg-gray-100'}>{STATUS_LABELS[event.status] || event.status}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button size="sm" variant="ghost"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => { setEditingEvent(event); setIsFormOpen(true); }}><Pencil className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => window.open(`/cms/collections/events/${event.id}`, '_blank')}><ExternalLink className="w-4 h-4 mr-2" />Abrir en CMS</DropdownMenuItem>
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
                        <div><Label>Descripción *</Label><Textarea name="description" required defaultValue={editingEvent?.description} rows={2} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Tipo *</Label>
                                <select name="type" defaultValue={editingEvent?.type || 'workshop'} className="w-full h-10 rounded-md border px-3">
                                    <option value="workshop">Taller</option>
                                    <option value="course">Curso</option>
                                    <option value="talk">Charla</option>
                                    <option value="hackathon">Hackathon</option>
                                    <option value="open-day">Open Day</option>
                                    <option value="meetup">Meetup</option>
                                </select>
                            </div>
                            <div>
                                <Label>Estado</Label>
                                <select name="status" defaultValue={editingEvent?.status || 'draft'} className="w-full h-10 rounded-md border px-3">
                                    <option value="draft">Borrador</option>
                                    <option value="published">Publicado</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Fecha Inicio *</Label><Input name="startDate" type="datetime-local" required defaultValue={editingEvent?.startDate?.slice(0, 16)} /></div>
                            <div><Label>Ubicación</Label><Input name="location" defaultValue={editingEvent?.location} /></div>
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
