
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function useUserRole() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  //const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [role, setRole] = useState<"admin" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setRole(null);
      setLoading(false);
      return;
    }

    // 開發階段：先用登入帳號判斷
    // const admin = user.email === "admin@signcms.local";
    const admin = user.email === "admin@signcms.com";

    setIsAdmin(admin);
    // setRole(admin ? "admin" : "user");
    setRole(admin ? "admin" : "admin"); // 開發階段先統一當 admin，之後再改回根據資料庫判斷
    setLoading(false);
  }, [user]);

  return { isAdmin, role, loading };
}