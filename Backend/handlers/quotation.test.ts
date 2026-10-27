import { test, mock } from "node:test";
import assert from "node:assert/strict";
import nodemailer from "nodemailer";
import { handleQuotation, validateQuotation } from "./quotation.js";
import { quotationMessage } from "../email/quotationTemplate.js";
import {
  sendQuotation,
  validateEmailConfig,
} from "../services/emailService.js";
const quote = {
  name: "Alex & Company",
  email: "alex@example.com",
  services: ["Web Development"],
  idea: "A business website.\nInclude a contact form.",
};
const request = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("https://tervyx.example/api/quotation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://tervyx.example",
      ...headers,
    },
    body: JSON.stringify(body),
  });
test("quote handler delivers validated data once and returns a reference only after success", async () => {
  let sent = 0;
  const response = await handleQuotation(
    request(quote),
    async (value, reference, date) => {
      sent++;
      assert.deepEqual(value, quote);
      assert.match(reference, /^TVX-\d{8}-[A-F0-9]{8}$/);
      assert.ok(date instanceof Date);
    },
  );
  assert.equal(response.status, 200);
  assert.equal(sent, 1);
  assert.equal((await response.json()).success, true);
});
test("invalid requests never send an email", async () => {
  let sent = 0;
  const deliver = async () => {
    sent++;
  };
  for (const body of [
    null,
    {},
    { ...quote, email: "bad\r\nBcc: victim@example.com" },
    { ...quote, name: "Alex\nBCC" },
    { ...quote, services: ["unknown"] },
    { ...quote, idea: " " },
    { ...quote, idea: "x".repeat(5001) },
    { ...quote, website: "spam" },
  ]) {
    assert.equal((await handleQuotation(request(body), deliver)).status, 400);
  }
  assert.equal(
    (
      await handleQuotation(
        request(quote, { Origin: "https://other.example" }),
        deliver,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await handleQuotation(
        request(quote, { "Content-Type": "text/plain" }),
        deliver,
      )
    ).status,
    415,
  );
  assert.equal(
    (
      await handleQuotation(
        request({ ...quote, idea: "x".repeat(25000) }),
        deliver,
      )
    ).status,
    413,
  );
  assert.equal(
    (
      await handleQuotation(
        new Request("https://tervyx.example/api/quotation"),
        deliver,
      )
    ).status,
    405,
  );
  assert.equal(sent, 0);
});
test("SMTP errors never report success or disclose provider details", async () => {
  const response = await handleQuotation(request(quote), async () => {
    throw new Error("secret-provider-response");
  });
  assert.equal(response.status, 503);
  assert.doesNotMatch(await response.text(), /secret-provider-response/);
});
test("HTML notification escapes client input and includes text fallback", () => {
  const message = quotationMessage(
    {
      ...quote,
      name: '<script>alert("x")</script>',
      idea: "<img src=x onerror=alert(1)>\nSecond line",
    },
    "TVX-TEST",
    new Date("2026-10-27T12:00:00Z"),
  );
  assert.doesNotMatch(message.html, /<script>|<img src=x/);
  assert.match(message.html, /&lt;script&gt;/);
  assert.match(message.html, /<br>Second line/);
  assert.match(message.html, /Client details/);
  assert.match(message.html, /Project requirements/);
  assert.match(message.text, /alex@example.com/);
  assert.match(message.subject, /TVX-TEST/);
});
test("SMTP uses configured recipient, authenticated sender, and visitor Reply-To", async () => {
  const previous = process.env.EMAIL_CONFIG_JSON;
  const config = {
    smtp: { host: "smtp.example.com", port: 465, secure: true },
    sender: {
      name: "TERVYX Technologies",
      email: "sender@example.com",
      appPassword: "test-only",
    },
    notifications: { receivingEmail: "team@example.com" },
  };
  process.env.EMAIL_CONFIG_JSON = JSON.stringify(config);
  let options: any;
  let message: any;
  let closed = false;
  const transport = mock.method(
    nodemailer,
    "createTransport",
    (value: unknown) => {
      options = value;
      return {
        sendMail: async (value: unknown) => {
          message = value;
          return { accepted: ["team@example.com"], rejected: [] };
        },
        close: () => {
          closed = true;
        },
      };
    },
  );
  try {
    await sendQuotation(quote, "TVX-TEST", new Date());
    assert.equal(options.auth.user, "sender@example.com");
    assert.equal(options.disableUrlAccess, true);
    assert.equal(message.to, "team@example.com");
    assert.equal(message.from.address, "sender@example.com");
    assert.equal(message.replyTo.address, quote.email);
    assert.ok(message.html && message.text);
    assert.equal(closed, true);
    assert.throws(() =>
      validateEmailConfig({
        ...config,
        sender: { ...config.sender, appPassword: "" },
      }),
    );
    assert.equal(
      validateQuotation({
        ...quote,
        services: ["Web Development", "Web Development"],
      }).services.length,
      1,
    );
  } finally {
    transport.mock.restore();
    if (previous === undefined) delete process.env.EMAIL_CONFIG_JSON;
    else process.env.EMAIL_CONFIG_JSON = previous;
  }
});
