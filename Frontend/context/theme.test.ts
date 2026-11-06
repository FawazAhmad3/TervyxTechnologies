import { readFileSync, readdirSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveTheme } from "./theme";
test("theme follows system without an explicit preference", () => {
  assert.equal(resolveTheme(null, true), "dark");
  assert.equal(resolveTheme(null, false), "light");
  assert.equal(resolveTheme("invalid", false), "light");
});
test("explicit theme overrides the system preference", () => {
  assert.equal(resolveTheme("light", true), "light");
  assert.equal(resolveTheme("dark", false), "dark");
});

// Exercise the actual first-paint script in every HTML entry, including a
// browser with an old saved override. Storage must never affect a new visit.
test("every page starts with the system theme and ignores old saved overrides", () => {
  const directory = new URL("../", import.meta.url);
  for (const file of readdirSync(directory).filter((file) =>
    file.endsWith(".html"),
  )) {
    const html = readFileSync(new URL(file, directory), "utf8");
    const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].find(
      (match) => match[1].includes("prefers-color-scheme"),
    )![1];
    for (const dark of [false, true]) {
      const document = {
        documentElement: {
          dataset: { theme: dark ? "light" : "dark" },
          style: {},
        },
        querySelector: () => ({
          setAttribute: (_key: string, _value: string) => {},
        }),
      };
      const browser = {
        document,
        matchMedia: () => ({ matches: dark }),
        localStorage: {
          getItem: () => (dark ? "light" : "dark"),
        },
      };
      runInNewContext(script, browser);
      assert.equal(
        document.documentElement.dataset.theme,
        dark ? "dark" : "light",
        file,
      );
      document.documentElement.dataset.theme = dark ? "light" : "dark";
      runInNewContext(script, browser);
      assert.equal(
        document.documentElement.dataset.theme,
        dark ? "dark" : "light",
        `${file}: return visit`,
      );
    }
  }
});
