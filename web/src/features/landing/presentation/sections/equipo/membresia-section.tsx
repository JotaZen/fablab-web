"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/buttons/button";
import { beneficiosMembresia } from "./data";

export function MembresiaSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-orange-100/50">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-2 bg-orange-500/20 text-orange-600 rounded-full text-sm font-semibold mb-4">
              Únete a Nosotros
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sé parte de la{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                comunidad maker
              </span>
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              La membresía de FabLab te da acceso a equipos de última generación,
              capacitaciones, mentoría de expertos y una comunidad vibrante de innovadores.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {beneficiosMembresia.map((beneficio) => (
                <div
                  key={beneficio.titulo}
                  className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm"
                >
                  <span className="text-2xl">{beneficio.icono}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{beneficio.titulo}</h4>
                    <p className="text-sm text-gray-500">{beneficio.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/contacto">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 text-lg rounded-full">
                  Solicitar Membresía
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/tecnologias">
                <Button variant="outline" className="px-8 py-6 text-lg rounded-full border-2">
                  Ver Equipamiento
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop"
                    alt="FabLab workspace"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop"
                    alt="3D printing"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-64 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop"
                    alt="Electronics lab"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=400&fit=crop"
                    alt="Laser cutting"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl p-6 flex gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">500+</p>
                <p className="text-sm text-gray-500">Miembros</p>
              </div>
              <div className="text-center border-l border-gray-200 pl-8">
                <p className="text-3xl font-bold text-orange-600">50+</p>
                <p className="text-sm text-gray-500">Cursos</p>
              </div>
              <div className="text-center border-l border-gray-200 pl-8">
                <p className="text-3xl font-bold text-orange-600">24/7</p>
                <p className="text-sm text-gray-500">Acceso</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
