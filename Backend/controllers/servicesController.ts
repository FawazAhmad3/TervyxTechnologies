import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
// Read the same editable content as the frontend; no duplicated service copy.
const source = fileURLToPath(
  new URL(
    import.meta.url.includes("/build/")
      ? "../../../Frontend/data/services.json"
      : "../../Frontend/data/services.json",
    import.meta.url,
  ),
);
export async function servicesController() {
  const content = JSON.parse(await readFile(source, "utf8")) as {
    items: unknown[];
  };
  return { services: content.items };
}
