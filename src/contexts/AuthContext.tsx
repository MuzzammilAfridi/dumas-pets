import React, { createContext, useContext, useState, useCallback } from "react";
import {
  getLoggedUser,
  loginUser,
  logoutAPI,
  registerUserAPI,
} from "@/services/authService";

export type UserRole = "admin" | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => void;
  loginWithAPI: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const MOCK_CUSTOMERS: Array<User & { password: string }> = [
  {
    id: "c1",
    name: "Sarah Mitchell",
    email: "sarah@example.com",
    password: "password",
    role: "customer",
    phone: "555-0101",
  },
  {
    id: "c2",
    name: "John Davis",
    email: "john@example.com",
    password: "password",
    role: "customer",
    phone: "555-0102",
  },
  {
    id: "c3",
    name: "Emily Roberts",
    email: "emily@example.com",
    password: "password",
    role: "customer",
    phone: "555-0103",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("dumas_user");
    return stored ? JSON.parse(stored) : null;
  });

  const logout = useCallback(async () => {
    try {
      await logoutAPI(); // 🔥 destroy ERP session
    } catch (err) {
      console.error("Logout API failed", err);
    }

    // ✅ Clear frontend
    setUser(null);
    localStorage.removeItem("dumas_user");

    // ✅ OPTIONAL: clear cart id (important for your Option 2)
    localStorage.removeItem("quotation_id");
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem("dumas_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const loginWithAPI = useCallback(async () => {
    try {
      const res = await getLoggedUser();
      const email = res.data.message;

      const role = email === "Administrator" ? "admin" : "customer";

      const user = {
        id: email,
        name: email.includes("@") ? email.split("@")[0] : email,
        email,
        role,
      };

      setUser(user);
      localStorage.setItem("dumas_user", JSON.stringify(user));

      return user; // ✅ MUST return
    } catch (err) {
      console.error("Error fetching user:", err);
      throw err;
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        await loginUser({
          usr: email,
          pwd: password,
        });

        await loginWithAPI(); // fetch logged user

        return true;
      } catch (err) {
        console.error("Login failed", err);
        return false;
      }
    },
    [loginWithAPI],
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<boolean> => {
      try {
        //  1. Create user + customer
        await registerUserAPI({ name, email, password });

        // 2. Auto login after register
        await login(email, password);

        return true;
      } catch (err) {
        console.error("Register failed", err);
        return false;
      }
    },
    [login],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateProfile,
        loginWithAPI,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
