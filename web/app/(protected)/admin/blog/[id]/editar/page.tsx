"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PostEditor } from '@/features/blog/presentation/components/posts/post-editor';
import { useBlog } from '@/features/blog/presentation/hooks/use-blog';
import { blogClient } from '@/features/blog/infrastructure/api/blog-client';
import type { Post, PostInput } from '@/features/blog/domain/entities';

export default function EditarPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { actualizarPost, cargando } = useBlog();
  const [post, setPost] = useState<Post | null>(null);
  const [cargandoPost, setCargandoPost] = useState(true);

  useEffect(() => {
    async function cargarPost() {
      try {
        const postData = await blogClient.getPost(id);
        setPost(postData);
      } catch (error) {
        console.error('Error cargando post:', error);
      } finally {
        setCargandoPost(false);
      }
    }
    cargarPost();
  }, [id]);

  const handleGuardar = async (data: PostInput) => {
    await actualizarPost(id, data);
    router.push('/admin/blog');
  };

  const handleVolver = () => {
    router.push('/admin/blog');
  };

  if (cargandoPost) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Post no encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar Post</h1>
        <p className="text-muted-foreground">
          Modifica el contenido del artículo
        </p>
      </div>
      <PostEditor
        initialData={{
          titulo: post.titulo,
          contenido: typeof post.contenido === 'string' ? post.contenido : '',
          extracto: post.extracto,
          etiquetas: post.etiquetas?.map(t => typeof t === 'string' ? t : t.tag || '').filter(Boolean) as string[],
        }}
        onGuardar={handleGuardar}
        onVolver={handleVolver}
        cargando={cargando}
      />
    </div>
  );
}
