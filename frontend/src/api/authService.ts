const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const authService = {
  login: async (email: string, password: string, remember: boolean) => {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, remember }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    return data;
  },

  register: async (
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    password: string
  ) => {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, role, password }),
    });
    if (!response.ok) {
      throw new Error("Registration failed");
    }
  },

  getMe: async (token: string) => {
    const response = await fetch(`${baseUrl}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    return data;
  },

  logout: async (token: string) => {
    const response = await fetch(`${baseUrl}/api/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  },
  refreshToken: async (refreshToken: string) => {
    const response = await fetch(`${baseUrl}/api/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    return data;
  },
};

export default authService;
