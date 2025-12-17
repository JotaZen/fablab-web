'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/shared/ui/buttons/button';
import {
    Bold, Italic, Strikethrough, List, ListOrdered,
    Link as LinkIcon, Image as ImageIcon, Quote,
    Heading1, Heading2, Heading3, Undo, Redo, Code,
    AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { useCallback } from 'react';

interface TipTapEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    const addImage = useCallback(() => {
        const url = window.prompt('URL de la imagen:')
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    const setLink = useCallback(() => {
        if (!editor) return
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        if (url === null) return
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    if (!editor) {
        return null;
    }

    return (
        <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
            <div className="flex items-center gap-1 border-r pr-2 mr-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={cn("h-8 w-8 p-0", editor.isActive('heading', { level: 1 }) && "bg-muted text-primary")}
                    title="Título 1"
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={cn("h-8 w-8 p-0", editor.isActive('heading', { level: 2 }) && "bg-muted text-primary")}
                    title="Título 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={cn("h-8 w-8 p-0", editor.isActive('heading', { level: 3 }) && "bg-muted text-primary")}
                    title="Título 3"
                >
                    <Heading3 className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-1 border-r pr-2 mr-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={cn("h-8 w-8 p-0", editor.isActive('bold') && "bg-muted text-primary")}
                    title="Negrita"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={cn("h-8 w-8 p-0", editor.isActive('italic') && "bg-muted text-primary")}
                    title="Cursiva"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={cn("h-8 w-8 p-0", editor.isActive('strike') && "bg-muted text-primary")}
                    title="Tachado"
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={!editor.can().chain().focus().toggleCode().run()}
                    className={cn("h-8 w-8 p-0", editor.isActive('code') && "bg-muted text-primary")}
                    title="Código"
                >
                    <Code className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-1 border-r pr-2 mr-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn("h-8 w-8 p-0", editor.isActive('bulletList') && "bg-muted text-primary")}
                    title="Lista"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn("h-8 w-8 p-0", editor.isActive('orderedList') && "bg-muted text-primary")}
                    title="Lista Numerada"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={cn("h-8 w-8 p-0", editor.isActive('blockquote') && "bg-muted text-primary")}
                    title="Cita"
                >
                    <Quote className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-1 border-r pr-2 mr-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={setLink}
                    className={cn("h-8 w-8 p-0", editor.isActive('link') && "bg-muted text-primary")}
                    title="Enlace"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={addImage}
                    className="h-8 w-8 p-0"
                    title="Imagen"
                >
                    <ImageIcon className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-1 ml-auto">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className="h-8 w-8 p-0"
                    title="Deshacer"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className="h-8 w-8 p-0"
                    title="Rehacer"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export function TipTapEditor({ value, onChange, placeholder }: TipTapEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full my-4 border',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Escribe tu historia...',
                emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:pointer-events-none',
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[400px] px-6 py-4',
            },
            handlePaste: (view, event) => {
                const items = Array.from(event.clipboardData?.items || []);
                const imageItem = items.find(item => item.type.startsWith('image/'));

                if (imageItem) {
                    event.preventDefault();
                    const file = imageItem.getAsFile();
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const result = e.target?.result as string;
                            if (result) {
                                view.dispatch(view.state.tr.replaceSelectionWith(
                                    view.state.schema.nodes.image.create({ src: result })
                                ));
                            }
                        };
                        reader.readAsDataURL(file);
                        return true;
                    }
                }
                return false;
            },
            handleDrop: (view, event) => {
                const hasFiles = event.dataTransfer?.files?.length;
                if (!hasFiles) return false;

                const images = Array.from(event.dataTransfer.files).filter(file => file.type.startsWith('image/'));
                if (images.length === 0) return false;

                event.preventDefault();
                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });

                images.forEach(image => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const result = e.target?.result as string;
                        if (result) {
                            const node = view.state.schema.nodes.image.create({ src: result });
                            const transaction = view.state.tr.insert(coordinates?.pos || 0, node);
                            view.dispatch(transaction);
                        }
                    };
                    reader.readAsDataURL(image);
                });
                return true;
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    return (
        <div className="border rounded-md bg-background overflow-hidden flex flex-col min-h-[400px] relative">
            <MenuBar editor={editor} />

            <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
        </div>
    );
}
