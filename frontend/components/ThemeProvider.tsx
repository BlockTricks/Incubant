"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always start with "light" on both server and client to prevent hydration mismatch
  // We'll update it after mount based on localStorage
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  const applyTheme = useCallback((newTheme: Theme) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    
    // Remove dark class first
    root.classList.remove("dark");
    
    // Add dark class only if theme is dark
    if (newTheme === "dark") {
      root.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    // On mount, read the actual theme from localStorage or system preference
    const getInitialTheme = (): Theme => {
      try {
        const savedTheme = localStorage.getItem("theme") as Theme;
        if (savedTheme === "light" || savedTheme === "dark") {
          return savedTheme;
        }
      } catch (e) {
        // localStorage might not be available
      }
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    };

    const initialTheme = getInitialTheme();
    // Apply theme immediately before setting state
    applyTheme(initialTheme);
    setTheme(initialTheme);
    setMounted(true);
  }, [applyTheme]);

  useEffect(() => {
    // Apply theme whenever it changes after mount
    if (mounted) {
      applyTheme(theme);
    }
  }, [theme, mounted, applyTheme]);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => {
      const newTheme = currentTheme === "light" ? "dark" : "light";
      // Save to localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("theme", newTheme);
        } catch (e) {
          // localStorage might not be available
        }
      }
      // Apply theme immediately - don't wait for state update
      applyTheme(newTheme);
      return newTheme;
    });
  }, [applyTheme]);

  // Always provide the context, even before mount
  // This prevents the "must be used within ThemeProvider" error
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

