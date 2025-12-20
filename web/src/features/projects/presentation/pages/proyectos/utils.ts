/**
 * Utility functions - Proyectos Feature
 */

export function getCategoryStyles(categoria: string): string {
    const styles: Record<string, string> = {
        Hardware: "bg-blue-500 text-white",
        Software: "bg-purple-500 text-white",
        Diseño: "bg-pink-500 text-white",
        IoT: "bg-green-500 text-white",
    };
    return styles[categoria] || "bg-gray-500 text-white";
}

export function generateSlug(titulo: string): string {
    return titulo
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-");
}
