import { createContext, useContext, useEffect, useState } from "react";
import { themeSelectors } from "@/Consts";

type Theme =
  | "zinc"
  | "slate"
  | "stone"
  | "gray"
  | "neutral"
  | "red"
  | "rose"
  | "orange"
  | "green"
  | "blue"
  | "yellow"
  | "violet";
type Mode = "light" | "dark";
export type Radius = "0" | "30" | "50" | "75" | "100";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultMode?: Mode;
  defaultRadius?: Radius;
  storageTheme?: string;
  storageMode?: string;
  storageRadius?: string;
};

type ThemeProviderState = {
  theme: Theme;
  mode: Mode;
  radius: Radius;
  setTheme: (theme: Theme) => void;
  setMode: (mode: Mode) => void;
  setRadius: (radius: Radius) => void;
};

const initialState: ThemeProviderState = {
  theme: "violet",
  mode: "dark",
  radius: "75",
  setTheme: () => null,
  setMode: () => null,
  setRadius: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "violet",
  defaultMode = "dark",
  defaultRadius = "75",
  storageTheme = "ui_theme",
  storageMode = "ui_mode",
  storageRadius = "ui_radius",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageTheme) as Theme) || defaultTheme
  );
  const [mode, setMode] = useState<Mode>(
    () => (localStorage.getItem(storageMode) as Mode) || defaultMode
  );
  const [radius, setRadius] = useState<Radius>(
    () => (localStorage.getItem(storageRadius) as Radius) || defaultRadius
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(...themeSelectors);
    root.classList.add(`${mode}_${theme}`);
    root.classList.add(`radius_${radius}`);
    console.log("ASD");
  }, [theme, mode, radius]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageTheme, theme);
      setTheme(theme);
    },
    mode,
    setMode: (mode: Mode) => {
      localStorage.setItem(storageMode, mode);
      setMode(mode);
    },
    radius,
    setRadius: (radius: Radius) => {
      localStorage.setItem(storageRadius, radius);
      setRadius(radius);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
