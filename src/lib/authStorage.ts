export const AUTH_STORAGE_KEY = "signcms_auth";

export function readStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeStoredAuth(data: unknown) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
