import React, { useContext } from "react";
import { useRouter } from "next/router";
import { AppContext } from "../context/AppContext.js";
import { removeAccessToken } from "../utils/authority.js";

function LogOut() {
  const [isLoginState, setIsLoginState] = useContext(AppContext);
  const router = useRouter();
  console.log("da vao useLogOut");
  if (statusCode == 401) {
    removeAccessToken(process.env.ACCESS_TOKEN_KEY);
    setIsLoginState(false);
    router.pathname == "/Home/login";
  }
}

export default LogOut;
