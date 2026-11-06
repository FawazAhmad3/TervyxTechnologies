import { usePagePath } from "../context/PagePathContext";
import { localeFromPath, localizedHref } from "../i18n/locale";
export default function LanguageSwitch() {
  const path = usePagePath();
  const italian = localeFromPath(path) === "it";
  const next = italian ? "en" : "it";
  return (
    <a
      className="language-switch"
      href={localizedHref(path, next)}
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
      {italian ? "English" : "Italiano"}
    </a>
  );
}
