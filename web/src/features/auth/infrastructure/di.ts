import { StrapiClient } from "./strapiClient";

let _strapiClient: StrapiClient | null = null;

export function getStrapiClient() {
  if (_strapiClient) return _strapiClient;
  const url = process.env.STRAPI_URL || "http://localhost:1337";
  _strapiClient = new StrapiClient(url);
  return _strapiClient;
}

// Helper para tests o para reemplazar la implementación en runtime
export function setStrapiClientForTest(client: StrapiClient | null) {
  _strapiClient = client;
}
