import { BlogPagePayload } from "@/features/blog/presentation/pages/blog-page-payload";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | FabLab INACAP Los Ángeles",
  description:
    "Descubre tutoriales, proyectos destacados, noticias y todo lo relacionado con la fabricación digital en el FabLab INACAP Los Ángeles.",
  keywords: [
    "blog FabLab",
    "tutoriales impresión 3D",
    "proyectos electrónica",
    "corte láser tutorial",
    "arduino proyectos",
    "fabricación digital",
    "INACAP Los Ángeles",
  ],
  openGraph: {
    title: "Blog | FabLab INACAP Los Ángeles",
    description:
      "Tutoriales, proyectos destacados y noticias del FabLab INACAP Los Ángeles.",
    type: "website",
    locale: "es_CL",
  },
};

export default function BlogRoute() {
  return <BlogPagePayload />;
}
