import { randomUUID } from "node:crypto";
import {
  loadEmailConfig,
  sendQuotation,
  validEmail,
} from "../services/emailService.js";
import type { Quotation } from "../email/quotationTemplate.js";
const allowedServices = new Set([
  "Web Development",
  "App Development",
  "Digital Marketing",
]);
const maxBytes = 24000;
export class InputError extends Error {}
export function validateQuotation(input: unknown): Quotation {
  const q = input as Quotation;
  if (
    !q ||
    typeof q.name !== "string" ||
    !q.name.trim() ||
    q.name.length > 120 ||
    /[\r\n\x00-\x1f]/.test(q.name) ||
    !validEmail(q.email) ||
    !Array.isArray(q.services) ||
    !q.services.length ||
    q.services.length > 3 ||
    q.services.some((s) => !allowedServices.has(s)) ||
    typeof q.idea !== "string" ||
    !q.idea.trim() ||
    q.idea.length > 5000
  )
    throw new InputError(
      "Please provide your name, a valid email, services, and project requirements.",
    );
  return {
    name: q.name.trim(),
    email: q.email.trim(),
    services: [...new Set(q.services)],
    idea: q.idea.trim(),
  };
}
const json = (data: object, status = 200, extra = {}) =>
  Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extra,
    },
  });
export async function handleQuotation(
  request: Request,
  deliver = sendQuotation,
): Promise<Response> {
  // Safe deployment check: reports readiness only, never secrets or addresses.
  if (
    request.method === "GET" &&
    new URL(request.url).searchParams.get("health") === "1"
  ) {
    try {
      await loadEmailConfig();
      return json({ configured: true });
    } catch {
      return json(
        { configured: false, code: "EMAIL_CONFIGURATION_UNAVAILABLE" },
        503,
      );
    }
  }
  if (request.method !== "POST")
    return json({ error: "Method not allowed" }, 405, { Allow: "POST" });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return json({ error: "Request origin is not allowed" }, 403);
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  )
    return json({ error: "Use JSON content" }, 415);
  if (Number(request.headers.get("content-length")) > maxBytes)
    return json({ error: "Request is too large" }, 413);
  let input: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return json({ error: "Request body is required" }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > maxBytes) {
        await reader.cancel();
        return json({ error: "Request is too large" }, 413);
      }
      chunks.push(value);
    }
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }
  // A hidden field catches basic automated form spam without emailing anyone.
  if (
    typeof (input as { website?: unknown })?.website === "string" &&
    (input as { website: string }).website
  )
    return json({ error: "Unable to submit this request" }, 400);
  let quote: Quotation;
  try {
    quote = validateQuotation(input);
  } catch (error) {
    return json(
      {
        error: error instanceof InputError ? error.message : "Invalid request",
      },
      400,
    );
  }
  const receivedAt = new Date();
  const reference = `TVX-${receivedAt.toISOString().slice(0, 10).replace(/-/g, "")}-${randomUUID().slice(0, 8).toUpperCase()}`;
  try {
    await deliver(quote, reference, receivedAt);
    return json({ success: true, reference });
  } catch {
    // Do not expose SMTP credentials, server responses, or client content in logs.
    return json(
      {
        error:
          "We couldn’t send your request right now. Please try again shortly.",
      },
      503,
    );
  }
}
