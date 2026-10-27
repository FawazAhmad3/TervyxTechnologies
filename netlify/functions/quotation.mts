import type { Config } from "@netlify/functions";
import { handleQuotation } from "../../Backend/handlers/quotation.js";
export default (request: Request) => handleQuotation(request);
export const config = {
  path: "/api/quotation",
  rateLimit: {
    action: "rate_limit",
    aggregateBy: ["ip", "domain"],
    windowLimit: 5,
    windowSize: 60,
  },
} satisfies Config;
