import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/shared/theme/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FabLab INACAP Los Ángeles',
  description: 'Laboratorio de Fabricación Digital - Innovación, Tecnología y Creatividad',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
