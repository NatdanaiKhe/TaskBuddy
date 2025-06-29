// src/auth/AuthContext.tsx
import { createContext, useEffect, useState } from "react";
import { redirect } from "react-router-dom";
import type { ReactNode } from "react";
import type { AuthContextType, User } from "../types/authType";
import authService from "@/api/authService";
import { setAccessToken as setGlobalAccessToken } from "@/api/axios";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = async (email: string, password: string, remember: boolean) => {
    const { accessToken, user } = await authService.login(
      email,
      password,
      remember
    );
    setAccessTokenState(accessToken);
    setGlobalAccessToken(accessToken);
    setUser(user);

    localStorage.setItem("hasLoggedInBefore", "true");
    localStorage.setItem("accessToken", accessToken);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("hasLoggedInBefore");
    setAccessTokenState(null);
    setUser(null);
    authService.logout();
    redirect("/login");
  };

  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem("accessToken");
      const hasLoggedInBefore =
        localStorage.getItem("hasLoggedInBefore") === "true";

      try {
        //find accesstoken
        if (token) {
          setGlobalAccessToken(token);
          const user = await authService.getMe();
          console.log("get me:" ,user);
          
          setUser(user);
          setAccessTokenState(token);
        }
        //if no accesstoken find refresh token
        else if (hasLoggedInBefore) {
          const { accessToken: newAccessToken, user } =
            await authService.refreshToken();
          localStorage.setItem("accessToken", newAccessToken);
          setAccessTokenState(newAccessToken);
          setGlobalAccessToken(newAccessToken);
          setUser(user);
        }
      } catch (err) {
        console.warn("Session not restored:", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("hasLoggedInBefore");
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const value: AuthContextType = {
    user,
    accessToken,
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
