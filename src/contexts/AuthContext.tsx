import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("chat_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock login - in production, connect to real auth
    if (username.length >= 3 && password.length >= 4) {
      const newUser: User = {
        id: crypto.randomUUID(),
        username,
      };
      setUser(newUser);
      localStorage.setItem("chat_user", JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const signup = async (username: string, password: string): Promise<boolean> => {
    // Mock signup - in production, connect to real auth
    if (username.length >= 3 && password.length >= 4) {
      const newUser: User = {
        id: crypto.randomUUID(),
        username,
      };
      setUser(newUser);
      localStorage.setItem("chat_user", JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("chat_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
