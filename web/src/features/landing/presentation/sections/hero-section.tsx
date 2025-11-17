import { Button } from "@/shared/ui/buttons/button";
import { Badge } from "@/shared/ui/badges/badge";
import { HeroTitle } from "@/shared/ui/texts/titles";
import { LeadText } from "@/shared/ui/texts/text";
import { PlaceholderImage } from "@/shared/ui/media/images";
import { GridPattern, GlowEffect } from "@/features/landing/presentation/graphics/patterns";
import { ArrowRight, Zap, Users, Lightbulb } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <GridPattern className="opacity-30" />
      <GlowEffect color="blue" className="top-20 left-20 w-96 h-96" />
      <GlowEffect color="purple" className="bottom-20 right-20 w-80 h-80" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <Zap className="w-3 h-3 mr-2" />
                Innovación Tecnológica INACAP
              </Badge>

              <HeroTitle>
                FabLab
                <br />
                <span className="text-3xl md:text-4xl lg:text-5xl text-muted-foreground">
                  Laboratorio de
                </span>
                <br />
                Fabricación Digital
              </HeroTitle>
            </div>

            <LeadText className="max-w-2xl">
              Explora el futuro de la manufactura digital con tecnologías de
              <span className="text-blue-600 font-semibold"> impresión 3D</span>,
              diseño paramétrico y prototipado rápido en nuestro laboratorio de vanguardia.
            </LeadText>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white group"
              >
                Explorar Proyectos
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                <Users className="w-4 h-4 mr-2" />
                Conocer el Equipo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50">
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-muted-foreground">Proyectos</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-purple-600">15+</div>
                <div className="text-sm text-muted-foreground">Tecnologías</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-green-600">200+</div>
                <div className="text-sm text-muted-foreground">Estudiantes</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative z-10">
              <PlaceholderImage
                width={600}
                height={400}
                text="Laboratorio FabLab"
                className="w-full h-auto shadow-2xl"
                rounded="xl"
              />
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -left-4 z-20">
              <Badge className="bg-green-500 text-white">
                <Lightbulb className="w-3 h-3 mr-1" />
                Innovación
              </Badge>
            </div>
            <div className="absolute -bottom-4 -right-4 z-20">
              <Badge className="bg-purple-500 text-white">
                3D Printing
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
