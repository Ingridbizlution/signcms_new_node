export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
}

export interface AuthPayload {
  token: string;
  user: AuthUser;
}
