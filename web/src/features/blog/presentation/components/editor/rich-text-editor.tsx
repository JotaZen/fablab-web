'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  Link,
  Image as ImageIcon,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  Edit3,
  Maximize2,
  Minimize2,
  Table,
  Minus,
  FileText
} from 'lucide-react';
import { Button } from '@/shared/ui/buttons/button';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/misc/tabs';
import { Toggle } from '@/shared/ui/misc/toggle';
import { Separator } from '@/shared/ui/misc/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/misc/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/misc/dialog';
import { Input } from '@/shared/ui/inputs/input';
import { Label } from '@/shared/ui/labels/label';
import { cn } from '@/shared/utils';
import { BLOG_TEMPLATES, BlogTemplate } from '../../../domain/value-objects/templates';

// Simplified image data for editor
interface EditorImageData {
  url: string;
  alt?: string;
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

function ToolbarButton({ icon, label, onClick, active, disabled }: ToolbarButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            size="sm"
            pressed={active}
            onPressedChange={onClick}
            disabled={disabled}
            className="h-8 w-8 p-0"
          >
            {icon}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function MarkdownPreview({ content }: { content: string }) {
  // Simple markdown to HTML conversion for preview
  const parseMarkdown = (md: string): string => {
    const html = md
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/__(.*?)__/gim, '<strong>$1</strong>')
      .replace(/_(.*?)_/gim, '<em>$1</em>')
      // Code blocks
      .replace(/```(\w*)\n([\s\S]*?)```/gim, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code>$2</code></pre>')
      .replace(/`(.*?)`/gim, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-primary underline hover:no-underline">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="rounded-lg max-w-full my-4" />')
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 italic my-4">$1</blockquote>')
      // Horizontal rules
      .replace(/^---$/gim, '<hr class="my-8 border-t border-border" />')
      // Lists
      .replace(/^\s*- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^\s*\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
      // Line breaks
      .replace(/\n/gim, '<br />');

    return html;
  };

  return (
    <div 
      className="prose prose-sm dark:prose-invert max-w-none p-4"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
}

// Template Selector Component
function TemplateSelector({ 
  onSelect, 
  onClose 
}: { 
  onSelect: (template: BlogTemplate) => void;
  onClose: () => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {BLOG_TEMPLATES.map((template) => (
        <button
          key={template.id}
          onClick={() => {
            onSelect(template);
            onClose();
          }}
          className="flex flex-col items-start p-4 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors text-left"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{template.icono}</span>
            <span className="font-semibold">{template.nombre}</span>
          </div>
          <p className="text-sm text-muted-foreground">{template.descripcion}</p>
          <div className="flex flex-wrap gap-1 mt-3">
            {template.etiquetasSugeridas.slice(0, 3).map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
}

// Link Dialog Component
function LinkDialog({ 
  onInsert,
  children 
}: { 
  onInsert: (text: string, url: string) => void;
  children: React.ReactNode;
}) {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [open, setOpen] = useState(false);

  const handleInsert = () => {
    if (url) {
      onInsert(text || url, url);
      setText('');
      setUrl('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insertar enlace</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="link-text">Texto</Label>
            <Input
              id="link-text"
              value={text}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
              placeholder="Texto del enlace"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              value={url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <Button onClick={handleInsert} className="w-full">
            Insertar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Image Dialog Component  
function ImageDialog({ 
  onInsert,
  children 
}: { 
  onInsert: (image: EditorImageData) => void;
  children: React.ReactNode;
}) {
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [open, setOpen] = useState(false);

  const handleInsert = () => {
    if (url) {
      onInsert({ url, alt: alt || undefined });
      setUrl('');
      setAlt('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insertar imagen</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-url">URL de la imagen</Label>
            <Input
              id="image-url"
              value={url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image-alt">Texto alternativo (opcional)</Label>
            <Input
              id="image-alt"
              value={alt}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAlt(e.target.value)}
              placeholder="Descripción de la imagen"
            />
          </div>
          <Button onClick={handleInsert} className="w-full" disabled={!url}>
            Insertar imagen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Table Dialog Component
function TableDialog({ 
  onInsert,
  children 
}: { 
  onInsert: (rows: number, cols: number) => void;
  children: React.ReactNode;
}) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [open, setOpen] = useState(false);

  const handleInsert = () => {
    onInsert(rows, cols);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insertar tabla</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="table-rows">Filas</Label>
              <Input
                id="table-rows"
                type="number"
                min={1}
                max={20}
                value={rows}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRows(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="table-cols">Columnas</Label>
              <Input
                id="table-cols"
                type="number"
                min={1}
                max={10}
                value={cols}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCols(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
          <Button onClick={handleInsert} className="w-full">
            Insertar tabla
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Escribe tu contenido aquí...',
  className,
  minHeight = '400px',
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Insert text at cursor position
  const insertAtCursor = useCallback((before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;
    
    const newValue = 
      value.substring(0, start) + 
      before + 
      selectedText + 
      after + 
      value.substring(end);
    
    onChange(newValue);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [value, onChange]);

  // Insert text replacing selection
  const replaceSelection = useCallback((text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newValue = value.substring(0, start) + text + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + text.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [value, onChange]);

  // Toolbar actions
  const actions = {
    bold: () => insertAtCursor('**', '**', 'texto en negrita'),
    italic: () => insertAtCursor('*', '*', 'texto en cursiva'),
    underline: () => insertAtCursor('<u>', '</u>', 'texto subrayado'),
    h1: () => insertAtCursor('# ', '', 'Título principal'),
    h2: () => insertAtCursor('## ', '', 'Subtítulo'),
    h3: () => insertAtCursor('### ', '', 'Encabezado'),
    quote: () => insertAtCursor('> ', '', 'Cita'),
    code: () => insertAtCursor('`', '`', 'código'),
    codeBlock: () => insertAtCursor('```\n', '\n```', 'código'),
    ul: () => insertAtCursor('- ', '', 'Elemento de lista'),
    ol: () => insertAtCursor('1. ', '', 'Elemento numerado'),
    hr: () => replaceSelection('\n---\n'),
    link: (text: string, url: string) => replaceSelection(`[${text}](${url})`),
    image: (image: EditorImageData) => replaceSelection(`![${image.alt || 'imagen'}](${image.url})`),
    table: (rows: number, cols: number) => {
      const header = '| ' + Array(cols).fill('Encabezado').join(' | ') + ' |';
      const separator = '| ' + Array(cols).fill('---').join(' | ') + ' |';
      const dataRows = Array(rows - 1)
        .fill('| ' + Array(cols).fill('celda').join(' | ') + ' |')
        .join('\n');
      replaceSelection(`\n${header}\n${separator}\n${dataRows}\n`);
    },
  };

  // Handle template selection
  const handleTemplateSelect = (template: BlogTemplate) => {
    onChange(template.contenido);
    setShowTemplates(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!textareaRef.current || document.activeElement !== textareaRef.current) return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            insertAtCursor('**', '**', 'texto en negrita');
            break;
          case 'i':
            e.preventDefault();
            insertAtCursor('*', '*', 'texto en cursiva');
            break;
          case 'u':
            e.preventDefault();
            insertAtCursor('<u>', '</u>', 'texto subrayado');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [insertAtCursor]);

  return (
    <div 
      className={cn(
        'border rounded-lg overflow-hidden bg-background',
        isFullscreen && 'fixed inset-4 z-50 shadow-2xl',
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30">
        {/* Templates */}
        <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <FileText className="h-4 w-4" />
              Plantillas
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Seleccionar plantilla</DialogTitle>
            </DialogHeader>
            <TemplateSelector 
              onSelect={handleTemplateSelect} 
              onClose={() => setShowTemplates(false)} 
            />
          </DialogContent>
        </Dialog>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text formatting */}
        <ToolbarButton icon={<Bold className="h-4 w-4" />} label="Negrita (Ctrl+B)" onClick={actions.bold} />
        <ToolbarButton icon={<Italic className="h-4 w-4" />} label="Cursiva (Ctrl+I)" onClick={actions.italic} />
        <ToolbarButton icon={<Underline className="h-4 w-4" />} label="Subrayado (Ctrl+U)" onClick={actions.underline} />

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headers */}
        <ToolbarButton icon={<Heading1 className="h-4 w-4" />} label="Título 1" onClick={actions.h1} />
        <ToolbarButton icon={<Heading2 className="h-4 w-4" />} label="Título 2" onClick={actions.h2} />
        <ToolbarButton icon={<Heading3 className="h-4 w-4" />} label="Título 3" onClick={actions.h3} />

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists */}
        <ToolbarButton icon={<List className="h-4 w-4" />} label="Lista" onClick={actions.ul} />
        <ToolbarButton icon={<ListOrdered className="h-4 w-4" />} label="Lista numerada" onClick={actions.ol} />
        <ToolbarButton icon={<Quote className="h-4 w-4" />} label="Cita" onClick={actions.quote} />

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Code */}
        <ToolbarButton icon={<Code className="h-4 w-4" />} label="Código" onClick={actions.code} />
        
        {/* Link */}
        <LinkDialog onInsert={actions.link}>
          <Toggle size="sm" className="h-8 w-8 p-0">
            <Link className="h-4 w-4" />
          </Toggle>
        </LinkDialog>

        {/* Image */}
        <ImageDialog onInsert={actions.image}>
          <Toggle size="sm" className="h-8 w-8 p-0" aria-label="Insertar imagen">
            <ImageIcon className="h-4 w-4" />
          </Toggle>
        </ImageDialog>

        {/* Table */}
        <TableDialog onInsert={actions.table}>
          <Toggle size="sm" className="h-8 w-8 p-0">
            <Table className="h-4 w-4" />
          </Toggle>
        </TableDialog>

        {/* Horizontal rule */}
        <ToolbarButton icon={<Minus className="h-4 w-4" />} label="Línea horizontal" onClick={actions.hr} />

        <div className="flex-1" />

        {/* View controls */}
        <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as 'edit' | 'preview')}>
          <TabsList className="h-8">
            <TabsTrigger value="edit" className="text-xs px-3">
              <Edit3 className="h-3 w-3 mr-1" />
              Editar
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs px-3">
              <Eye className="h-3 w-3 mr-1" />
              Vista previa
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Editor/Preview area */}
      <div style={{ minHeight }}>
        {activeTab === 'edit' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              'w-full h-full p-4 resize-none bg-transparent',
              'font-mono text-sm',
              'focus:outline-none focus:ring-0',
              'placeholder:text-muted-foreground'
            )}
            style={{ minHeight }}
          />
        ) : (
          <div className="h-full overflow-y-auto" style={{ minHeight }}>
            {value ? (
              <MarkdownPreview content={value} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No hay contenido para previsualizar
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer with stats */}
      <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground">
        <span>
          {value.length} caracteres · {value.split(/\s+/).filter(Boolean).length} palabras
        </span>
        <span>Markdown</span>
      </div>
    </div>
  );
}

export default RichTextEditor;
