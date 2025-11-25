"use client";

import { useState } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/cards/card';
import { ArrowLeft, Save, Send, Loader2 } from 'lucide-react';
import type { PostInput } from '../../../domain/entities';

interface PostEditorProps {
  initialData?: Partial<PostInput>;
  onGuardar: (data: PostInput) => Promise<void>;
  onPublicar?: (data: PostInput) => Promise<void>;
  onVolver: () => void;
  cargando?: boolean;
}

export function PostEditor({
  initialData,
  onGuardar,
  onPublicar,
  onVolver,
  cargando = false,
}: PostEditorProps) {
  const [titulo, setTitulo] = useState(initialData?.titulo || '');
  const [contenido, setContenido] = useState(initialData?.contenido || '');
  const [extracto, setExtracto] = useState(initialData?.extracto || '');
  const [etiquetas, setEtiquetas] = useState(initialData?.etiquetas?.join(', ') || '');

  const getData = (): PostInput => ({
    titulo,
    contenido,
    extracto: extracto || undefined,
    etiquetas: etiquetas ? etiquetas.split(',').map(t => t.trim()).filter(Boolean) : undefined,
  });

  const handleGuardar = async () => {
    if (!titulo.trim() || !contenido.trim()) return;
    await onGuardar(getData());
  };

  const handlePublicar = async () => {
    if (!titulo.trim() || !contenido.trim() || !onPublicar) return;
    await onPublicar(getData());
  };

  const isValid = titulo.trim() && contenido.trim();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onVolver}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            {initialData?.titulo ? 'Editar Post' : 'Nuevo Post'}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleGuardar}
            disabled={!isValid || cargando}
          >
            {cargando ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Guardar borrador
          </Button>
          {onPublicar && (
            <Button
              onClick={handlePublicar}
              disabled={!isValid || cargando}
            >
              {cargando ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Publicar
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Editor principal */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contenido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Título</label>
                <Input
                  placeholder="Título del post"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Contenido</label>
                <textarea
                  placeholder="Escribe el contenido del post..."
                  value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
                  className="w-full min-h-[400px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Extracto</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                placeholder="Breve descripción del post..."
                value={extracto}
                onChange={(e) => setExtracto(e.target.value)}
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Etiquetas</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="arduino, iot, proyecto (separadas por coma)"
                value={etiquetas}
                onChange={(e) => setEtiquetas(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Separa las etiquetas con comas
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
