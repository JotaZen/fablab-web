import { Navbar } from "@/shared/layout/web/navbar";
import { Footer } from "@/shared/layout/web/footer";
import { CookiesPage } from "@/features/landing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies | FabLab INACAP Los Ángeles",
  description:
    "Información sobre cómo utilizamos cookies y tecnologías similares en el sitio web de FabLab INACAP Los Ángeles. Tipos de cookies, gestión y sus derechos.",
  keywords: [
    "política de cookies",
    "cookies",
    "privacidad",
    "FabLab INACAP",
    "Los Ángeles",
    "preferencias",
    "navegación",
  ],
  openGraph: {
    title: "Política de Cookies | FabLab INACAP Los Ángeles",
    description:
      "Información sobre el uso de cookies en el sitio web de FabLab INACAP Los Ángeles.",
    type: "website",
    locale: "es_CL",
  },
};

export default function CookiesRoute() {
  return (
    <>
      <Navbar />
      <CookiesPage />
      <Footer />
    </>
  );
}
