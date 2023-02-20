import React, { lazy } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { AppProvider } from "../context/AppContext.js";
import LayoutBase from "@components/layout/layout";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <AppProvider>
      {router.pathname == "/Home/login" ||
      router.pathname == "/Home/sign-up" ? (
        <Component {...pageProps} />
      ) : (
        <LayoutBase>
          <Head>
            <title>CMS - Blogs</title>
            <meta charset="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <Component {...pageProps} />
        </LayoutBase>
      )}
    </AppProvider>
  );
}
