import { Navbar } from "@/shared/layout/web/navbar";
import { Footer } from "@/shared/layout/web/footer";
import { TerminosPage } from "@/features/landing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | FabLab INACAP Los Ángeles",
  description:
    "Conoce los términos y condiciones de uso del FabLab INACAP Los Ángeles. Normas de acceso, uso de equipos, reservas, seguridad y código de conducta.",
  keywords: [
    "términos y condiciones",
    "normas FabLab",
    "reglas uso equipos",
    "FabLab INACAP",
    "Los Ángeles",
    "seguridad laboratorio",
    "reservas equipos",
  ],
  openGraph: {
    title: "Términos y Condiciones | FabLab INACAP Los Ángeles",
    description:
      "Términos y condiciones de uso del FabLab INACAP Los Ángeles. Normas de acceso, equipos y servicios.",
    type: "website",
    locale: "es_CL",
  },
};

export default function TerminosRoute() {
  return (
    <>
      <Navbar />
      <TerminosPage />
      <Footer />
    </>
  );
}
