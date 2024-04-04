"use client";

import { authenticateUser } from "@/helpers/api-helper";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  token: string;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: "",
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

export default function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const loadedToken = localStorage.getItem("authToken");
    if (loadedToken) {
      setToken(loadedToken);
    }
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    return authenticateUser(username, password)
      .then((result) => {
        const token = (result as { token: string }).token;
        setToken(token);
        localStorage.setItem("authToken", token);
        return Promise.resolve(true);
      })
      .catch((error) => {
        // Handle login error
        console.error("Login error:", error);
        return Promise.reject(false);
      });
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
