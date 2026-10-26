import type { IncomingMessage, ServerResponse } from "node:http";
import { healthController } from "../controllers/healthController.js";
import { servicesController } from "../controllers/servicesController.js";
export async function apiRoutes(
  request: IncomingMessage,
  response: ServerResponse,
) {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("X-Content-Type-Options", "nosniff");
  const path = new URL(request.url ?? "/", "http://localhost").pathname;
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
