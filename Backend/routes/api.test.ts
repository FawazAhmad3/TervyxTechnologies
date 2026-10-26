import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { apiRoutes } from "./api.js";
test("API serves shared JSON content and rejects unsupported routes and writes", async () => {
  const server = createServer((req, res) => {
    void apiRoutes(req, res);
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const base = `http://127.0.0.1:${address.port}`;
    const health = await fetch(`${base}/api/health`);
    assert.equal(health.status, 200);
    assert.equal((await health.json()).status, "ok");
    const services = await fetch(`${base}/api/services`);
    assert.equal(services.status, 200);
    const content = await services.json();
    assert.equal(content.services.length, 3);
    assert.ok(
      content.services.every(
        (s: { title: string; href: string }) => s.title && s.href,
      ),
    );
    assert.equal((await fetch(`${base}/api/missing`)).status, 404);
    assert.equal(
      (await fetch(`${base}/api/services`, { method: "POST" })).status,
      405,
    );
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});
