"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/auth/useAuth";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { Label } from "@/shared/ui/labels/label";

/**
 * LoginPage - Página de inicio de sesión minimalista y transparente
 *
 * Características:
 * - Fondo transparente con partículas animadas en gris claro
 * - Formulario centrado con backdrop blur
 * - Manejo de errores y estado de carga
 * - Redirección automática tras login exitoso
 */
export function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ identifier, password });
      router.push("/admin/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error en login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
      {/* Subtle animated background particles - light gray transparent */}
      <div className="absolute inset-0">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gray-300 rounded-full opacity-40 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-200 relative z-10 max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-200">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            FabLab INACAP
          </h1>
          <p className="text-gray-600">Inicia sesión</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="identifier" className="text-gray-700 text-sm">Usuario o Email</Label>
            <Input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 text-sm">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 h-11"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white h-11 font-medium transition-colors"
            disabled={loading}
          >
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-gray-600 hover:text-gray-900 font-medium">
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}