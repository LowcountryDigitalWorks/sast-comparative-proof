import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { join } from "node:path";

export const proofId = "N7_NODE_PATH_SAFE" as const;

const SAFE_DIRECTORY = "/tmp/ldw-synthetic-proof";
const ALLOWED_FILES = new Set(["alpha.txt", "beta.txt"]);

export const nodePathSafe = createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? "/", "http://synthetic.invalid");
  const requested = requestUrl.searchParams.get("file") ?? "";
  const fileName = ALLOWED_FILES.has(requested) ? requested : "alpha.txt";
  const contents = await readFile(join(SAFE_DIRECTORY, fileName), "utf8");
  response.end(contents);
});
