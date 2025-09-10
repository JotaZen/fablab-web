"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
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
                    ? "bg-background/80 backdrop-blur-lg border-b border-border/50"
                    : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Cpu className="w-5 h-5 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                FabLab
                            </h1>
                            <p className="text-xs text-muted-foreground">INACAP Tech</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navigationItems.map((item) => (
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

                    {/* Right side - Desktop */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <Badge variant="secondary" className="text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            Innovación
                        </Badge>
                        <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                        >
                            <Printer className="w-4 h-4 mr-2" />
                            Explorar Lab
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild className="lg:hidden">
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

                                <div className="pt-6 border-t border-border">
                                    <Button
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Printer className="w-4 h-4 mr-2" />
                                        Explorar Laboratorio
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
