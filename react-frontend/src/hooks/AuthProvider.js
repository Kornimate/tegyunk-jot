import { createContext, useState, useContext } from "react";

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
