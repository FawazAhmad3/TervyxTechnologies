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
