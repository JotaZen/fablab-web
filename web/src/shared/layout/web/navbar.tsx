"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/shared/ui/buttons/button";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/misc/sheet";
import { Badge } from "@/shared/ui/badges/badge";
import { Menu, Zap, Cpu, Printer, Wifi } from "lucide-react";
import { useAuth } from "@/shared/auth/useAuth";

interface NavigationItem {
    href: string;
    label: string;
    badge?: string;
}

const navigationItems: NavigationItem[] = [
    { href: "/", label: "Inicio" },
    { href: "/proyectos", label: "Proyectos" },
    { href: "/tecnologias", label: "Tecnologías" },
    // { href: "/control-iot", label: "Control IoT", badge: "Nuevo" },
    { href: "/equipo", label: "Equipo" },
    { href: "/contacto", label: "Contacto" },
    { href: "/admin", label: "Ingresar" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showBrand, setShowBrand] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
            // Mostrar FabLab cuando llegue a la sección "¿Quiénes somos?" (aproximadamente 60% del viewport)
            setShowBrand(window.scrollY > window.innerHeight * 0.5);
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

                {/* Desktop Navigation Left */}
                <div className="hidden lg:flex absolute left-0 top-1/2 transform -translate-y-1/2 w-1/3 justify-center items-center space-x-8 z-10 px-4">
                    {navigationItems.slice(0, 3).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative text-sm font-medium text-muted-foreground hover:text-orange-500 transition-colors duration-200 group flex items-center gap-2"
                        >
                            {item.label}
                            {item.badge && (
                                <Badge variant="secondary" className="text-xs bg-orange-500 text-white flex items-center gap-1">
                                    {item.href === "/control-iot" && <Wifi className="w-3 h-3" />}
                                    {item.badge}
                                </Badge>
                            )}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 group-hover:w-full transition-all duration-300" />
                        </Link>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <Sheet>
                    <SheetTrigger asChild className="lg:hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                        <Button variant="ghost" size="sm">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                        <div className="flex flex-col space-y-6 mt-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
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
                                        className="flex items-center justify-between text-base font-medium hover:text-orange-500 transition-colors duration-200 p-2 rounded-lg hover:bg-orange-50"
                                    >
                                        <span>{item.label}</span>
                                        {item.badge && (
                                            <Badge variant="secondary" className="text-xs bg-orange-500 text-white flex items-center gap-1">
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
                <div className="absolute inset-x-0 top-0 h-[2rem] bg-white pointer-events-none z-10" />
                
                {/* Brand - aparece en el centro al hacer scroll */}
                <div 
                    className={`absolute top-[15%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-center transition-all duration-300 ${
                        showBrand 
                            ? "opacity-100 translate-y-0" 
                            : "opacity-0 -translate-y-4 pointer-events-none"
                    }`}
                >
                    <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="inline-block group cursor-pointer"
                    >
                        <h2 className="text-5xl md:text-6xl font-bold tracking-wider text-gray-800 hover:text-orange-500 transition-colors">
                            FabLab
                        </h2>
                    </button>
                </div>




                {/* Right Navigation (centered inside right container) */}
                <div className="hidden lg:flex absolute right-0 top-1/2 transform -translate-y-1/2 w-1/3 justify-center items-center space-x-4 z-10 px-4">
                    {navigationItems.slice(3).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative text-sm font-medium text-muted-foreground hover:text-orange-500 transition-colors duration-200 group flex items-center gap-2"
                        >
                            {item.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 group-hover:w-full transition-all duration-300" />
                        </Link>
                    ))}
                    {user ? (
                        <div className="flex items-center space-x-2">
                            <Link href="/admin">
                                <Button variant="ghost" size="sm" className="text-foreground hover:text-orange-500 hover:bg-orange-50">
                                    Admin
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-foreground hover:text-orange-500 hover:bg-orange-50"
                                onClick={() => logout()}
                            >
                                Salir
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="text-foreground hover:text-orange-500 hover:bg-orange-50">
                                Ingresar
                            </Button>
                        </Link>
                    )}
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
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
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
                                        className="flex items-center justify-between text-base font-medium hover:text-orange-500 transition-colors duration-200 p-2 rounded-lg hover:bg-orange-50"
                                    >
                                        <span>{item.label}</span>
                                        {item.badge && (
                                            <Badge variant="secondary" className="text-xs bg-orange-500 text-white flex items-center gap-1">
                                                {item.href === "/control-iot" && <Wifi className="w-3 h-3" />}
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </Link>
                                ))}
                                {user && (
                                    <Button
                                        variant="ghost"
                                        className="justify-start text-base font-medium hover:text-orange-500 transition-colors duration-200 p-2 rounded-lg hover:bg-orange-50"
                                        onClick={() => {
                                            logout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        Logout
                                    </Button>
                                )}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}
