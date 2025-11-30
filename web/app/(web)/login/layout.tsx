import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión - FabLab",
  description: "Accede a tu cuenta de FabLab",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {children}
    </div>
  );
}
