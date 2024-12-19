import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  user: {
    username: string;
    token: string;
    role: Role;
    customername: string;
  } | null;
  login: (
    username: string,
    token: string,
    role: Role,
    customername: string
  ) => void;
  logout: () => void;
}

export type Role = "manager" | "staff" | "customer";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{
    username: string;
    token: string;
    role: Role;
    customername: string;
  } | null>(null);
  const login = (
    username: string,
    token: string,
    role: Role,
    customername: string
  ) => {
    setIsLoggedIn(true);
    setUser({ username, token, role, customername });
    localStorage.setItem(
      "token",
      JSON.stringify({ username, token, role, customername })
    );
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const stored_state = localStorage.getItem("token");
    console.log("stored_state " + stored_state);
    if (stored_state) {
      setUser(JSON.parse(stored_state));
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
