import { apiFetch } from "./apiClient";
import { clearStoredAuth, readStoredAuth, writeStoredAuth } from "./authStorage";
import type { AuthPayload, AuthUser } from "@/types/auth";

export async function login(email: string, password: string) {
  const payload = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }) as AuthPayload;
  writeStoredAuth(payload);
  return payload;
}

export async function register(name: string, email: string, password: string) {
  const payload = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  }) as AuthPayload;
  writeStoredAuth(payload);
  return payload;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const auth = readStoredAuth();
  if (!auth?.token) return null;
  try {
    return await apiFetch("/auth/me");
  } catch {
    clearStoredAuth();
    return null;
  }
}

export function logout() {
  clearStoredAuth();
}

export async function requestPasswordReset(email: string) {
  return apiFetch("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, password: string) {
  return apiFetch("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}
