"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/auth/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const success = await login({ email, password });
      if (success) {
        router.replace("/admin");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err ?? "Error al iniciar sesión");
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  // Si ya estamos autenticados, redirigimos automáticamente
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/admin");
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-semibold mb-2 text-gray-800">Iniciar sesión</h1>
        <p className="text-sm text-gray-500 mb-6">Accede al panel de administración</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email o usuario
            </label>
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <a href="/auth/register" className="text-sm text-blue-600 hover:underline">
              Crear cuenta
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}