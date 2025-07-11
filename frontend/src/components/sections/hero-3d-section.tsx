import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroTitle } from "@/components/common/titles";
import { LeadText } from "@/components/common/text";
import { Scene3D } from "@/components/graphics/scene-3d-simple";
import { ArrowRight, Users, Lightbulb } from "lucide-react";

export function Hero3DSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div
                        className="space-y-8 text-center lg:text-left"
                    >
                        <div className="space-y-4">


                            <div>
                                <HeroTitle>
                                    <span className="text-3xl md:text-4xl lg:text-5xl text-muted-foreground">
                                        Laboratorio de
                                    </span>
                                    <br />
                                    Fabricación Digital
                                </HeroTitle>
                            </div>
                        </div>

                        <div>
                            <LeadText className="max-w-2xl">
                                Explora el futuro de la manufactura digital con tecnologías de
                                <span className="text-blue-600 font-semibold"> impresión 3D</span>,
                                diseño paramétrico y prototipado rápido en nuestro laboratorio de vanguardia.
                            </LeadText>
                        </div>

                        <div
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
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
                        <div
                            className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50"
                        >
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

                    {/* 3D Model */}
                    <div
                        className="relative"
                    >
                        <div className="relative z-10">
                            <Scene3D
                                model="printer"
                                className="h-[500px]"
                                enableControls={true}
                                autoRotate={true}
                            />
                        </div>

                        {/* Floating badges */}
                        <div
                            className="absolute -top-4 -left-4 z-20"
                        >
                            <Badge className="bg-green-500 text-white">
                                <Lightbulb className="w-3 h-3 mr-1" />
                                Innovación
                            </Badge>
                        </div>
                        <div
                            className="absolute -bottom-4 -right-4 z-20"
                        >
                            <Badge className="bg-purple-500 text-white">
                                3D Printing
                            </Badge>
                        </div>

                        {/* Background effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-3xl -z-10" />
                    </div>
                </div>
            </div>

            {/* Background pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent)] " />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(139,92,246,0.1),transparent)]" />
            </div>
        </section>
    );
}
