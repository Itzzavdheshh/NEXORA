import { createContext } from "react";

export const ThemeContext = createContext(null);
export const THEME_STORAGE_KEY = "nexora.theme";

export function getInitialTheme() {
  return "dark";
}
