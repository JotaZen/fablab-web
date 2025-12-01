import { ContactoPage } from "@/features/landing/presentation/sections/contacto-page";
import { Navbar } from "@/shared/layout/web/navbar";
import { Footer } from "@/shared/layout/web/footer";

export default function ContactoPageRoute() {
  return (
    <>
      <Navbar />
      <ContactoPage />
      <Footer />
    </>
  );
}
