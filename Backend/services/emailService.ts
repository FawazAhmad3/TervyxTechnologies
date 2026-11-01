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
export class EmailConfigurationError extends Error {
  constructor(
    public code: string,
    public fields: string[] = [],
  ) {
    super("Email configuration is unavailable");
  }
}
export function validateEmailConfig(value: unknown): EmailConfig {
  const c = value as EmailConfig | null;
  const fields: string[] = [];
  if (typeof c?.smtp?.host !== "string" || !c.smtp.host.trim())
    fields.push("smtp.host");
  if (
    !Number.isInteger(c?.smtp?.port) ||
    c!.smtp.port < 1 ||
    c!.smtp.port > 65535
  )
    fields.push("smtp.port");
  if (typeof c?.smtp?.secure !== "boolean") fields.push("smtp.secure");
  if (!validEmail(c?.sender?.email)) fields.push("sender.email");
  if (typeof c?.sender?.name !== "string" || /[\r\n]/.test(c.sender.name))
    fields.push("sender.name");
  if (
    typeof c?.sender?.appPassword !== "string" ||
    !c.sender.appPassword.trim()
  )
    fields.push("sender.appPassword");
  if (!validEmail(c?.notifications?.receivingEmail))
    fields.push("notifications.receivingEmail");
  if (fields.length)
    throw new EmailConfigurationError("EMAIL_CONFIG_INVALID_SETTINGS", fields);
  const result = c as EmailConfig;
  return {
    ...result,
    sender: {
      ...result.sender,
      appPassword:
        result.smtp.host === "smtp.gmail.com"
          ? result.sender.appPassword.replace(/\s/g, "")
          : result.sender.appPassword,
    },
  };
}
export async function loadEmailConfig(): Promise<EmailConfig> {
  if (process.env.EMAIL_CONFIG_JSON !== undefined) {
    if (!process.env.EMAIL_CONFIG_JSON.trim())
      throw new EmailConfigurationError("EMAIL_CONFIG_EMPTY");
    let value: unknown;
    try {
      value = JSON.parse(process.env.EMAIL_CONFIG_JSON.trim());
    } catch {
      throw new EmailConfigurationError("EMAIL_CONFIG_INVALID_JSON");
    }
    return validateEmailConfig(value);
  }
  // Hosted functions use environment secrets only; never package the private JSON.
  if (process.env.NETLIFY)
    throw new EmailConfigurationError("EMAIL_CONFIG_MISSING");
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
  throw new EmailConfigurationError("EMAIL_CONFIG_MISSING");
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
