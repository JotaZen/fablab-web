/**
 * Types - Proyectos Feature
 */

export interface Creador {
    nombre: string;
    rol: string;
    avatar?: string;
}

export interface Proyecto {
    id: string;
    titulo: string;
    categoria: string;
    imagenes: string[];
    descripcion: string;
    tecnologias: string[];
    fecha: string;
    creadores: Creador[];
    objetivo: string;
    problemaResuelto: string;
    procesoFabricacion: string[];
    videoUrl?: string;
    githubUrl?: string;
    thingiverseUrl?: string;
    archivosDiseno?: string;
}

export type CategoriaFiltro = "Todos" | "Hardware" | "Software" | "Diseño" | "IoT";

export const CATEGORIAS: CategoriaFiltro[] = ["Todos", "Hardware", "Software", "Diseño", "IoT"];
