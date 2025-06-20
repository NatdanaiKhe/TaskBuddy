// src/components/routes/PublicRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import type { JSX } from "react";

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; 

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};
