"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBlogClient } from '../../infrastructure/api/blog-client';
import { PostCard } from '../components/posts/post-card';
import { Button } from '@/shared/ui/buttons/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import type { Post } from '../../domain/entities';

export function BlogSection() {
  const [postsRecientes, setPostsRecientes] = useState<Post[]>([]);
  const [postsPopulares, setPostsPopulares] = useState<Post[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarPosts() {
      try {
        const client = getBlogClient();
        const [recientes, populares] = await Promise.all([
          client.getPostsRecientes(3),
          client.getPostsPopulares(3),
        ]);
        setPostsRecientes(recientes);
        setPostsPopulares(populares);
      } catch (error) {
        console.error('Error cargando posts:', error);
      } finally {
        setCargando(false);
      }
    }
    cargarPosts();
  }, []);

  if (cargando) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </section>
    );
  }

  // Si no hay posts, no mostrar la sección
  if (postsRecientes.length === 0 && postsPopulares.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Últimos Posts */}
        {postsRecientes.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Últimos Posts</h2>
                <p className="text-muted-foreground mt-2">
                  Las últimas novedades y proyectos del FabLab
                </p>
              </div>
              <Link href="/blog">
                <Button variant="outline" className="group">
                  Ver todos
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {postsRecientes.map((post, index) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  variant={index === 0 ? 'featured' : 'default'}
                />
              ))}
            </div>
          </div>
        )}

        {/* Posts Populares */}
        {postsPopulares.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Más Populares</h2>
                <p className="text-muted-foreground mt-2">
                  Los artículos más leídos por nuestra comunidad
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {postsPopulares.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  variant="compact"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
