import React, { useContext } from "react";
import { useRouter } from "next/router";
import { AppContext } from "../context/AppContext.js";

export default function Home() {
  const redirectTo = "/Home/login";
  if (typeof window === "undefined") return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isLoginState, setIsLoginState } = useContext(AppContext);
  //check login state
  if (isLoginState) {
    router.push("/Blog");
  } else {
    router.push(redirectTo);
  }
  return <></>;
}
