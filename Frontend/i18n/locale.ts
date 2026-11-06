export type Locale = "en" | "it";
export function localeFromPath(path: string): Locale {
  return /^\/it(?:\/|$)/.test(path) ? "it" : "en";
}
export function basePath(path: string) {
  return path.replace(/^\/it(?=\/|$)/, "") || "/";
}
export function localizedHref(href: string, locale: Locale): string {
  if (
    !href.startsWith("/") ||
    href.startsWith("//") ||
    /^\/(?:api|assets|fonts|brand)(?:\/|$)/.test(href)
  )
    return href;
  const plain = basePath(href);
  return locale === "it" ? `/it${plain === "/" ? "/" : plain}` : plain;
}
