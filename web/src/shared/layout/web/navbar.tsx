"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/shared/ui/buttons/button";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/misc/sheet";
import { Badge } from "@/shared/ui/badges/badge";
import { Menu, Zap, Cpu, Printer, Wifi } from "lucide-react";
import { useAuth } from "@/shared/auth/useAuth";
import { Logo } from "@/shared/ui/branding/logo";

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
];

// Páginas con fondo claro (hero blanco)
const lightBackgroundPages = ["/", "/login", "/blog", "/privacidad", "/terminos", "/cookies"];

export function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showBrand, setShowBrand] = useState(false);
    const [showFabLab, setShowFabLab] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    // Determinar si la página actual tiene fondo claro
    const isLightBackground = lightBackgroundPages.includes(pathname);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
            // Mostrar barra al 30% del viewport
            setShowBrand(window.scrollY > window.innerHeight * 0.3);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // FabLab aparece con delay, pero se oculta inmediatamente
    useEffect(() => {
        if (showBrand) {
            const timer = setTimeout(() => {
                setShowFabLab(true);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            // Se oculta inmediatamente sin delay
            setShowFabLab(false);
        }
    }, [showBrand]);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-background/80 backdrop-blur-lg border-border/50"
                : "bg-transparent"
                }`}
        >
            <div className="relative">
                {/* Unified top bar with trapezoid - single piece */}
                <div
                    className={`absolute inset-x-0 top-0 h-[5rem] pointer-events-none z-0 transition-all duration-500 ${showBrand
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-full"
                        }`}
                >
                    <svg
                        className="w-full h-full drop-shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
                        viewBox="0 0 1920 80"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        {/* Full width bar (44px = 2.75rem) + centered trapezoid extending down */}
                        <path
                            d="M0 0 H1920 V44 H1120 L1080 80 H840 L800 44 H0 Z"
                            fill="#ffffff"
                        />
                    </svg>
                </div>

                {/* Desktop Navigation Left */}
                <div className="hidden lg:flex absolute left-0 top-0 h-11 w-1/3 justify-center items-center space-x-6 z-20 px-8">
                    {navigationItems.slice(0, 3).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative cursor-pointer text-sm font-medium transition-colors duration-200 group ${showBrand || isLightBackground
                                ? "text-gray-700 hover:text-gray-900"
                                : "text-white/90 hover:text-white"
                                }`}
                        >
                            {item.label}
                            {/* Animated underline */}
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-orange-500 transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                {/* Brand - siempre visible en el centro (solo desktop) */}
                <div
                    className="hidden lg:flex absolute top-5 left-1/2 transform -translate-x-1/2 z-50 items-center justify-center"
                >
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="inline-flex items-center group cursor-pointer"
                    >
                        <Logo size={36} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>




                {/* Right Navigation (centered inside right container) */}
                <div className="hidden lg:flex absolute right-0 top-0 h-11 w-1/3 justify-center items-center space-x-6 z-20 px-8">
                    {navigationItems.slice(3).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative cursor-pointer text-sm font-medium transition-colors duration-200 group ${showBrand || isLightBackground
                                ? "text-gray-700 hover:text-gray-900"
                                : "text-white/90 hover:text-white"
                                }`}
                        >
                            {item.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-orange-500 transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                    {user ? (
                        <div className="flex items-center space-x-2">
                            <Link href="/admin">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`transition-colors duration-300 ${showBrand || isLightBackground
                                        ? "text-gray-800 hover:text-orange-500 hover:bg-orange-50"
                                        : "text-white hover:text-orange-400 hover:bg-white/10"
                                        }`}
                                >
                                    Admin
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`transition-colors duration-300 ${showBrand || isLightBackground
                                    ? "text-gray-800 hover:text-orange-500 hover:bg-orange-50"
                                    : "text-white hover:text-orange-400 hover:bg-white/10"
                                    }`}
                                onClick={() => logout()}
                            >
                                Salir
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`transition-colors duration-300 ${showBrand || isLightBackground
                                    ? "text-gray-800 hover:text-orange-500 hover:bg-orange-50"
                                    : "text-white hover:text-orange-400 hover:bg-white/10"
                                    }`}
                            >
                                Ingresar
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild className="lg:hidden absolute left-1/2 top-2 transform -translate-x-1/2 z-20">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`transition-colors duration-300 ${showBrand || isLightBackground
                                ? "text-gray-800 hover:text-orange-500 hover:bg-orange-50"
                                : "text-white hover:text-orange-400 hover:bg-white/10"
                                }`}
                        >
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
