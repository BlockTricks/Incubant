"use client";

import { connect, disconnect, getLocalStorage, isConnected } from "@stacks/connect";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { APP_NAME, APP_ICON } from "@/lib/stacks-config";

interface StacksContextType {
  userData: any;
  isSignedIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
}

const StacksContext = createContext<StacksContextType | undefined>(undefined);

export function StacksProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<any>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // Check if user is already connected
    if (isConnected()) {
      const data = getLocalStorage();
      if (data?.addresses) {
        setUserData(data);
        setIsSignedIn(true);
      }
    }
  }, []);

  const signIn = async () => {
    try {
      const response = await connect({
        appDetails: {
          name: APP_NAME,
          icon: APP_ICON,
        },
      });
      
      if (response) {
        const data = getLocalStorage();
        setUserData(data);
        setIsSignedIn(true);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const signOut = () => {
    disconnect();
    setUserData(null);
    setIsSignedIn(false);
  };

  return (
    <StacksContext.Provider
      value={{
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

