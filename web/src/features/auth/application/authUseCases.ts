import type { LoginCreds } from "@/features/auth/domain/authAdapter";
import type { AuthAdapter } from "@/features/auth/domain/authAdapter";

// Client-side login: uses the public API route so cookies are set by server
export async function clientLogin(creds: LoginCreds) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(creds),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || body?.message || "Login failed");
  }

  const payload = await res.json();
  return payload; // { user }
}

export async function clientLogout() {
  await fetch("/api/auth/logout", { method: "POST" });
}

// Client-side get session (uses API route so browser cookies are sent)
export async function clientGetSession() {
  const res = await fetch("/api/auth/session");
  if (!res.ok) return { user: null };
  return await res.json();
}

// Note: server-side verification moved to infrastructure controller
