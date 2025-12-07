"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "./providers/auth.provider";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { Label } from "@/shared/ui/labels/label";
import { Logo } from "@/shared/ui/branding/logo";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface LoginPageProps {
  inline?: boolean;
  redirectTo?: string;
}

export function LoginPage({ inline = false, redirectTo = "/admin/dashboard" }: LoginPageProps) {
  const { login, error, clearError, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    clearError?.();
  }, []);

  useEffect(() => {
    if (isAuthenticated && !inline) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, inline, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    try {
      const success = await login({ email, password });
      if (success && !inline) {
        if (!pathname?.startsWith("/admin")) {
          router.push(redirectTo);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gray-900 via-gray-800 to-black items-center justify-center">
        {/* Decorative blurs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-12"
        >
          <Link href="/" className="inline-block mb-8">
            <Logo size={80} className="hover:scale-105 transition-transform" />
          </Link>
          <h1
            className="text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-family-exo2)" }}
          >
            FabLab
          </h1>
          <p className="text-xl text-gray-300 max-w-md">
            Laboratorio de Fabricación Digital
          </p>
          <p className="text-gray-500 mt-2">
            INACAP Los Ángeles
          </p>
        </motion.div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-block">
              <Logo size={64} />
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-gray-600">
              Accede al panel de administración
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-700 bg-red-100 p-4 rounded-lg border border-red-200"
              >
                {error.message}
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email o usuario
              </Label>
              <Input
                id="email"
                name="email"
                type="text"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@ejemplo.com"
                disabled={submitting}
                className="h-12 text-base border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={submitting}
                className="h-12 text-base border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link
                href="/register"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Crear cuenta
              </Link>
            </p>
          </div>

          {/* Back to home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Volver al inicio
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
