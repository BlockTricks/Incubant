"use client";

import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { network, APP_NAME, APP_ICON } from "@/lib/stacks-config";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

interface StacksContextType {
  userSession: UserSession;
  userData: any;
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
}

const StacksContext = createContext<StacksContextType | undefined>(undefined);

export function StacksProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<any>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
      setIsSignedIn(true);
    }
  }, []);

  const signIn = () => {
    showConnect({
      appDetails: {
        name: APP_NAME,
        icon: APP_ICON,
      },
      redirectTo: "/",
      onFinish: () => {
        const userData = userSession.loadUserData();
        setUserData(userData);
        setIsSignedIn(true);
        window.location.reload();
      },
      userSession,
    });
  };

  const signOut = () => {
    userSession.signUserOut();
    setUserData(null);
    setIsSignedIn(false);
    window.location.reload();
  };

  return (
    <StacksContext.Provider
      value={{
        userSession,
        userData,
        isSignedIn,
        signIn,
        signOut,
      }}
    >
      {children}
    </StacksContext.Provider>
  );
}

export function useStacks() {
  const context = useContext(StacksContext);
  if (context === undefined) {
    throw new Error("useStacks must be used within a StacksProvider");
  }
  return context;
}

