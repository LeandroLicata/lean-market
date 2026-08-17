"use client";

import { Provider as ReduxProvider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { store } from "@/store/store";
import CartSync from "./CartSync";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider refetchInterval={60}>
      <ReduxProvider store={store}>
        <CartSync />
        {children}
      </ReduxProvider>
    </SessionProvider>
  );
}
