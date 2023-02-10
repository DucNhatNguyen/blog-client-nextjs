import { createContext, useState, useEffect } from "react";
import { isLoggedIn, checkIsLoggedIn } from "../utils/authority.js";
import { useRouter } from "next/router";

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const router = useRouter();
  const [isLoginState, setIsLoginState] = useState(false);

  useEffect(() => {
    if (!checkIsLoggedIn()) {
      router.push("/Home/login");
    }
    setIsLoginState(isLoggedIn());
  }, []);

  return (
    <AppContext.Provider value={{ isLoginState, setIsLoginState }}>
      {children}
    </AppContext.Provider>
  );
};
