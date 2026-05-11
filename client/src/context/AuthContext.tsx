import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "@/lib/api";
import type { User } from "@/lib/mock-data";

interface AuthContextValue {
  currentUser: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateCurrentUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getStoredToken = () => localStorage.getItem("token");

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(() => Boolean(getStoredToken()));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setCurrentUser(null);
    setLoading(false);
  };

  const refreshUser = async () => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      logout();
      return;
    }

    setLoading(true);

    try {
      const user = await getCurrentUser();
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
      setToken(storedToken);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      logout();
      return;
    }

    void refreshUser();
  }, [token]);

  const login = (newToken: string, user: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(newToken);
    setCurrentUser(user);
    setLoading(false);
  };

  const updateCurrentUser = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    setCurrentUser(user);
  };

  const value = useMemo(
    () => ({
      currentUser,
      token,
      loading,
      isAuthenticated: Boolean(currentUser && token),
      login,
      logout,
      refreshUser,
      updateCurrentUser,
    }),
    [currentUser, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
