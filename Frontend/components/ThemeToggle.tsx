import { useTheme } from "../context/ThemeContext";
import site from "../data/site.json";
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const light = theme === "light";
  const label = light ? site.theme.switchToDark : site.theme.switchToLight;
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        {light ? (
          <path d="M20.7 13.2A8.7 8.7 0 0 1 10.8 3.3 8.8 8.8 0 1 0 20.7 13.2Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
          </>
        )}
      </svg>
      <span>{light ? site.theme.dark : site.theme.light}</span>
    </button>
  );
}
