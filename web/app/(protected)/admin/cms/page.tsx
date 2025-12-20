"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/cards/card";
import {
    Database,
    FileText,
    FolderTree,
    Wrench,
    Cpu,
    Calendar,
    Boxes,
    Users,
    HelpCircle,
    MessageSquare,
    ImageIcon,
    Settings,
    ExternalLink,
    Globe,
    Layout
} from "lucide-react";

interface CMSCollectionCard {
    title: string;
    description: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

const collections: CMSCollectionCard[] = [
    {
        title: "Posts",
        description: "Artículos del blog",
        href: "/cms/collections/posts",
        icon: FileText,
        color: "bg-blue-500",
    },
    {
        title: "Categorías",
        description: "Categorías del blog",
        href: "/cms/collections/categories",
        icon: FolderTree,
        color: "bg-blue-400",
    },
    {
        title: "Servicios",
        description: "Servicios del FabLab",
        href: "/cms/collections/services",
        icon: Wrench,
        color: "bg-green-500",
    },
    {
        title: "Equipamiento",
        description: "Máquinas y herramientas",
        href: "/cms/collections/equipment",
        icon: Cpu,
        color: "bg-green-400",
    },
    {
        title: "Eventos",
        description: "Talleres y cursos",
        href: "/cms/collections/events",
        icon: Calendar,
        color: "bg-purple-500",
    },
    {
        title: "Proyectos",
        description: "Proyectos realizados",
        href: "/cms/collections/projects",
        icon: Boxes,
        color: "bg-orange-500",
    },
    {
        title: "Equipo",
        description: "Miembros del equipo",
        href: "/cms/collections/team-members",
        icon: Users,
        color: "bg-cyan-500",
    },
    {
        title: "FAQs",
        description: "Preguntas frecuentes",
        href: "/cms/collections/faqs",
        icon: HelpCircle,
        color: "bg-yellow-500",
    },
    {
        title: "Testimonios",
        description: "Opiniones de usuarios",
        href: "/cms/collections/testimonials",
        icon: MessageSquare,
        color: "bg-pink-500",
    },
    {
        title: "Media",
        description: "Imágenes y archivos",
        href: "/cms/collections/media",
        icon: ImageIcon,
        color: "bg-gray-500",
    },
];

const globals: CMSCollectionCard[] = [
    {
        title: "Configuración del Sitio",
        description: "Logo, contacto, redes sociales",
        href: "/cms/globals/site-settings",
        icon: Settings,
        color: "bg-slate-600",
    },
    {
        title: "Página Principal",
        description: "Hero, secciones, estadísticas",
        href: "/cms/globals/landing-config",
        icon: Layout,
        color: "bg-slate-500",
    },
    {
        title: "Página de Equipo",
        description: "Configuración de la página de equipo",
        href: "/cms/globals/equipo-page",
        icon: Users,
        color: "bg-slate-400",
    },
];

export default function CMSDashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Database className="h-6 w-6" />
                        CMS Payload
                    </h1>
                    <p className="text-muted-foreground">
                        Gestiona todo el contenido del sitio web desde un solo lugar
                    </p>
                </div>
                <Link
                    href="/cms"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <ExternalLink className="h-4 w-4" />
                    Abrir Panel Completo
                </Link>
            </div>

            {/* Colecciones */}
            <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Colecciones
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                    {collections.map((collection) => {
                        const Icon = collection.icon;
                        return (
                            <Link key={collection.href} href={collection.href}>
                                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${collection.color} text-white`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                                                {collection.title}
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xs text-muted-foreground">
                                            {collection.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Globals */}
            <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuración Global
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {globals.map((global) => {
                        const Icon = global.icon;
                        return (
                            <Link key={global.href} href={global.href}>
                                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${global.color} text-white`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                                                {global.title}
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xs text-muted-foreground">
                                            {global.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Acciones rápidas */}
            <section className="bg-muted/50 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    <Link
                        href="/cms/collections/posts/create"
                        className="inline-flex items-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                        <FileText className="h-4 w-4" />
                        Nuevo Post
                    </Link>
                    <Link
                        href="/cms/collections/services/create"
                        className="inline-flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                        <Wrench className="h-4 w-4" />
                        Nuevo Servicio
                    </Link>
                    <Link
                        href="/cms/collections/events/create"
                        className="inline-flex items-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                    >
                        <Calendar className="h-4 w-4" />
                        Nuevo Evento
                    </Link>
                    <Link
                        href="/cms/collections/projects/create"
                        className="inline-flex items-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                    >
                        <Boxes className="h-4 w-4" />
                        Nuevo Proyecto
                    </Link>
                </div>
            </section>
        </div>
    );
}
