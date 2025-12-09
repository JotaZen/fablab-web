
import { Navbar } from "@/shared/layout/web/navbar";
import { Footer } from "@/shared/layout/web/footer";
import { postsMock } from "@/features/landing/data/blog-mock";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Eye, User, Tag, ArrowLeft, Share2 } from "lucide-react";
import type { Metadata } from "next";

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = postsMock.find((p) => p.slug === params.slug);

    if (!post) {
        return {
            title: "Artículo no encontrado",
        };
    }

    return {
        title: `${post.titulo} | Blog FabLab`,
        description: post.extracto,
        openGraph: {
            images: post.imagenPortada ? [post.imagenPortada] : [],
        },
    };
}

export default function BlogDetailPage({ params }: Props) {
    const post = postsMock.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    // Artículos relacionados (simple lógica: misma categoría o al azar)
    const relatedPosts = postsMock
        .filter((p) => p.id !== post.id && p.categoria.id === post.categoria.id)
        .slice(0, 3);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 pt-20">
                {/* Header / Hero */}
                <div className="relative bg-gray-900 text-white py-20">
                    <div className="absolute inset-0 overflow-hidden opacity-30">
                        {post.imagenPortada && (
                            <Image
                                src={post.imagenPortada}
                                alt={post.titulo}
                                fill
                                className="object-cover blur-sm"
                            />
                        )}
                    </div>

                    <div className="container mx-auto px-6 relative z-10">
                        <Link href="/blog" className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver al Blog
                        </Link>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${post.categoria.color || "bg-orange-500"}`}>
                                {post.categoria.nombre}
                            </span>
                            {post.destacado && (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500 text-white">
                                    ⭐ Destacado
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold mb-6 max-w-4xl leading-tight">
                            {post.titulo}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden relative">
                                    {post.autor.avatar ? (
                                        <Image src={post.autor.avatar} alt={post.autor.nombre} fill className="object-cover" />
                                    ) : (
                                        <User className="w-6 h-6 m-2 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-white">{post.autor.nombre}</p>
                                    <p className="text-xs text-gray-400">{post.autor.rol}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.fechaPublicacion).toLocaleDateString("es-CL", { dateStyle: "long" })}
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {post.tiempoLectura} min lectura
                            </div>

                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                {post.vistas} vistas
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <article className="container mx-auto px-6 py-12">
                    <div className="grid lg:grid-cols-4 gap-12">
                        <div className="lg:col-span-3">
                            {/* Main Image */}
                            {post.imagenPortada && (
                                <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl mb-10">
                                    <Image
                                        src={post.imagenPortada}
                                        alt={post.titulo}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            )}

                            {/* Rich Content Simulation */}
                            <div
                                className="prose prose-lg prose-orange max-w-none bg-white p-8 md:p-12 rounded-2xl shadow-sm"
                                dangerouslySetInnerHTML={{ __html: post.contenido || `<p>${post.extracto}</p><p>Contenido completo del artículo próximamente...</p>` }}
                            />

                            {/* Tags Footer */}
                            <div className="mt-8 pt-8 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex flex-wrap gap-2">
                                    {post.etiquetas.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <button className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors">
                                    <Share2 className="w-4 h-4" />
                                    Compartir
                                </button>
                            </div>
                        </div>

                        {/* Sidebar / Related */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-24">
                                <h3 className="font-bold text-lg mb-4">Relacionados</h3>
                                <div className="space-y-4">
                                    {relatedPosts.map(rel => (
                                        <Link key={rel.id} href={`/blog/${rel.slug}`} className="block group">
                                            <div className="aspect-video relative rounded-lg overflow-hidden mb-2 bg-gray-100">
                                                {rel.imagenPortada && (
                                                    <Image src={rel.imagenPortada} alt={rel.titulo} fill className="object-cover group-hover:scale-105 transition-transform" />
                                                )}
                                            </div>
                                            <h4 className="font-medium text-gray-900 group-hover:text-orange-600 line-clamp-2 text-sm">
                                                {rel.titulo}
                                            </h4>
                                        </Link>
                                    ))}
                                    {relatedPosts.length === 0 && (
                                        <p className="text-sm text-gray-500">No hay artículos relacionados por ahora.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </main>
            <Footer />
        </>
    );
}
