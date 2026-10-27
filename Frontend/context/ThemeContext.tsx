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
function preference(): Theme | null {
  try {
    const value = localStorage.getItem(site.theme.storageKey);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<Theme | null>(preference);
  const [systemDark, setSystemDark] = useState(
    () => matchMedia("(prefers-color-scheme: dark)").matches,
  );
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
    const sync = (event: StorageEvent) => {
      if (event.key === site.theme.storageKey || event.key === null)
        setChoice(preference());
    };
    changed();
    media.addEventListener("change", changed);
    addEventListener("storage", sync);
    return () => {
      media.removeEventListener("change", changed);
      removeEventListener("storage", sync);
    };
  }, []);
  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle: () => {
          const next = theme === "dark" ? "light" : "dark";
          setChoice(next);
          try {
            localStorage.setItem(site.theme.storageKey, next);
          } catch {
            /* Apply on this page even if storage is unavailable. */
          }
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
