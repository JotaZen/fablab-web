"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth, isAdmin } from "@/features/auth";
import { Plus, Search, Loader2, ShieldAlert, Pencil, Trash2, HelpCircle, MoreVertical, Eye, EyeOff } from "lucide-react";
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
import { getFAQs, createFAQ, updateFAQ, deleteFAQ, FAQ_CATEGORIES, type FAQData } from "./actions";

const CATEGORY_COLORS: Record<string, string> = {
    general: 'bg-gray-100 text-gray-700',
    membership: 'bg-blue-100 text-blue-700',
    services: 'bg-green-100 text-green-700',
    equipment: 'bg-purple-100 text-purple-700',
    events: 'bg-orange-100 text-orange-700',
    schedule: 'bg-pink-100 text-pink-700',
    payments: 'bg-yellow-100 text-yellow-700',
};

export default function FAQsAdminPage() {
    const { user } = useAuth();
    const [faqs, setFAQs] = useState<FAQData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingFAQ, setEditingFAQ] = useState<FAQData | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    const canManage = user && isAdmin(user);

    const loadData = async () => {
        setLoading(true);
        setFAQs(await getFAQs());
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const filteredFAQs = useMemo(() => {
        return faqs.filter((f) => {
            const matchesSearch = !searchQuery || f.question.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = !categoryFilter || f.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [faqs, searchQuery, categoryFilter]);

    const handleDelete = async (id: string, question: string) => {
        if (!confirm(`¿Eliminar esta FAQ?`)) return;
        const result = await deleteFAQ(id);
        if (result.success) { toast.success("Eliminado"); loadData(); }
        else toast.error(result.error || "Error");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormLoading(true);
        const formData = new FormData(e.currentTarget);
        const result = editingFAQ ? await updateFAQ(editingFAQ.id, formData) : await createFAQ(formData);
        if (result.success) {
            toast.success(editingFAQ ? "Actualizado" : "Creado");
            setIsFormOpen(false);
            setEditingFAQ(null);
            loadData();
        } else {
            toast.error(result.error || "Error");
        }
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
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de FAQs</h1>
                    <p className="text-gray-500">Preguntas frecuentes del FabLab</p>
                </div>
                <Button onClick={() => { setEditingFAQ(null); setIsFormOpen(true); }} className="bg-yellow-600 hover:bg-yellow-700">
                    <Plus className="w-4 h-4 mr-2" />Nueva FAQ
                </Button>
            </div>

            <div className="bg-white rounded-xl border p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input placeholder="Buscar preguntas..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Button variant={categoryFilter === null ? "default" : "outline"} size="sm" onClick={() => setCategoryFilter(null)}>Todas</Button>
                        {Object.entries(FAQ_CATEGORIES).map(([key, label]) => (
                            <Button key={key} variant={categoryFilter === key ? "default" : "outline"} size="sm" onClick={() => setCategoryFilter(key)}>{label}</Button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-yellow-500" /></div>
            ) : filteredFAQs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border">
                    <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay FAQs</h3>
                    <Button onClick={() => setIsFormOpen(true)} className="bg-yellow-600"><Plus className="w-4 h-4 mr-2" />Crear FAQ</Button>
                </div>
            ) : (
                <div className="bg-white rounded-xl border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Pregunta</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Categoría</th>
                                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Orden</th>
                                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredFAQs.map((faq) => (
                                <tr key={faq.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-900">{faq.question}</div>
                                    </td>
                                    <td className="px-4 py-3"><Badge className={CATEGORY_COLORS[faq.category]}>{FAQ_CATEGORIES[faq.category as keyof typeof FAQ_CATEGORIES]}</Badge></td>
                                    <td className="px-4 py-3 text-center text-gray-500">{faq.order}</td>
                                    <td className="px-4 py-3 text-center">
                                        {faq.published ? <Eye className="w-4 h-4 text-green-500 mx-auto" /> : <EyeOff className="w-4 h-4 text-gray-400 mx-auto" />}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button size="sm" variant="ghost"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => { setEditingFAQ(faq); setIsFormOpen(true); }}><Pencil className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(faq.id, faq.question)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Eliminar</DropdownMenuItem>
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
                    <DialogHeader><DialogTitle>{editingFAQ ? "Editar FAQ" : "Nueva FAQ"}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div><Label>Pregunta *</Label><Input name="question" required defaultValue={editingFAQ?.question} /></div>
                        <div><Label>Respuesta *</Label><Textarea name="answer" required rows={4} placeholder="Escribe la respuesta..." /></div>
                        <div><Label>Categoría</Label>
                            <Select name="category" defaultValue={editingFAQ?.category || 'general'}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(FAQ_CATEGORIES).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Orden</Label><Input name="order" type="number" defaultValue={editingFAQ?.order || 0} /></div>
                            <div className="flex items-center gap-2 pt-6"><Switch name="published" defaultChecked={editingFAQ?.published ?? true} value="true" /><Label>Publicada</Label></div>
                        </div>
                        <div className="flex gap-2 justify-end pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={formLoading} className="bg-yellow-600">{formLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{editingFAQ ? "Guardar" : "Crear"}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
