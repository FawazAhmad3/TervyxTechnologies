import nodemailer from "nodemailer";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  quotationMessage,
  type Quotation,
} from "../email/quotationTemplate.js";
export type EmailConfig = {
  smtp: { host: string; port: number; secure: boolean };
  sender: { name: string; email: string; appPassword: string };
  notifications: { receivingEmail: string };
};
export function validEmail(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 254 &&
    /^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(value)
  );
}
export function validateEmailConfig(value: unknown): EmailConfig {
  const c = value as EmailConfig;
  if (
    !c ||
    !c.smtp ||
    typeof c.smtp.host !== "string" ||
    !c.smtp.host.trim() ||
    !Number.isInteger(c.smtp.port) ||
    c.smtp.port < 1 ||
    c.smtp.port > 65535 ||
    typeof c.smtp.secure !== "boolean" ||
    !validEmail(c.sender?.email) ||
    typeof c.sender.name !== "string" ||
    /[\r\n]/.test(c.sender.name) ||
    !c.sender.appPassword?.trim() ||
    !validEmail(c.notifications?.receivingEmail)
  )
    throw new Error("Email configuration is incomplete");
  return c;
}
export async function loadEmailConfig(): Promise<EmailConfig> {
  if (process.env.EMAIL_CONFIG_JSON)
    return validateEmailConfig(JSON.parse(process.env.EMAIL_CONFIG_JSON));
  // Hosted functions use environment secrets only; never package the private JSON.
  if (process.env.NETLIFY)
    throw new Error("Email environment secret is missing");
  const paths = [
    resolve("Backend/config/email.json"),
    resolve("config/email.json"),
  ];
  for (const path of paths) {
    try {
      return validateEmailConfig(JSON.parse(await readFile(path, "utf8")));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
  throw new Error("Email configuration is missing");
}
export async function sendQuotation(
  quote: Quotation,
  reference: string,
  receivedAt: Date,
) {
  const c = await loadEmailConfig();
  const transport = nodemailer.createTransport({
    host: c.smtp.host,
    port: c.smtp.port,
    secure: c.smtp.secure,
    requireTLS: !c.smtp.secure,
    auth: { user: c.sender.email, pass: c.sender.appPassword },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  try {
    const result = await transport.sendMail({
      from: { name: c.sender.name, address: c.sender.email },
      to: c.notifications.receivingEmail,
      replyTo: { name: quote.name, address: quote.email },
      ...quotationMessage(quote, reference, receivedAt),
    });
    if (!result.accepted?.length || result.rejected?.length)
      throw new Error("Message not accepted");
  } finally {
    transport.close();
  }
}
