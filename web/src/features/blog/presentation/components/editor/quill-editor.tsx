'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill-new/dist/quill.snow.css';

// Importar dinámicamente para evitar SSR
const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => (
        <div className="h-[350px] border rounded-md bg-muted/20 flex items-center justify-center">
            <span className="text-muted-foreground">Cargando editor...</span>
        </div>
    ),
});

interface QuillEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function QuillEditor({ value, onChange, placeholder }: QuillEditorProps) {
    // Configuración de módulos del editor
    const modules = useMemo(() => ({
        toolbar: [
            // Encabezados
            [{ header: [1, 2, 3, false] }],

            // Formato de texto
            ['bold', 'italic', 'underline', 'strike'],

            // Color (opcional)
            [{ color: [] }, { background: [] }],

            // Listas
            [{ list: 'ordered' }, { list: 'bullet' }],

            // Alineación
            [{ align: [] }],

            // Links e imágenes
            ['link', 'image'],

            // Limpiar formato
            ['clean'],
        ],
        clipboard: {
            matchVisual: false,
        },
    }), []);

    // Formatos permitidos
    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'list',
        'align',
        'link', 'image',
    ];

    return (
        <div className="quill-editor-wrapper [&_.ql-container]:min-h-[350px] [&_.ql-editor]:min-h-[350px] [&_.ql-toolbar]:rounded-t-md [&_.ql-toolbar]:bg-gray-50 [&_.ql-container]:rounded-b-md [&_.ql-editor.ql-blank::before]:not-italic [&_.ql-editor.ql-blank::before]:text-gray-400">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                className="bg-white rounded-md border"
            />
        </div>
    );
}
