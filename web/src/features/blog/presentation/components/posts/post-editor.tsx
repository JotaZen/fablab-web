'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Card, CardContent } from '@/shared/ui/cards/card';
import { ArrowLeft, Save, Send, Loader2, Clock } from 'lucide-react';
import { RichTextEditor } from '../editor/rich-text-editor';
import { EditorSidebar } from './editor-sidebar';
import { type ImageData } from '../media/image-uploader';
import { type BlogTemplate } from '../../../domain/value-objects/templates';
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
  const [etiquetas, setEtiquetas] = useState<string[]>(initialData?.etiquetas || []);
  const [imagenDestacada, setImagenDestacada] = useState<ImageData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<BlogTemplate | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save draft (every 30 seconds if there are changes)
  useEffect(() => {
    const hasContent = titulo.trim() || contenido.trim();
    if (!hasContent) return;

    setAutoSaveStatus('unsaved');
    
    const timer = setTimeout(() => {
      setAutoSaveStatus('saving');
      setTimeout(() => {
        setAutoSaveStatus('saved');
        setLastSaved(new Date());
      }, 500);
    }, 30000);

    return () => clearTimeout(timer);
  }, [titulo, contenido, extracto, etiquetas]);

  // Apply template
  const applyTemplate = (template: BlogTemplate) => {
    setContenido(template.contenido);
    setExtracto(template.extracto || '');
    setEtiquetas(template.etiquetasSugeridas);
    setSelectedTemplate(template);
  };

  const getData = (): PostInput => ({
    titulo,
    contenido,
    extracto: extracto || undefined,
    etiquetas: etiquetas.length > 0 ? etiquetas : undefined,
    imagenDestacada: imagenDestacada?.url,
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

  // Tag suggestions
  const tagSuggestions = selectedTemplate?.etiquetasSugeridas || [
    'fablab', 'maker', 'arduino', 'iot', 'impresion3d', 'electronica',
    'robotica', 'programacion', 'tutorial', 'proyecto', 'evento', 'taller'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onVolver}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {initialData?.titulo ? 'Editar Post' : 'Nuevo Post'}
            </h1>
            {selectedTemplate && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <span>{selectedTemplate.icono}</span>
                Plantilla: {selectedTemplate.nombre}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Auto-save status */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {autoSaveStatus === 'saving' && (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Guardando...</span>
              </>
            )}
            {autoSaveStatus === 'saved' && lastSaved && (
              <>
                <Clock className="h-3 w-3" />
                <span>Guardado {lastSaved.toLocaleTimeString()}</span>
              </>
            )}
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
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Editor principal */}
        <div className="lg:col-span-2 space-y-4">
          {/* Título */}
          <Card>
            <CardContent className="pt-6">
              <Input
                placeholder="Título del post"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="text-2xl font-bold border-0 px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
              />
            </CardContent>
          </Card>

          {/* Rich Text Editor */}
          <RichTextEditor
            value={contenido}
            onChange={setContenido}
            placeholder="Escribe el contenido del post o selecciona una plantilla..."
            minHeight="500px"
          />
        </div>

        {/* Sidebar */}
        <EditorSidebar
          selectedTemplate={selectedTemplate}
          onSelectTemplate={applyTemplate}
          imagenDestacada={imagenDestacada}
          onImageChange={setImagenDestacada}
          extracto={extracto}
          onExtractoChange={setExtracto}
          etiquetas={etiquetas}
          onEtiquetasChange={setEtiquetas}
          tagSuggestions={tagSuggestions}
          contenido={contenido}
        />
      </div>
    </div>
  );
}
