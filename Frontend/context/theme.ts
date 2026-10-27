export type Theme = "light" | "dark";
export function resolveTheme(
  preference: string | null,
  systemDark: boolean,
): Theme {
  return preference === "light" || preference === "dark"
    ? preference
    : systemDark
      ? "dark"
      : "light";
}
