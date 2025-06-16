import { create } from "zustand";
import authService from '@/api/authService';

type Role = "admin" | "user";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
  setUser: (user: User, token: string) => void;
  checkStoredToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  token: null,
  loading: true,
  isAuthenticated: false,

  

  login: async (email, password, remember) => {
    const { accessToken, user } = await authService.login(email, password,remember);
    set({
      user,
      token: accessToken,
      isAuthenticated: true,
    });
    if (remember) {
      localStorage.setItem("accessToken", accessToken);
    }
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user, token) => {
    set({ user, token, isAuthenticated: true });
  },

  checkStoredToken: async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      set({ loading: false });
      return;
    }

    try {
      const user = await authService.getMe(token);
      set({ user, token, isAuthenticated: true });
    } catch {
      localStorage.removeItem("accessToken");
    } finally {
      set({ loading: false });
    }
  },
}));
