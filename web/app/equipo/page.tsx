import { EquipoPage } from "@/features/landing/presentation/sections/equipo-page";
import { Navbar } from "@/shared/layout/web/navbar";
import { Footer } from "@/shared/layout/web/footer";

export default function EquipoPageRoute() {
  return (
    <>
      <Navbar />
      <EquipoPage />
      <Footer />
    </>
  );
}
