"use client";

import { authenticateUser } from "@/helpers/api-helper";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  token: string;
  isAuthenticated: boolean;
  isLoaded: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: "",
  isAuthenticated: false,
  isLoaded: false,
  login: async () => false,
  logout: () => {},
});

export default function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [token, setToken] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const loadedToken = localStorage.getItem("authToken");
    if (loadedToken) {
      setToken(loadedToken);
    }
    setIsLoaded(true);
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    return authenticateUser(username, password)
      .then((result) => {
        const newToken = (result as { token: string }).token;
        setToken(newToken);
        localStorage.setItem("authToken", newToken);
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
      value={{
        token,
        isAuthenticated: !!token,
        isLoaded: isLoaded,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
