"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth, isAdmin } from "@/features/auth";
import { Plus, Search, Loader2, ShieldAlert, Star, Pencil, Trash2, MessageSquare, MoreVertical, Eye, EyeOff } from "lucide-react";
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
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, type TestimonialData } from "./actions";

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
        setTestimonials(await getTestimonials());
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const filteredTestimonials = useMemo(() => {
        return testimonials.filter((t) => {
            return !searchQuery || t.author.toLowerCase().includes(searchQuery.toLowerCase()) || t.content.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [testimonials, searchQuery]);

    const handleDelete = async (id: string) => {
        if (!confirm(`¿Eliminar este testimonio?`)) return;
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
        } else {
            toast.error(result.error || "Error");
        }
        setFormLoading(false);
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
        ));
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
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Testimonios</h1>
                    <p className="text-gray-500">Opiniones de usuarios del FabLab</p>
                </div>
                <Button onClick={() => { setEditingTestimonial(null); setIsFormOpen(true); }} className="bg-pink-600 hover:bg-pink-700">
                    <Plus className="w-4 h-4 mr-2" />Nuevo Testimonio
                </Button>
            </div>

            <div className="bg-white rounded-xl border p-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Buscar testimonios..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-pink-500" /></div>
            ) : filteredTestimonials.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay testimonios</h3>
                    <Button onClick={() => setIsFormOpen(true)} className="bg-pink-600"><Plus className="w-4 h-4 mr-2" />Crear Testimonio</Button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTestimonials.map((testimonial) => (
                        <Card key={testimonial.id} className="relative group">
                            <CardContent className="p-4">
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button size="sm" variant="ghost" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => { setEditingTestimonial(testimonial); setIsFormOpen(true); }}><Pencil className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(testimonial.id)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Eliminar</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex">{renderStars(testimonial.rating)}</div>
                                    {testimonial.featured && <Badge className="bg-yellow-100 text-yellow-700"><Star className="w-3 h-3 mr-1" />Destacado</Badge>}
                                    {!testimonial.published && <Badge variant="outline"><EyeOff className="w-3 h-3 mr-1" />Oculto</Badge>}
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-3 mb-3">"{testimonial.content}"</p>
                                <div className="text-sm">
                                    <span className="font-medium text-gray-900">{testimonial.author}</span>
                                    {testimonial.role && <span className="text-gray-500"> · {testimonial.role}</span>}
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
                            <div><Label>Autor *</Label><Input name="author" required defaultValue={editingTestimonial?.author} /></div>
                            <div><Label>Cargo/Rol</Label><Input name="role" defaultValue={editingTestimonial?.role} placeholder="Estudiante, Emprendedor..." /></div>
                        </div>
                        <div><Label>Testimonio *</Label><Textarea name="content" required defaultValue={editingTestimonial?.content} rows={3} placeholder="Escribe el testimonio..." /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Calificación</Label>
                                <Select name="rating" defaultValue={String(editingTestimonial?.rating || 5)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {[5, 4, 3, 2, 1].map((r) => (
                                            <SelectItem key={r} value={String(r)}>{r} estrella{r > 1 ? 's' : ''}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div><Label>Orden</Label><Input name="order" type="number" defaultValue={editingTestimonial?.order || 0} /></div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2"><Switch name="featured" defaultChecked={editingTestimonial?.featured} value="true" /><Label>Destacado</Label></div>
                            <div className="flex items-center gap-2"><Switch name="published" defaultChecked={editingTestimonial?.published ?? true} value="true" /><Label>Publicado</Label></div>
                        </div>
                        <div className="flex gap-2 justify-end pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={formLoading} className="bg-pink-600">{formLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{editingTestimonial ? "Guardar" : "Crear"}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
