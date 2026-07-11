import { createContext } from "react";

export const ThemeContext = createContext(null);
export const THEME_STORAGE_KEY = "nexora.theme";

export function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme) return savedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
