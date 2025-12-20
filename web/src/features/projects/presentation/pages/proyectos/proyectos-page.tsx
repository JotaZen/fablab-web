"use client";

import { useState, useMemo } from "react";
import { Button } from "@/shared/ui/buttons/button";
import { HeroCarousel } from "./hero-carousel";
import { SearchFilter } from "./search-filter";
import { ProjectCard } from "./project-card";
import { ProjectDetailModal } from "./project-detail-modal";
import { proyectosMock } from "./data";
import type { Proyecto, CategoriaFiltro } from "./types";

export function ProyectosPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoriaActiva, setCategoriaActiva] = useState<CategoriaFiltro>("Todos");
    const [selectedProject, setSelectedProject] = useState<Proyecto | null>(null);

    // Filter projects
    const proyectosFiltrados = useMemo(() => {
        return proyectosMock.filter((proyecto) => {
            const matchesSearch =
                searchQuery === "" ||
                proyecto.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                proyecto.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
                proyecto.tecnologias.some((tech) =>
                    tech.toLowerCase().includes(searchQuery.toLowerCase())
                );

            const matchesCategoria =
                categoriaActiva === "Todos" || proyecto.categoria === categoriaActiva;

            return matchesSearch && matchesCategoria;
        });
    }, [searchQuery, categoriaActiva]);

    const handleOpenDetail = (proyecto: Proyecto) => {
        setSelectedProject(proyecto);
    };

    const handleCloseDetail = () => {
        setSelectedProject(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Carousel */}
            <HeroCarousel />

            {/* Search and Filters */}
            <SearchFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                categoriaActiva={categoriaActiva}
                setCategoriaActiva={setCategoriaActiva}
            />

            {/* Projects Section */}
            <section className="container mx-auto px-6 py-12">
                {/* Results count */}
                <div className="flex items-center justify-between mb-8">
                    <p className="text-gray-600">
                        {proyectosFiltrados.length === proyectosMock.length
                            ? `${proyectosFiltrados.length} proyectos disponibles`
                            : `${proyectosFiltrados.length} de ${proyectosMock.length} proyectos`}
                    </p>
                    {(searchQuery || categoriaActiva !== "Todos") && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSearchQuery("");
                                setCategoriaActiva("Todos");
                            }}
                            className="text-orange-600 hover:text-orange-700"
                        >
                            Limpiar filtros
                        </Button>
                    )}
                </div>

                {/* Projects Grid */}
                {proyectosFiltrados.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            No se encontraron proyectos
                        </h3>
                        <p className="text-gray-500">
                            Intenta con otros términos de búsqueda o cambia los filtros
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {proyectosFiltrados.map((proyecto) => (
                            <ProjectCard
                                key={proyecto.id}
                                proyecto={proyecto}
                                onOpenDetail={handleOpenDetail}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Project Detail Modal */}
            {selectedProject && (
                <ProjectDetailModal
                    proyecto={selectedProject}
                    isOpen={!!selectedProject}
                    onClose={handleCloseDetail}
                />
            )}
        </div>
    );
}
