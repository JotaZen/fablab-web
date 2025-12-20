"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/cards/card";
import { Users, FileText, Settings, ArrowRight } from "lucide-react";

interface ContentSection {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const contentSections: ContentSection[] = [
  {
    title: "Gestión del Equipo",
    description: "Administra los miembros del equipo, sus perfiles, roles y visibilidad en la página pública.",
    href: "/admin/content/team",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Configuración de Página",
    description: "Ajusta textos, estadísticas y contenido general de la landing page.",
    href: "/admin/content/page-settings",
    icon: <Settings className="h-6 w-6" />,
  },
  {
    title: "Blog",
    description: "Gestiona las publicaciones del blog, categorías y contenido editorial.",
    href: "/admin/blog",
    icon: <FileText className="h-6 w-6" />,
  },
];

export default function ContentAdminPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Gestión de Contenido</h1>
        <p className="text-gray-500 mt-1">
          Selecciona qué sección del contenido deseas administrar.
        </p>
      </div>

      {/* Content Sections Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {contentSections.map((section) => (
          <Link key={section.href} href={section.href} className="group">
            <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-gray-300 group-hover:bg-gray-50/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                    {section.icon}
                  </div>
                  {section.badge && (
                    <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full font-medium">
                      {section.badge}
                    </span>
                  )}
                </div>
                <CardTitle className="text-lg mt-3 group-hover:text-orange-600 transition-colors flex items-center gap-2">
                  {section.title}
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-500">
                  {section.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Info Panel */}
      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6">
        <h3 className="font-semibold text-gray-800 mb-2">💡 Tip</h3>
        <p className="text-sm text-gray-600">
          Todo el contenido se gestiona a través de Payload CMS. También puedes acceder al panel administrativo
          completo en <Link href="/cms" className="text-orange-600 hover:underline font-medium">/cms</Link> para
          una gestión más avanzada.
        </p>
      </div>
    </div>
  );
}
