import type { IncomingMessage, ServerResponse } from "node:http";
import { handleQuotation } from "../handlers/quotation.js";
import { healthController } from "../controllers/healthController.js";
import { servicesController } from "../controllers/servicesController.js";
const attempts = new Map<string, { count: number; reset: number }>();
export async function apiRoutes(
  request: IncomingMessage,
  response: ServerResponse,
) {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("X-Content-Type-Options", "nosniff");
  const path = new URL(request.url ?? "/", "http://localhost").pathname;
  if (path === "/api/quotation") {
    if (request.method !== "POST") {
      response.setHeader("Allow", "POST");
      response.writeHead(405);
      response.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }
    const ip = request.socket.remoteAddress ?? "unknown";
    const now = Date.now();
    for (const [key, item] of attempts)
      if (now >= item.reset) attempts.delete(key);
    const entry = attempts.get(ip) ?? { count: 0, reset: now + 60000 };
    attempts.set(ip, entry);
    if (++entry.count > 5) {
      response.writeHead(429);
      response.end(
        JSON.stringify({ error: "Please wait before sending another request" }),
      );
      return;
    }
    const chunks: Buffer[] = [];
    let bytes = 0;
    try {
      for await (const chunk of request) {
        const buffer = Buffer.from(chunk);
        bytes += buffer.length;
        if (bytes > 24000) {
          response.writeHead(413);
          response.end(JSON.stringify({ error: "Request is too large" }));
          return;
        }
        chunks.push(buffer);
      }
      const headers = new Headers();
      for (const [key, value] of Object.entries(request.headers))
        if (typeof value === "string") headers.set(key, value);
      const result = await handleQuotation(
        new Request(`http://${request.headers.host ?? "localhost"}${path}`, {
          method: "POST",
          headers,
          body: Buffer.concat(chunks),
        }),
      );
      result.headers.forEach((value, key) => response.setHeader(key, value));
      response.writeHead(result.status);
      response.end(await result.text());
    } catch {
      response.writeHead(400);
      response.end(JSON.stringify({ error: "Invalid request" }));
    }
    return;
  }
  if (path !== "/api/health" && path !== "/api/services") {
    response.writeHead(404);
    response.end(JSON.stringify({ error: "Not found" }));
    return;
  }
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.writeHead(405);
    response.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }
  try {
    const data =
      path === "/api/health" ? healthController() : await servicesController();
    response.writeHead(200);
    response.end(JSON.stringify(data));
  } catch {
    response.writeHead(500);
    response.end(JSON.stringify({ error: "Unable to load service data" }));
  }
}
