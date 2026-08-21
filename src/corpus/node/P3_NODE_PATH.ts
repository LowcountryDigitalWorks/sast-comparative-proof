import { readFile } from "node:fs/promises";
import { createServer } from "node:http";

export const proofId = "P3_NODE_PATH" as const;

export const nodePathVulnerable = createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? "/", "http://synthetic.invalid");
  const requestedPath = requestUrl.searchParams.get("path") ?? "missing.txt";
  const contents = await readFile(requestedPath, "utf8");
  response.end(contents);
});
