// [變更開始] 停用後端 API，改用前端 mock 資料登入
import { clearStoredAuth, readStoredAuth, writeStoredAuth } from "./authStorage";
import type { AuthPayload, AuthUser } from "@/types/auth";
import { mockAuthUsers } from "@/mock/mockAuthUsers";

export async function login(email: string, password: string): Promise<AuthPayload> {
  const found = mockAuthUsers.find(
    (u) => u.email === email && u.password === password
  );
  if (!found) {
    throw new Error("帳號或密碼錯誤");
  }
  const { password: _pw, ...user } = found;
  const payload: AuthPayload = {
    token: `mock-token-${Date.now()}`,
    user,
  };
  writeStoredAuth(payload);
  return payload;
}

export async function register(name: string, email: string, password: string): Promise<AuthPayload> {
  const exists = mockAuthUsers.find((u) => u.email === email);
  if (exists) {
    throw new Error("此 Email 已被使用");
  }
  const newUser: AuthUser = {
    id: `mock-user-${Date.now()}`,
    email,
    name,
    role: "user",
  };
  const payload: AuthPayload = {
    token: `mock-token-${Date.now()}`,
    user: newUser,
  };
  writeStoredAuth(payload);
  return payload;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const auth = readStoredAuth();
  if (!auth?.token || !auth?.user) return null;
  return auth.user as AuthUser;
}

export function logout() {
  clearStoredAuth();
}

export async function requestPasswordReset(email: string): Promise<void> {
  const found = mockAuthUsers.find((u) => u.email === email);
  if (!found) {
    throw new Error("找不到此 Email 帳號");
  }
  // mock：不實際發送信件，直接回應成功
}

export async function resetPassword(_token: string, _password: string): Promise<void> {
  // mock：不實際更新密碼，直接回應成功
}
// [變更結束]
