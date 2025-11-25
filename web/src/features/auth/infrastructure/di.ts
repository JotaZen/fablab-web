import { StrapiClient } from "./strapiClient";
import { StrapiAdapter } from "./strapiAdapter";
import type { AuthAdapter } from "@/features/auth/domain/authAdapter";

let _strapiClient: StrapiClient | null = null;
let _authAdapter: AuthAdapter | null = null;

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

export function getAuthAdapter() {
  if (_authAdapter) return _authAdapter;
  _authAdapter = new StrapiAdapter();
  return _authAdapter;
}

export function setAuthAdapterForTest(adapter: AuthAdapter | null) {
  _authAdapter = adapter;
}
