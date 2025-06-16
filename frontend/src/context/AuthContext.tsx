// src/auth/AuthContext.tsx
import { createContext, useEffect, useState } from "react";
import { redirect } from "react-router-dom";
import type { ReactNode } from "react";
import type { AuthContextType, User } from "../types/authType";
import authService from "@/api/authService";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = async (email: string, password: string, remember: boolean) => {
    const { accessToken, user } = await authService.login(email, password, remember);
    setAccessToken(accessToken);
    setUser(user);
    if (remember) {
      localStorage.setItem("accessToken", accessToken);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    authService.logout(accessToken!);
    redirect("/login");
  };

  // On mount, restore session
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      authService
        .getMe(token)
        .then(user => {
          setUser(user);
          setAccessToken(token);
        })
        .catch(() => logout());
    }
    setLoading(false);
  }, []);

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
