"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PostEditor } from '@/features/blog/presentation/components/posts/post-editor';
import { useBlog } from '@/features/blog/presentation/hooks/use-blog';
import type { PostInput } from '@/features/blog/domain/entities';

export default function NuevoPostPage() {
  const router = useRouter();
  const { crearPost, publicarPost, cargando } = useBlog();

  const handleGuardar = async (data: PostInput) => {
    await crearPost(data);
    router.push('/admin/blog');
  };

  const handlePublicar = async (data: PostInput) => {
    const post = await crearPost({ ...data, estado: 'publicado' });
    await publicarPost(post.id);
    router.push('/admin/blog');
  };

  const handleVolver = () => {
    router.push('/admin/blog');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nuevo Post</h1>
        <p className="text-muted-foreground">
          Crea un nuevo artículo para el blog del FabLab
        </p>
      </div>
      <PostEditor
        onGuardar={handleGuardar}
        onPublicar={handlePublicar}
        onVolver={handleVolver}
        cargando={cargando}
      />
    </div>
  );
}
