import { usePagePath } from "../context/PagePathContext";
import { localeFromPath, localizedHref } from "../i18n/locale";
export default function LanguageSwitch({
  mobile = false,
}: {
  mobile?: boolean;
}) {
  const path = usePagePath();
  const italian = localeFromPath(path) === "it";
  const next = italian ? "en" : "it";
  return (
    <a
      className={`language-switch ${mobile ? "language-switch-mobile" : "language-switch-desktop"}`}
      href={localizedHref(path, next)}
      title={italian ? "Read in English" : "Leggi in italiano"}
      hrefLang={next}
      lang={next}
      aria-label={
        italian
          ? "Read this page in English"
          : "Leggi questa pagina in italiano"
      }
      onClick={(event) => {
        // Preserve service selection and section links when switching languages.
        event.currentTarget.href =
          localizedHref(path, next) + location.search + location.hash;
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </svg>
      {mobile ? (italian ? "English" : "Italiano") : italian ? "EN" : "IT"}
    </a>
  );
}
