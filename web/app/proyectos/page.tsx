import { ProyectosPage } from "@/features/projecs/presentation";
import { Navbar } from "@/shared/layout/web/navbar";
import { Footer } from "@/shared/layout/web/footer";

export default function ProyectosPageRoute() {
  return (
    <>
      <Navbar />
      <ProyectosPage />
      <Footer />
    </>
  );
}
