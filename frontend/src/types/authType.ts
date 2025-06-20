
// src/auth/authTypes.ts\
export type UserRole = "customer" | "provider" ;
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role:  UserRole;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}
