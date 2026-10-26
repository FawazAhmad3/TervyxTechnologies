import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import site from "../data/site.json";
type Theme = "light" | "dark";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(
  null,
);
function readTheme(): Theme {
  try {
    return localStorage.getItem(site.theme.storageKey) === "light"
      ? "light"
      : "dark";
  } catch {
    return "dark";
  }
}
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readTheme);
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        "content",
        theme === "light" ? site.theme.lightColor : site.metadata.themeColor,
      );
    try {
      localStorage.setItem(site.theme.storageKey, theme);
    } catch {
      /* Preference remains active for this page when browser storage is unavailable. */
    }
  }, [theme]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === site.theme.storageKey)
        setTheme(event.newValue === "light" ? "light" : "dark");
    };
    addEventListener("storage", sync);
    return () => removeEventListener("storage", sync);
  }, []);
  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle: () =>
          setTheme((current) => (current === "dark" ? "light" : "dark")),
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
