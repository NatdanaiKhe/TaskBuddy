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

  logout: async () => {
    await axios.post("/auth/logout", {}, { withCredentials: true });
  },
};

export default authService;
