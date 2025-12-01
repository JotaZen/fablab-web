"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./providers/auth.provider";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { Label } from "@/shared/ui/labels/label";

interface LoginPageProps {
  /** Si es inline, no hace redirect automático (el padre controla la navegación) */
  inline?: boolean;
  /** Ruta a la que redirigir después del login (default: /admin/dashboard) */
  redirectTo?: string;
}

/**
 * LoginPage - Página/Componente de inicio de sesión
 * 
 * Después de login exitoso redirige a /admin/dashboard (o redirectTo)
 * Si inline=true, no hace redirect (útil cuando se usa dentro de un layout protegido)
 */
export function LoginPage({ inline = false, redirectTo = "/admin/dashboard" }: LoginPageProps) {
  const { login, error, clearError, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Limpiar errores al montar
  useEffect(() => {
    clearError?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Si ya está autenticado y NO es inline, redirigir
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
      // Solo redirigir si NO es inline y login fue exitoso
      if (success && !inline) {
        // Si ya estamos en una ruta /admin/*, no redirigir
        if (!pathname?.startsWith("/admin")) {
          router.push(redirectTo);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Iniciar sesión</h1>
          <p className="text-sm text-gray-500 mt-1">
            Accede al panel de administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
              {error.message}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email o usuario</Label>
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
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
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Entrando..." : "Entrar"}
            </Button>
            <a href="/register" className="text-sm text-blue-600 hover:underline">
              Crear cuenta
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
