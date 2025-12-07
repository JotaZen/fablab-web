import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ConditionalNavbar } from "@/shared/layout/web/conditional-navbar";
import { ConditionalFooter } from "@/shared/layout/conditional-footer";
import "@/shared/theme/globals.css";
import WebLayout from "@/shared/layout/web/web-layout";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WebLayout>
      {children}
    </WebLayout>
  );
}
