"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Cpu, Code, Palette, Radio, ExternalLink, X, ChevronRight } from "lucide-react";
import { Input } from "@/shared/ui/inputs/input";
import type { ProjectPublic } from "./types";
import { CATEGORY_LABELS } from "./types";

interface ProyectosPublicPageProps {
    projects: ProjectPublic[];
    featuredProjects?: ProjectPublic[];
}

export function ProyectosPublicPage({ projects, featuredProjects = [] }: ProyectosPublicPageProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<ProjectPublic | null>(null);

    // Filter projects
    const filteredProjects = projects.filter((project) => {
        const matchesSearch = !searchQuery ||
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || project.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = [
        { value: null, label: 'Todos', icon: null },
        { value: 'hardware', label: 'Hardware', icon: Cpu },
        { value: 'software', label: 'Software', icon: Code },
        { value: 'design', label: 'Diseño', icon: Palette },
        { value: 'iot', label: 'IoT', icon: Radio },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl">
                        <span className="inline-block px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full text-sm font-semibold mb-6">
                            Portafolio
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Proyectos del <span className="text-orange-500">FabLab</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8">
                            Explora los proyectos desarrollados por nuestra comunidad.
                            Desde prototipos IoT hasta diseños 3D innovadores.
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                                <span className="text-2xl font-bold text-orange-400">{projects.length}</span>
                                <span className="text-gray-400">Proyectos</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                                <span className="text-2xl font-bold text-orange-400">{featuredProjects.length}</span>
                                <span className="text-gray-400">Destacados</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Projects */}
            {featuredProjects.length > 0 && (
                <section className="py-16 bg-white border-b">
                    <div className="container mx-auto px-6">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Proyectos Destacados</h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredProjects.slice(0, 3).map((project) => (
                                <div
                                    key={project.id}
                                    onClick={() => setSelectedProject(project)}
                                    className="group cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl overflow-hidden border border-orange-200 hover:shadow-xl transition-all"
                                >
                                    <div className="aspect-video relative">
                                        {project.featuredImage ? (
                                            <Image
                                                src={project.featuredImage}
                                                alt={project.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-orange-200 flex items-center justify-center">
                                                <Cpu className="w-12 h-12 text-orange-400" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${CATEGORY_LABELS[project.category]?.bgColor} ${CATEGORY_LABELS[project.category]?.color}`}>
                                                {CATEGORY_LABELS[project.category]?.label}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Filters & Search */}
            <section className="py-8 bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Buscar proyectos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {categories.map((cat) => {
                                const Icon = cat.icon;
                                const isActive = selectedCategory === cat.value;
                                return (
                                    <button
                                        key={cat.value || 'all'}
                                        onClick={() => setSelectedCategory(cat.value)}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive
                                                ? 'bg-orange-500 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {Icon && <Icon className="w-4 h-4" />}
                                        {cat.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    {filteredProjects.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No se encontraron proyectos</h3>
                            <p className="text-gray-500">Intenta con otros filtros de búsqueda</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProjects.map((project) => (
                                <div
                                    key={project.id}
                                    onClick={() => setSelectedProject(project)}
                                    className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg hover:border-orange-200 transition-all"
                                >
                                    <div className="aspect-video relative bg-gray-100">
                                        {project.featuredImage ? (
                                            <Image
                                                src={project.featuredImage}
                                                alt={project.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Cpu className="w-10 h-10 text-gray-300" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 left-2">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${CATEGORY_LABELS[project.category]?.bgColor} ${CATEGORY_LABELS[project.category]?.color}`}>
                                                {CATEGORY_LABELS[project.category]?.label}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                                                {project.title}
                                            </h3>
                                            <span className="text-xs text-gray-400">{project.year}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{project.description}</p>
                                        {project.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {project.technologies.slice(0, 3).map((tech, idx) => (
                                                    <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Project Modal */}
            {selectedProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProject(null)}>
                    <div
                        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header Image */}
                        <div className="relative aspect-video">
                            {selectedProject.featuredImage ? (
                                <Image
                                    src={selectedProject.featuredImage}
                                    alt={selectedProject.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                                    <Cpu className="w-20 h-20 text-orange-400" />
                                </div>
                            )}
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-4 left-4">
                                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${CATEGORY_LABELS[selectedProject.category]?.bgColor} ${CATEGORY_LABELS[selectedProject.category]?.color}`}>
                                    {CATEGORY_LABELS[selectedProject.category]?.label}
                                </span>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedProject.title}</h2>
                                    <span className="text-sm text-gray-500">Año {selectedProject.year}</span>
                                </div>
                            </div>

                            <p className="text-gray-700 mb-6">{selectedProject.description}</p>

                            {selectedProject.objective && (
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-2">Objetivo</h4>
                                    <p className="text-gray-600 text-sm">{selectedProject.objective}</p>
                                </div>
                            )}

                            {selectedProject.problemSolved && (
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-2">Problema que Resuelve</h4>
                                    <p className="text-gray-600 text-sm">{selectedProject.problemSolved}</p>
                                </div>
                            )}

                            {/* Technologies */}
                            {selectedProject.technologies.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">Tecnologías</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.technologies.map((tech, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Creators */}
                            {selectedProject.creators.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">Creadores</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {selectedProject.creators.map((creator, idx) => (
                                            <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                                                <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-medium text-sm">
                                                    {creator.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{creator.name}</p>
                                                    {creator.role && <p className="text-xs text-gray-500">{creator.role}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Links */}
                            {selectedProject.links && selectedProject.links.length > 0 && (
                                <div className="flex flex-wrap gap-3 pt-4 border-t">
                                    {selectedProject.links.map((link, idx) => (
                                        <a 
                                            key={idx} 
                                            href={link.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
