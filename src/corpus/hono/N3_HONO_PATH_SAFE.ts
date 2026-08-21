import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { Hono } from "hono";

export const proofId = "N3_HONO_PATH_SAFE" as const;

const SAFE_DIRECTORY = "/tmp/ldw-synthetic-proof";
const ALLOWED_FILES = new Set(["alpha.txt", "beta.txt"]);

export const honoPathSafe = new Hono();

honoPathSafe.get("/proof/safe/file", async (context) => {
  const requested = context.req.query("file") ?? "";
  const fileName = ALLOWED_FILES.has(requested) ? requested : "alpha.txt";
  const contents = await readFile(join(SAFE_DIRECTORY, fileName), "utf8");
  return context.text(contents);
});
