import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/theme"; // Adjust path as needed

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  theme: typeof Colors.light;
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemColorScheme || "dark");

  // Sync with system changes if desired
  useEffect(() => {
    if (systemColorScheme) {
      setMode(systemColorScheme);
    }
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = {
    theme: Colors[mode],
    mode,
    isDark: mode === "dark",
    toggleTheme,
    setTheme: (newMode: ThemeMode) => setMode(newMode),
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
