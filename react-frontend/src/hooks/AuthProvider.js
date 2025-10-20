import { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const email = () => {
    const tokenData = JSON.parse(localStorage.getItem("tknTJ") ?? "{}");
    return tokenData.email;
  };

  const token = () => {
    const tokenData = JSON.parse(localStorage.getItem("tknTJ") ?? "{}");
    return tokenData.token;
  };

  const login = (token, email) => {
    const expiration = new Date();
    const newTime = expiration.getHours() + 3;
    expiration.setHours(newTime);

    localStorage.setItem(
      "tknTJ",
      JSON.stringify({
        token: token,
        email: email,
        expiration: expiration,
      })
    );

    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("tknTJ");
    setIsAuthenticated(false);
  };

  const checkIfTokenIsValid = async () => {
    const tokenData = JSON.parse(localStorage.getItem("tknTJ") ?? "{}");

    if (!tokenData?.token) return false;

    try {
      await axios.get(`${process.env.REACT_APP_BASE_URL}/api/auth/fast`, {
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      });

      return new Date(tokenData.expiration) > new Date();
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        email,
        login,
        logout,
        checkIfTokenIsValid,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
