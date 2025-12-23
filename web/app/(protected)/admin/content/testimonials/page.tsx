"use client";

import { useState, useEffect } from "react";
import { useAuth, isAdmin } from "@/features/auth";
import { Plus, Search, Loader2, ShieldAlert, Pencil, Trash2, MessageSquare, MoreVertical, ExternalLink, Star } from "lucide-react";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { Card, CardContent } from "@/shared/ui/cards/card";
import { Badge } from "@/shared/ui/misc/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/misc/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/misc/dialog";
import { Label } from "@/shared/ui/labels/label";
import { Textarea } from "@/shared/ui/inputs/textarea";
import { toast } from "sonner";
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "./actions";
import type { TestimonialData } from "./data";

export default function TestimonialsAdminPage() {
    const { user } = useAuth();
    const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<TestimonialData | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    const canManage = user && isAdmin(user);

    const loadData = async () => {
        setLoading(true);
        try { setTestimonials(await getTestimonials()); }
        catch { toast.error("Error al cargar"); }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const filteredTestimonials = testimonials.filter((t) =>
        !searchQuery || t.author.toLowerCase().includes(searchQuery.toLowerCase()) || t.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: string, author: string) => {
        if (!confirm(`¿Eliminar testimonio de "${author}"?`)) return;
        const result = await deleteTestimonial(id);
        if (result.success) { toast.success("Eliminado"); loadData(); }
        else toast.error(result.error || "Error");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormLoading(true);
        const formData = new FormData(e.currentTarget);
        const result = editingTestimonial ? await updateTestimonial(editingTestimonial.id, formData) : await createTestimonial(formData);
        if (result.success) {
            toast.success(editingTestimonial ? "Actualizado" : "Creado");
            setIsFormOpen(false);
            setEditingTestimonial(null);
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
                    <h1 className="text-2xl font-bold text-gray-900">Testimonios</h1>
                    <p className="text-gray-500">Opiniones de usuarios</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.open('/cms/collections/testimonials', '_blank')}>
                        <ExternalLink className="w-4 h-4 mr-2" />CMS
                    </Button>
                    <Button onClick={() => { setEditingTestimonial(null); setIsFormOpen(true); }} className="bg-cyan-600 hover:bg-cyan-700">
                        <Plus className="w-4 h-4 mr-2" />Nuevo
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl border p-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Buscar testimonios..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-cyan-500" /></div>
            ) : filteredTestimonials.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay testimonios</h3>
                    <Button onClick={() => setIsFormOpen(true)} className="bg-cyan-600">Crear Testimonio</Button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTestimonials.map((testimonial) => (
                        <Card key={testimonial.id} className="relative">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="font-medium text-gray-900">{testimonial.author}</div>
                                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button size="sm" variant="ghost"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => { setEditingTestimonial(testimonial); setIsFormOpen(true); }}><Pencil className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => window.open(`/cms/collections/testimonials/${testimonial.id}`, '_blank')}><ExternalLink className="w-4 h-4 mr-2" />CMS</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(testimonial.id, testimonial.author)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Eliminar</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-3">{testimonial.content}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
                                </div>
                                <div className="flex gap-1 mt-2">
                                    <Badge className={testimonial.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                                        {testimonial.published ? 'Publicado' : 'Borrador'}
                                    </Badge>
                                    {testimonial.featured && <Badge className="bg-yellow-100 text-yellow-700">Destacado</Badge>}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader><DialogTitle>{editingTestimonial ? "Editar Testimonio" : "Nuevo Testimonio"}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Nombre *</Label><Input name="author" required defaultValue={editingTestimonial?.author} /></div>
                            <div><Label>Cargo</Label><Input name="role" defaultValue={editingTestimonial?.role} /></div>
                        </div>
                        <div><Label>Testimonio *</Label><Textarea name="content" required defaultValue={editingTestimonial?.content} rows={3} /></div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label>Rating</Label>
                                <select name="rating" defaultValue={editingTestimonial?.rating || 5} className="w-full h-10 rounded-md border px-3">
                                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                                <input type="checkbox" name="featured" value="true" defaultChecked={editingTestimonial?.featured} />
                                <Label>Destacado</Label>
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                                <input type="checkbox" name="published" value="true" defaultChecked={editingTestimonial?.published ?? true} />
                                <Label>Publicado</Label>
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={formLoading} className="bg-cyan-600">{formLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{editingTestimonial ? "Guardar" : "Crear"}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
