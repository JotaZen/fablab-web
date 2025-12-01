import { PrivacidadPage } from "@/features/landing/presentation/sections/privacidad-page";
import { Navbar } from "@/shared/layout/web/navbar";
import { Footer } from "@/shared/layout/web/footer";

export const metadata = {
  title: "Política de Privacidad | FabLab INACAP Los Ángeles",
  description: "Conoce cómo recopilamos, usamos y protegemos tu información personal en FabLab INACAP Los Ángeles.",
};

export default function PrivacidadPageRoute() {
  return (
    <>
      <Navbar />
      <PrivacidadPage />
      <Footer />
    </>
  );
}
