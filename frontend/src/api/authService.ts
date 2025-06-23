// src/api/authService.ts
import axios from "./axios"; // will set up interceptors in the next step

const authService = {
  register: async (
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    password: string
  ) => {
    const res = await axios.post("/auth/register", {
      firstName,
      lastName,
      email,
      role,
      password,
    });
    return res.data;
  },

  verifyEmail: async (token: string) => {
    const res = await axios.post("/auth/verify-email/" + token);

    return res.data.success;
  },

  login: async (email: string, password: string, remember: boolean) => {
    const res = await axios.post(
      "/auth/login",
      { email, password, remember },
      { withCredentials: true }
    );
    return res.data;
  },

  getMe: async () => {
    const res = await axios.get("/auth/me", { withCredentials: true });
    return res.data.data;
  },

  refreshToken: async () => {
    const res = await axios.post(
      "/auth/refresh-token",
      {},
      { withCredentials: true }
    );
    return res.data;
  },
  forgotPassword: async (email: string) => {
    const res = await axios.post("/auth/forgot-password", { email });
    return res.data;
  },
  resetPassword: async (token: string, password: string) => {
    const res = await axios.post("/auth/reset-password", { token, password });
    return res.data;
  },

  logout: async () => {
    await axios.post("/auth/logout", {}, { withCredentials: true });
  },
};

export default authService;
