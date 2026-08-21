import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const repositoryRoot = resolve(import.meta.dirname, "..");
const expectedProofs = new Map([
  ["V1_HONO_XSS", "src/corpus/hono/V1_HONO_XSS.ts"],
  ["V2_HONO_REDIRECT", "src/corpus/hono/V2_HONO_REDIRECT.ts"],
  ["V3_HONO_PATH", "src/corpus/hono/V3_HONO_PATH.ts"],
  ["V4_HONO_D1_SQL", "src/corpus/hono/V4_HONO_D1_SQL.ts"],
  ["P1_NODE_XSS", "src/corpus/node/P1_NODE_XSS.ts"],
  ["P2_NODE_REDIRECT", "src/corpus/node/P2_NODE_REDIRECT.ts"],
  ["P3_NODE_PATH", "src/corpus/node/P3_NODE_PATH.ts"],
  ["N1_HONO_XSS_SAFE", "src/corpus/hono/N1_HONO_XSS_SAFE.ts"],
  ["N2_HONO_REDIRECT_SAFE", "src/corpus/hono/N2_HONO_REDIRECT_SAFE.ts"],
  ["N3_HONO_PATH_SAFE", "src/corpus/hono/N3_HONO_PATH_SAFE.ts"],
  ["N4_HONO_D1_SQL_SAFE", "src/corpus/hono/N4_HONO_D1_SQL_SAFE.ts"],
  ["N5_NODE_XSS_SAFE", "src/corpus/node/N5_NODE_XSS_SAFE.ts"],
  ["N6_NODE_REDIRECT_SAFE", "src/corpus/node/N6_NODE_REDIRECT_SAFE.ts"],
  ["N7_NODE_PATH_SAFE", "src/corpus/node/N7_NODE_PATH_SAFE.ts"],
]);

const combined = [];
for (const [proofId, path] of expectedProofs) {
  const content = await readFile(resolve(repositoryRoot, path), "utf8");
  const declaration = `export const proofId = "${proofId}" as const;`;
  if (content.split(declaration).length !== 2) {
    throw new Error(
      `${proofId} must appear exactly once as the proofId in ${path}`,
    );
  }
  combined.push(content);
}

const corpus = combined.join("\n");
for (const forbidden of [
  /\.listen\s*\(/u,
  /\bfetch\s*\(/u,
  /\bwrangler\b/iu,
  /\bdeploy(?:ment)?\b/iu,
]) {
  if (forbidden.test(corpus)) {
    throw new Error(
      `corpus contains forbidden runtime/deployment capability: ${forbidden}`,
    );
  }
}

process.stdout.write(
  `Verified ${expectedProofs.size} isolated proof identifiers.\n`,
);
