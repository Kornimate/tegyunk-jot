import { createContext, useState, useContext } from "react";

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

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

  const checkIfTokenIsValid = () => {
    const tokenData = JSON.parse(localStorage.getItem("tknTJ") ?? "{}");
    return new Date(tokenData.expiration) > new Date();
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
