import { readFile } from "node:fs/promises";

import { Hono } from "hono";

export const proofId = "V3_HONO_PATH" as const;

export const honoPathVulnerable = new Hono();

honoPathVulnerable.get("/proof/file", async (context) => {
  const requestedPath = context.req.query("path") ?? "missing.txt";
  const contents = await readFile(requestedPath, "utf8");
  return context.text(contents);
});
