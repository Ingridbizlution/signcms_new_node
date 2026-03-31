export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  // [變更開始] role 改為 union type
  role: "admin" | "user";
  // [變更結束]
}

export interface AuthPayload {
  token: string;
  user: AuthUser;
}
