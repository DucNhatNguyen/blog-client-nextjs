import { createContext, useState, useEffect } from "react";
import { isLoggedIn } from "../utils/authority.js";

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [isLoginState, setIsLoginState] = useState(false);

  useEffect(() => {
    setIsLoginState(isLoggedIn());
  }, []);

  return (
    <AppContext.Provider value={{ isLoginState, setIsLoginState }}>
      {children}
    </AppContext.Provider>
  );
};
