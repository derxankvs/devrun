"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "dark", // Default to dark theme for DevRun
  storageKey = "devrun-theme", // Updated for app name
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme); // Initialize with defaultTheme
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load stored theme on mount (client-side)
  useEffect(() => {
    if (mounted) {
      try {
        const storedTheme = localStorage.getItem(storageKey) as Theme | null;
        if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
          setTheme(storedTheme);
        }
      } catch (e) {
        // In case localStorage is not available or other error
        console.error("Failed to load theme from localStorage", e);
      }
    }
  }, [mounted, storageKey]);

  // Apply theme to DOM and save to localStorage when theme or mounted status changes
  useEffect(() => {
    if (mounted) {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");

      let effectiveTheme = theme;
      if (theme === "system") {
        effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      
      root.classList.add(effectiveTheme);
      try {
        localStorage.setItem(storageKey, theme); // Persist the selected theme ('light', 'dark', or 'system')
      } catch (e) {
        console.error("Failed to save theme to localStorage", e);
      }
    }
  }, [theme, mounted, storageKey]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
