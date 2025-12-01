import { TecnologiasPage } from "@/features/landing/presentation/sections/tecnologias-page";
import { Navbar } from "@/shared/layout/web/navbar";
import { Footer } from "@/shared/layout/web/footer";

export default function TecnologiasPageRoute() {
  return (
    <>
      <Navbar />
      <TecnologiasPage />
      <Footer />
    </>
  );
}
