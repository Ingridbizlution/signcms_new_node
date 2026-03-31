// [變更開始] mock 帳號資料，用於前端假登入
import type { AuthUser } from "@/types/auth";

export interface MockAuthUser extends AuthUser {
  password: string;
}

export const mockAuthUsers: MockAuthUser[] = [
  {
    id: "mock-user-001",
    email: "admin@signcms.com",
    name: "管理者",
    role: "admin",
    password: "123456",
  },
  {
    id: "mock-user-002",
    email: "user@signcms.com",
    name: "一般使用者",
    role: "user",
    password: "123456",
  },
];
// [變更結束]
