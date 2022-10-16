import "../styles/globals.css";
import "../styles/fonts.css";

import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

import { ApolloProvider } from "@apollo/client";

import client from "../apollo-client";

import Header from "../components/Header";

function MyApp({ Component, pageProps: { session, ...pageProps } }: any) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session}>
        <Toaster />
        <div className="h-screen overflow-y-scroll bg-slate-200 scrollbar-hide">
          <Header />
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </ApolloProvider>
  );
}

export default MyApp;
