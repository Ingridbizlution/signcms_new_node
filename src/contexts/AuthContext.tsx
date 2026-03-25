import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, logout } from "@/lib/authClient";
import { logActivity } from "@/lib/activityLogger";
import type { AuthUser } from "@/types/auth";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  const signOut = async () => {
    if (user) {
      await logActivity({ action: "登出", category: "auth", detail: user.email });
    }
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
