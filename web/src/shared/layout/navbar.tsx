"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/shared/ui/buttons/button";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/misc/sheet";
import { Badge } from "@/shared/ui/badges/badge";
import { Menu, Zap, Cpu, Printer, Wifi } from "lucide-react";

interface NavigationItem {
    href: string;
    label: string;
    badge?: string;
}

const navigationItems: NavigationItem[] = [
    { href: "/", label: "Inicio" },
    { href: "/create-post", label: "Crear Post" },
    { href: "/proyectos", label: "Proyectos" },
    { href: "/tecnologias", label: "Tecnologías" },
    { href: "/control-iot", label: "Control IoT", badge: "Nuevo" },
    { href: "/equipo", label: "Equipo" },
    { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-background/80 backdrop-blur-lg border-border/50 h-20"
                : "bg-transparent h-22"
                }`}
        >
            <div className="relative h-28 lg:h-32 pt-12">
                {/* Full-width top rectangle */}
                <div className="absolute inset-x-0 top-0 h-[2rem] bg-white border-b border-border/60 shadow-[0_8px_24px_rgba(0,0,0,0.05)] pointer-events-none z-0" />

                {/* Inverted trapezoid exiting the rectangle */}
                <div className="absolute left-1/2 top-[2rem] -translate-x-1/2 w-[33vw] max-w-xl h-[4rem] pointer-events-none z-0">
                    <svg
                        className="w-full h-full drop-shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
                        viewBox="0 0 320 120"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M10 0 H310 L220 220 H100 Z"
                            fill="#ffffff"
                        />
                    </svg>
                </div>
                <div className="absolute inset-x-0 top-0 h-[2rem] bg-white pointer-events-none z-100" />
                {/* Brand inside inverted trapezoid */}
                <div className="absolute top-[1rem] left-1/2 transform -translate-x-1/2 z-10 px-8 py-4">
                    <Link href="/" className="inline-block group">
                        <h2 className="text-xl font-bold tracking-wide text-muted-foreground">
                            INACAP
                        </h2>
                    </Link>
                </div>

                {/* Left Navigation (centered inside left container) */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/1 hidden lg:flex w-1/3 justify-center space-x-8 z-10 px-4">
                    {navigationItems.slice(0, 3).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 group flex items-center gap-2"
                        >
                            {item.label}
                            {item.badge && (
                                <Badge variant="secondary" className="text-xs bg-blue-500 text-white flex items-center gap-1">
                                    {item.href === "/control-iot" && <Wifi className="w-3 h-3" />}
                                    {item.badge}
                                </Badge>
                            )}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300" />
                        </Link>
                    ))}
                </div>


                {/* Right Navigation (centered inside right container) */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/1 hidden lg:flex w-1/3 justify-center items-center space-x-8 z-10 px-4">
                    {navigationItems.slice(3).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 group flex items-center gap-2"
                        >
                            {item.label}
                            {item.badge && (
                                <Badge variant="secondary" className="text-xs bg-blue-500 text-white flex items-center gap-1">
                                    {item.href === "/control-iot" && <Wifi className="w-3 h-3" />}
                                    {item.badge}
                                </Badge>
                            )}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300" />
                        </Link>
                    ))}

                </div>

                {/* Mobile Menu Button */}
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild className="lg:hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                        <Button variant="ghost" size="sm">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                        <div className="flex flex-col space-y-6 mt-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Cpu className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg">FabLab INACAP</h2>
                                    <p className="text-xs text-muted-foreground">Laboratorio Tecnológico</p>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-4">
                                {navigationItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-between text-base font-medium hover:text-blue-600 transition-colors duration-200 p-2 rounded-lg hover:bg-accent"
                                    >
                                        <span>{item.label}</span>
                                        {item.badge && (
                                            <Badge variant="secondary" className="text-xs bg-blue-500 text-white flex items-center gap-1">
                                                {item.href === "/control-iot" && <Wifi className="w-3 h-3" />}
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}
