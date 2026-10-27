import { writeFile } from "node:fs/promises";
import { quotationMessage } from "./quotationTemplate.js";
const { html } = quotationMessage(
  {
    name: "Alex Morgan",
    email: "alex@example.com",
    services: ["Web Development", "Digital Marketing"],
    idea: "We’re launching a consulting business and need a modern, responsive website with service pages and an enquiry form.\n\nWe would also like a social media launch strategy. Our target launch is in six weeks. Please advise on scope, timeline, and next steps.",
  },
  "TVX-20261027-A1B2C3D4",
  new Date("2026-10-27T10:30:00Z"),
);
await writeFile(new URL("preview.html", import.meta.url), html);
console.log(
  "Email preview generated: Backend/email/preview.html (sample data only; no email sent)",
);
