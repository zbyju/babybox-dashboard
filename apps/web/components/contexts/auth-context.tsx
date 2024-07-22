"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authenticateUser, refreshToken } from "@/helpers/api-helper";
import { jwtDecode } from "jwt-decode";

interface UserData {
  username: string;
  email: string;
}

interface AuthContextType {
  token: string;
  isAuthenticated: boolean;
  isLoaded: boolean;
  user: UserData | undefined;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: "",
  user: undefined,
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
  const [user, setUser] = useState<UserData | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const loadedToken = localStorage.getItem("authToken");
    if (loadedToken) {
      setToken(loadedToken);
      const decodedData = jwtDecode(loadedToken);
      setUser(decodedData as UserData);

      // Refresh token on app load
      refresh(loadedToken);
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
        const decodedData = jwtDecode(newToken);
        setUser(decodedData as UserData);
        return Promise.resolve(true);
      })
      .catch((error) => {
        // Handle login error
        console.error("Login error:", error);
        return Promise.reject(false);
      });
  };

  const refresh = async (token: string): Promise<boolean> => {
    return refreshToken(token)
      .then((result) => {
        const newToken = (result as { token: string }).token;
        setToken(newToken);
        const decodedData = jwtDecode(newToken);
        setUser(decodedData as UserData);
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
    setUser(undefined);
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
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
