"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({} as any))) as any;
        throw new Error(body?.error ?? "Registro falló");
      }
      router.push("/admin/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-16 rounded bg-white p-8 shadow max-w-md mx-auto">
      <h1 className="mb-4 text-2xl font-semibold">Registro</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Nombre de usuario</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" type="email" required />
        </div>
        <div>
          <label className="block text-sm">Contraseña</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1 w-full rounded border px-3 py-2" required />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div>
          <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60" disabled={loading}>
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>
        </div>
      </form>
    </div>
  );
}
