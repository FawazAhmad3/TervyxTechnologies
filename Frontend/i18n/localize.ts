import translations from "../data/it/translations.json";
import { localizedHref, type Locale } from "./locale";
export function translate(text: string, locale: Locale) {
  return locale === "it"
    ? ((translations as Record<string, string>)[text] ?? text)
    : text;
}
export function localize<T>(value: T, locale: Locale): T {
  if (locale === "en") return value;
  if (typeof value === "string")
    return (
      value.startsWith("/")
        ? localizedHref(value, locale)
        : translate(value, locale)
    ) as T;
  if (Array.isArray(value))
    return value.map((item) => localize(item, locale)) as T;
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        translate(key, locale),
        localize(item, locale),
      ]),
    ) as T;
  return value;
}
