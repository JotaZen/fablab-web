"use client";

import { useState } from "react";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!strapiUrl) {
      setMessage("NEXT_PUBLIC_STRAPI_URL no está configurada");
      return;
    }
    setLoading(true);

    try {
      // send to our server-side proxy to avoid CORS / client blockers
      const url = `/api/strapi/posts`;
      const payload = { data: { title: title.trim(), content: content.trim() } };
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // try to read json error body, fallback to text
        const text = await res.text().catch(() => "");
        let errMsg = text;
        try {
          const parsed = JSON.parse(text || "{}");
          errMsg = parsed?.error?.message || parsed?.message || JSON.stringify(parsed);
        } catch {
          // ignore JSON parse errors
        }
        setMessage(`Error: ${res.status} ${res.statusText} - ${errMsg}`);
      } else {
        const data = await res.json().catch(() => null);
        setMessage("Post creado correctamente. ID: " + (data?.data?.id ?? "?"));
        setTitle("");
        setContent("");
      }
    } catch (err: unknown) {
      // Network error or blocked by client (adblock/CORS issues)
      let msg = "Error de red: " + String(err);
      // Common browser client-side blocking message
      if (String(err).includes("ERR_BLOCKED_BY_CLIENT")) {
        msg += " — parece que una extensión (adblock) está bloqueando la petición. Desactívala para probar.";
      }
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1>Crear Post</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Contenido</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={8}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div>
          <button type="submit" disabled={loading} style={{ padding: "8px 16px" }}>
            {loading ? "Enviando..." : "Crear"}
          </button>
        </div>
      </form>

      {message && (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd" }}>{message}</div>
      )}

      <section style={{ marginTop: 24 }}>
        <h2>Notas</h2>
        <ul>
          <li>La página usa las variables de entorno <code>NEXT_PUBLIC_STRAPI_URL</code> y <code>NEXT_PUBLIC_STRAPI_API_TOKEN</code> si está disponible.</li>
          <li>Asegúrate de que el Content Type &quot;post&quot; exista en Strapi y tenga campos <code>title</code> y <code>content</code>.</li>
        </ul>
      </section>
    </main>
  );
}
