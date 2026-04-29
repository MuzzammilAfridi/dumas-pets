import React, { createContext, useContext, useState, useCallback } from "react";
import {
  getLoggedUser,
  loginUser,
  logoutAPI,
  registerUserAPI,
} from "@/services/authService";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

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
    /*
    -----------------------------------
    Step 1 → Get logged in user email
    -----------------------------------
    */
    const loggedUserRes = await getLoggedUser();
    const email = loggedUserRes.data.message;

    /*
    -----------------------------------
    Step 2 → Get full user details
    GET /api/resource/User/:email
    -----------------------------------
    */
    const userDetailsRes = await axios.get(
      `${API}/api/resource/User/${email}`,
      {
        withCredentials: true,
      }
    );

    const userData = userDetailsRes.data.data;

    /*
    -----------------------------------
    Build full frontend user object
    -----------------------------------
    */
    const role =
      email === "Administrator"
        ? "admin"
        : "customer";

    const user = {
      id: userData.name,
      name:
        userData.full_name ||
        userData.first_name ||
        email.split("@")[0],

      email: userData.email,
      role,

      phone: userData.mobile_no || "",
      avatar: userData.user_image || "",

      username: userData.username || "",
      lastLogin: userData.last_login || "",
      timeZone: userData.time_zone || "",
      language: userData.language || "",
      enabled: userData.enabled || 0,
    };

    console.log(
      "FULL LOGGED USER DATA:",
      user
    );

    setUser(user);
    localStorage.setItem(
      "dumas_user",
      JSON.stringify(user)
    );

    return user;
  } catch (err) {
    console.error(
      "Error fetching full user:",
      err
    );
    throw err;
  }
}, []);

  // const login = useCallback(
  //   async (email: string, password: string): Promise<boolean> => {
  //     try {
  //       await loginUser({
  //         usr: email,
  //         pwd: password,
  //       });

  //       await loginWithAPI(); // fetch logged user

  //       return true;
  //     } catch (err) {
  //       console.error("Login failed", err);
  //       return false;
  //     }
  //   },
  //   [loginWithAPI],
  // );


const login = useCallback(
  async (email: string, password: string): Promise<boolean> => {
    try {
      // Step 1: Login request
      const response = await loginUser({
        usr: email,
        pwd: password,
      });

      // Step 2: Read login response
      const { full_name, home_page } = response.data;

      // Step 3: Detect role
      const isAdmin =
        email.toLowerCase() === "administrator" ||
        home_page === "/app";

      // Step 4: Save frontend user
      const userData = {
        id: email,
        name: full_name || email.split("@")[0],
        email,
        role: isAdmin ? "admin" : "customer",
      };

      setUser(userData);
      localStorage.setItem(
        "dumas_user",
        JSON.stringify(userData)
      );

      return true;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    }
  },
  []
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
