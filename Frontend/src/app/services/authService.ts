const API_BASE_URL = "http://localhost:8081/api";

interface AuthResponse {
  token: string;
  login: string;
  userId: number;
  message: string;
}

interface AuthRequest {
  login: string;
  motDePasse: string;
}

class AuthService {
  async register(login: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, motDePasse: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error during registration");
    }
  }

  async login(login: string, password: string): Promise<AuthResponse> {
    try {
      console.log("Attempting to login with URL:", `${API_BASE_URL}/auth/login`);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, motDePasse: password }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error during login");
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  setToken(token: string): void {
    localStorage.setItem("authToken", token);
  }

  setUser(userId: number, login: string): void {
    localStorage.setItem("userId", userId.toString());
    localStorage.setItem("userLogin", login);
  }

  getUser() {
    return {
      userId: localStorage.getItem("userId"),
      login: localStorage.getItem("userLogin"),
    };
  }

  logout(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userLogin");
  }
}

export default new AuthService();
