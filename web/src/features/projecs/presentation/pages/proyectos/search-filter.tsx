"use client";

import { useState } from "react";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { CATEGORIAS, type CategoriaFiltro } from "./types";

interface SearchFilterProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    categoriaActiva: CategoriaFiltro;
    setCategoriaActiva: (categoria: CategoriaFiltro) => void;
}

export function SearchFilter({
    searchQuery,
    setSearchQuery,
    categoriaActiva,
    setCategoriaActiva,
}: SearchFilterProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-6 py-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search Input */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Buscar proyectos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-10 py-3 w-full rounded-full border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Desktop Filters */}
                    <div className="hidden md:flex items-center gap-2">
                        {CATEGORIAS.map((cat) => (
                            <Button
                                key={cat}
                                variant={categoriaActiva === cat ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCategoriaActiva(cat)}
                                className={`rounded-full transition-all duration-300 ${categoriaActiva === cat
                                        ? "bg-orange-500 text-white border-transparent hover:bg-orange-600"
                                        : "border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600"
                                    }`}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>

                    {/* Mobile Filter Toggle */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="md:hidden flex items-center gap-2 rounded-full"
                    >
                        <Filter className="w-4 h-4" />
                        Filtros
                        <ChevronDown
                            className={`w-4 h-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                        />
                    </Button>
                </div>

                {/* Mobile Filters Dropdown */}
                {isFilterOpen && (
                    <div className="md:hidden overflow-hidden pt-4">
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIAS.map((cat) => (
                                <Button
                                    key={cat}
                                    variant={categoriaActiva === cat ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                        setCategoriaActiva(cat);
                                        setIsFilterOpen(false);
                                    }}
                                    className={`rounded-full ${categoriaActiva === cat ? "bg-orange-500 text-white" : ""
                                        }`}
                                >
                                    {cat}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
