import { createServer } from "node:http";
import { config } from "./config.js";
import { apiRoutes } from "./routes/api.js";
const server = createServer((request, response) => {
  void apiRoutes(request, response);
});
server.listen(config.port, config.host, () =>
  console.log(`TERVYX API: http://${config.host}:${config.port}`),
);
for (const signal of ["SIGINT", "SIGTERM"] as const)
  process.on(signal, () => server.close(() => process.exit(0)));
