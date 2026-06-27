import { createContext, useContext, useMemo, useState } from "react";

const themes = {
  light: {
    mode: "light",
    background: "#f8fafc",
    surface: "#fff",
    surfaceMuted: "#f1f5f9",
    input: "#fff",
    text: "#111827",
    body: "#334155",
    muted: "#64748b",
    border: "#e2e8f0",
    dangerSoft: "#fee2e2",
    dangerBorder: "#fecaca",
    dangerText: "#991b1b",
    navButton: "#111827",
    navButtonText: "#fff",
  },
  dark: {
    mode: "dark",
    background: "#0b1120",
    surface: "#111827",
    surfaceMuted: "#1e293b",
    input: "#0f172a",
    text: "#f8fafc",
    body: "#cbd5e1",
    muted: "#94a3b8",
    border: "#334155",
    dangerSoft: "#450a0a",
    dangerBorder: "#7f1d1d",
    dangerText: "#fecaca",
    navButton: "#e2e8f0",
    navButtonText: "#0f172a",
  },
};

const AppThemeContext = createContext(null);

export function AppThemeProvider({ children }) {
  const [themeName, setThemeName] = useState("light");

  const value = useMemo(() => {
    const isDark = themeName === "dark";

    return {
      colors: themes[themeName],
      isDark,
      toggleTheme: () => setThemeName(isDark ? "light" : "dark"),
    };
  }, [themeName]);

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error("useAppTheme deve ser usado dentro de AppThemeProvider.");
  }

  return context;
}
