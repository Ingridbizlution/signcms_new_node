import { readStoredAuth } from "./authStorage";

const API_BASE = "/api/v1";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const auth = readStoredAuth();
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (auth?.token) {
    headers.set("Authorization", `Bearer ${auth.token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }
  return data;
}
