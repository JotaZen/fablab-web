'use client';

import { useRef, useCallback } from 'react';
import { Card, CardContent } from '@/shared/ui/cards/card';
import { Button } from '@/shared/ui/buttons/button';
import { Separator } from '@/shared/ui/misc/separator';
import {
    Bold, Italic, Underline, List, ListOrdered,
    AlignLeft, AlignCenter, AlignRight,
    Heading1, Heading2, Link2, Image, Undo, Redo
} from 'lucide-react';

interface SimpleEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function SimpleEditor({ value, onChange, placeholder }: SimpleEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);

    const execCommand = useCallback((command: string, value?: string) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
        editorRef.current?.focus();
    }, [onChange]);

    const handleInput = useCallback(() => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    }, [onChange]);

    const insertLink = () => {
        const url = prompt('Ingresa la URL del enlace:');
        if (url) {
            execCommand('createLink', url);
        }
    };

    const insertImage = () => {
        const url = prompt('Ingresa la URL de la imagen:');
        if (url) {
            execCommand('insertImage', url);
        }
    };

    const ToolbarButton = ({
        onClick,
        icon: Icon,
        title
    }: {
        onClick: () => void;
        icon: typeof Bold;
        title: string;
    }) => (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            title={title}
            className="h-8 w-8 p-0"
        >
            <Icon className="h-4 w-4" />
        </Button>
    );

    return (
        <Card>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30">
                {/* Text formatting */}
                <ToolbarButton onClick={() => execCommand('bold')} icon={Bold} title="Negrita" />
                <ToolbarButton onClick={() => execCommand('italic')} icon={Italic} title="Cursiva" />
                <ToolbarButton onClick={() => execCommand('underline')} icon={Underline} title="Subrayado" />

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Headings */}
                <ToolbarButton onClick={() => execCommand('formatBlock', 'h1')} icon={Heading1} title="Título grande" />
                <ToolbarButton onClick={() => execCommand('formatBlock', 'h2')} icon={Heading2} title="Título mediano" />

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Lists */}
                <ToolbarButton onClick={() => execCommand('insertUnorderedList')} icon={List} title="Lista con viñetas" />
                <ToolbarButton onClick={() => execCommand('insertOrderedList')} icon={ListOrdered} title="Lista numerada" />

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Alignment */}
                <ToolbarButton onClick={() => execCommand('justifyLeft')} icon={AlignLeft} title="Alinear izquierda" />
                <ToolbarButton onClick={() => execCommand('justifyCenter')} icon={AlignCenter} title="Centrar" />
                <ToolbarButton onClick={() => execCommand('justifyRight')} icon={AlignRight} title="Alinear derecha" />

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Insert */}
                <ToolbarButton onClick={insertLink} icon={Link2} title="Insertar enlace" />
                <ToolbarButton onClick={insertImage} icon={Image} title="Insertar imagen" />

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Undo/Redo */}
                <ToolbarButton onClick={() => execCommand('undo')} icon={Undo} title="Deshacer" />
                <ToolbarButton onClick={() => execCommand('redo')} icon={Redo} title="Rehacer" />
            </div>

            {/* Editor */}
            <CardContent className="p-0">
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    dangerouslySetInnerHTML={{ __html: value || '' }}
                    className="min-h-[350px] p-4 focus:outline-none prose prose-sm max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
                    data-placeholder={placeholder}
                />
            </CardContent>
        </Card>
    );
}
