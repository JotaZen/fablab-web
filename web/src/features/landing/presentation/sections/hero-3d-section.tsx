import { Button } from "@/shared/ui/buttons/button";
import { HeroTitle } from "@/shared/ui/texts/titles";
import { LeadText } from "@/shared/ui/texts/text";
import { Scene3D } from "@/features/landing/presentation/graphics/scene-3d-simple";
import { FuturisticBackground } from "@/features/landing/presentation/effects/futuristic-background";
import { DonutBackground } from "@/features/landing/presentation/effects/donut-background";
import { ArrowRight, Users, Lightbulb } from "lucide-react";

export function Hero3DSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
            {/* Fondo futurista */}
            <FuturisticBackground 
                className="z-0" 
                showDots={true} 
                showCables={true} 
                intensity="medium"
            />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div
                        className="space-y-8 text-center lg:text-left"
                    >
                        <div className="space-y-4">


                            <div>
                                <HeroTitle>
                                    <span className="text-xl md:text-2xl lg:text-2xl text-muted-foreground font-thin">
                                        Laboratorio de
                                    </span>
                                    <br />
                                    Fabricación Digital
                                </HeroTitle>
                            </div>
                        </div>

                        <div>
                            <LeadText className="max-w-2xl leading-relaxed">
                                Explora el futuro de la manufactura digital con tecnologías de
                                <span className="text-blue-600"> impresión 3D</span>,
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
                        {/* Fondo específico para la dona */}
                        <div className="absolute inset-0 z-0">
                            <DonutBackground />
                        </div>
                        
                        <div className="relative z-10">
                            <Scene3D
                                model="torus"
                                className="h-[650px]"
                                enableControls={true}
                                autoRotate={true}
                            />
                        </div>

                        {/* Floating badges - más cerca y centradas */}
                        <div
                            className="absolute top-20 -left-2 z-20"
                        >
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg border border-green-400/20 backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5" />
                                    <span className="font-medium text-sm">Innovación</span>
                                </div>
                                <div className="text-xs opacity-90 mt-1">Tecnología de vanguardia</div>
                            </div>
                        </div>
                        <div
                            className="absolute bottom-32 -right-2 z-20"
                        >
                            <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-3 rounded-xl shadow-lg border border-purple-400/20 backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                    <span className="font-medium text-sm">3D Printing</span>
                                </div>
                                <div className="text-xs opacity-90 mt-1">Fabricación digital</div>
                            </div>
                        </div>
                        <div
                            className="absolute top-1/2 -left-4 -translate-y-1/2 z-20"
                        >
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-3 rounded-xl shadow-lg border border-blue-400/20 backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    <span className="font-medium text-sm">Colaborativo</span>
                                </div>
                                <div className="text-xs opacity-90 mt-1">Trabajo en equipo</div>
                            </div>
                        </div>
                        <div
                            className="absolute top-1/3 -right-4 z-20"
                        >
                            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-3 rounded-xl shadow-lg border border-orange-400/20 backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                    <ArrowRight className="w-5 h-5" />
                                    <span className="font-medium text-sm">Prototipado</span>
                                </div>
                                <div className="text-xs opacity-90 mt-1">Rápido y eficaz</div>
                            </div>
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
