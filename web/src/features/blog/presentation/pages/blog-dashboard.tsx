"use client";

import { useEffect, useState } from 'react';
import { useBlog } from '../hooks/use-blog';
import { PostsList } from '../components/posts/posts-list';
import { PostEditor } from '../components/posts/post-editor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/cards/card';
import { 
  FileText, 
  Eye, 
  Send, 
  AlertCircle, 
  TrendingUp,
  PenTool,
  Calendar,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { Button } from '@/shared/ui/buttons/button';
import { Badge } from '@/shared/ui/badges/badge';
import type { Post, EstadoPost, PostInput } from '../../domain/entities';

type Vista = 'lista' | 'editor';

// Stats Card Component
function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  color = 'default'
}: { 
  title: string; 
  value: string | number; 
  description?: string;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  color?: 'default' | 'green' | 'yellow' | 'blue' | 'purple';
}) {
  const colorClasses = {
    default: 'text-muted-foreground',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    blue: 'text-blue-500',
    purple: 'text-purple-500',
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${colorClasses[color]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-xs text-green-500">+{trend.value}%</span>
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
      {/* Decorative gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${
        color === 'green' ? 'from-green-500/5' :
        color === 'yellow' ? 'from-yellow-500/5' :
        color === 'blue' ? 'from-blue-500/5' :
        color === 'purple' ? 'from-purple-500/5' :
        'from-primary/5'
      } to-transparent pointer-events-none`} />
    </Card>
  );
}

// Quick Action Card
function QuickActionCard({ 
  title, 
  description, 
  icon: Icon, 
  onClick,
  badge
}: { 
  title: string; 
  description: string;
  icon: React.ElementType;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/20 transition-all text-left w-full"
    >
      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{title}</h3>
          {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
    </button>
  );
}

// Recent Posts Preview
function RecentPostsPreview({ 
  posts, 
  onEdit 
}: { 
  posts: Post[]; 
  onEdit: (post: Post) => void;
}) {
  const recentPosts = posts.slice(0, 3);

  if (recentPosts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No hay posts recientes</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recentPosts.map((post) => (
        <button
          key={post.id}
          onClick={() => onEdit(post)}
          className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors w-full text-left"
        >
          {post.imagenDestacada ? (
            <img 
              src={post.imagenDestacada} 
              alt="" 
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{post.titulo}</h4>
            <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
              {post.extracto || 'Sin extracto'}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge 
                variant={post.estado === 'publicado' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {post.estado}
              </Badge>
              {post.vistas !== undefined && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {post.vistas}
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export function BlogDashboard() {
  const {
    posts,
    total,
    cargando,
    error,
    cargarPosts,
    crearPost,
    actualizarPost,
    publicarPost,
    despublicarPost,
    eliminarPost,
    limpiarError,
  } = useBlog();

  const [vista, setVista] = useState<Vista>('lista');
  const [postEditando, setPostEditando] = useState<Post | null>(null);
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoPost | undefined>();
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarPosts({ estado: estadoFiltro, busqueda: busqueda || undefined });
  }, [cargarPosts, estadoFiltro, busqueda]);

  const handleNuevo = () => {
    setPostEditando(null);
    setVista('editor');
  };

  const handleEditar = (post: Post) => {
    setPostEditando(post);
    setVista('editor');
  };

  const handleVolver = () => {
    setVista('lista');
    setPostEditando(null);
  };

  const handleGuardar = async (data: PostInput) => {
    if (postEditando) {
      await actualizarPost(postEditando.id, data);
    } else {
      await crearPost(data);
    }
    handleVolver();
  };

  const handlePublicar = async (data: PostInput) => {
    const post = await crearPost({ ...data, estado: 'publicado' });
    await publicarPost(post.id);
    handleVolver();
  };

  // Stats
  const publicados = posts.filter(p => p.estado === 'publicado').length;
  const borradores = posts.filter(p => p.estado === 'borrador').length;
  const totalVistas = posts.reduce((sum, p) => sum + (p.vistas || 0), 0);
  
  // Posts de esta semana
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const postsEstaSemana = posts.filter(p => p.fechaCreacion >= oneWeekAgo).length;

  if (vista === 'editor') {
    return (
      <PostEditor
        initialData={postEditando ? {
          titulo: postEditando.titulo,
          contenido: postEditando.contenido,
          extracto: postEditando.extracto,
          etiquetas: postEditando.etiquetas,
        } : undefined}
        onGuardar={handleGuardar}
        onPublicar={!postEditando ? handlePublicar : undefined}
        onVolver={handleVolver}
        cargando={cargando}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-xl bg-primary/10">
              <PenTool className="h-6 w-6 text-primary" />
            </span>
            Blog FabLab
          </h1>
          <p className="text-muted-foreground mt-2">
            Comparte proyectos, tutoriales y noticias del FabLab
          </p>
        </div>
        <Button onClick={handleNuevo} size="lg" className="gap-2">
          <Sparkles className="h-4 w-4" />
          Nuevo Post
        </Button>
      </div>

      {/* Error */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
            <Button size="sm" variant="ghost" onClick={limpiarError}>
              Cerrar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Posts"
          value={total}
          description={`${postsEstaSemana} esta semana`}
          icon={FileText}
          color="default"
        />
        <StatsCard
          title="Publicados"
          value={publicados}
          icon={Send}
          color="green"
        />
        <StatsCard
          title="Borradores"
          value={borradores}
          description="Pendientes de publicar"
          icon={FileText}
          color="yellow"
        />
        <StatsCard
          title="Total Vistas"
          value={totalVistas.toLocaleString()}
          icon={Eye}
          color="blue"
          trend={totalVistas > 0 ? { value: 12, label: 'este mes' } : undefined}
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Posts List */}
        <div className="lg:col-span-2">
          <PostsList
            posts={posts}
            cargando={cargando}
            onNuevo={handleNuevo}
            onEditar={handleEditar}
            onEliminar={eliminarPost}
            onPublicar={publicarPost}
            onDespublicar={despublicarPost}
            onBuscar={setBusqueda}
            onFiltrarEstado={setEstadoFiltro}
            estadoFiltro={estadoFiltro}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Acciones rápidas</CardTitle>
              <CardDescription>Atajos para tareas comunes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuickActionCard
                title="Nuevo proyecto"
                description="Documenta un proyecto maker"
                icon={Sparkles}
                onClick={handleNuevo}
                badge="Popular"
              />
              <QuickActionCard
                title="Tutorial"
                description="Guía paso a paso"
                icon={FileText}
                onClick={handleNuevo}
              />
              <QuickActionCard
                title="Evento"
                description="Anuncia un taller o evento"
                icon={Calendar}
                onClick={handleNuevo}
              />
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Posts recientes</CardTitle>
              <CardDescription>Últimos posts editados</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentPostsPreview posts={posts} onEdit={handleEditar} />
            </CardContent>
          </Card>

          {/* Content Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Estadísticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Promedio de vistas</span>
                  <span className="font-medium">
                    {posts.length > 0 
                      ? Math.round(totalVistas / posts.length) 
                      : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Post más visto</span>
                  <span className="font-medium">
                    {posts.length > 0 
                      ? Math.max(...posts.map(p => p.vistas || 0)) 
                      : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tasa de publicación</span>
                  <span className="font-medium">
                    {total > 0 
                      ? Math.round((publicados / total) * 100) 
                      : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
