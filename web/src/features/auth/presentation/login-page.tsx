"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/shared/auth/useAuth";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { Label } from "@/shared/ui/labels/label";

/**
 * LoginPage - Página de inicio de sesión
 *
 * Características:
 * - Manejo de errores amigables
 * - Redirección automática si ya está logueado
 * - Soporte para returnUrl (volver a la página original)
 */
export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Obtener la URL de retorno
  const returnUrl = searchParams.get("returnUrl") || "/admin";

  // Si ya está autenticado, redirigir
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace(decodeURIComponent(returnUrl));
    }
  }, [isAuthenticated, isLoading, router, returnUrl]);

  // Limpiar error cuando el usuario empieza a escribir
  useEffect(() => {
    if (error) clearError();
  }, [identifier, password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    
    const success = await login({ identifier, password });
    
    if (success) {
      router.push(decodeURIComponent(returnUrl));
    }
    
    setSubmitting(false);
  }

  // Mientras verifica sesión inicial, mostrar loading
  if (isLoading && !submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Verificando sesión...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gray-300 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-200 relative z-10 max-w-md bg-white/80">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-200">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            FabLab INACAP
          </h1>
          <p className="text-gray-600">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="identifier" className="text-gray-700 text-sm">
              Usuario o Email
            </Label>
            <Input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="tu@email.com"
              required
              autoComplete="username"
              disabled={submitting}
              className="w-full bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 text-sm">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              disabled={submitting}
              className="w-full bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 h-11"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting || !identifier || !password}
            className="w-full h-11"
          >
            {submitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-primary hover:underline">
            Regístrate
          </a>
        </div>
      </div>
    </div>
  );
}