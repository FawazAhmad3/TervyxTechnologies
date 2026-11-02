export function normalizePath(path: string) {
  const clean =
    path
      .split(/[?#]/)[0]
      .replace(/\.html$/, "")
      .replace(/\/+$/, "") || "/";
  return clean === "/index" ? "/" : clean;
}
