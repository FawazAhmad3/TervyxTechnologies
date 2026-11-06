import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import site from "../data/site.json";
import { resolveTheme, type Theme } from "./theme";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(
  null,
);
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<Theme | null>(null);
  // Match prerendered markup, then resolve the system theme before paint.
  // A manual override lasts only for this page visit.
  const [systemDark, setSystemDark] = useState(false);
  useLayoutEffect(() => {
    setSystemDark(matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);
  const theme = resolveTheme(choice, systemDark);
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        "content",
        theme === "light" ? site.theme.lightColor : site.metadata.themeColor,
      );
  }, [theme]);
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const changed = () => setSystemDark(media.matches);
    changed();
    media.addEventListener("change", changed);
    return () => {
      media.removeEventListener("change", changed);
    };
  }, []);
  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle: () => {
          const next = theme === "dark" ? "light" : "dark";
          setChoice(next);
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("Theme controls require ThemeProvider");
  return context;
}
