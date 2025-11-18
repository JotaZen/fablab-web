"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/auth/useAuth";

export default function AdminLoginPage() {
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
    <div className="mt-16 rounded bg-white p-8 shadow">
      <h1 className="mb-4 text-2xl font-semibold">Admin — Login</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Email o usuario</label>
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
            required
          />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div>
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </div>
      </form>
    </div>
  );
}
