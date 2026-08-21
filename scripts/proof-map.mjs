const proofByPath = new Map([
  ["src/corpus/hono/V1_HONO_XSS.ts", "V1_HONO_XSS"],
  ["src/corpus/hono/V2_HONO_REDIRECT.ts", "V2_HONO_REDIRECT"],
  ["src/corpus/hono/V3_HONO_PATH.ts", "V3_HONO_PATH"],
  ["src/corpus/hono/V4_HONO_D1_SQL.ts", "V4_HONO_D1_SQL"],
  ["src/corpus/node/P1_NODE_XSS.ts", "P1_NODE_XSS"],
  ["src/corpus/node/P2_NODE_REDIRECT.ts", "P2_NODE_REDIRECT"],
  ["src/corpus/node/P3_NODE_PATH.ts", "P3_NODE_PATH"],
  ["src/corpus/hono/N1_HONO_XSS_SAFE.ts", "N1_HONO_XSS_SAFE"],
  ["src/corpus/hono/N2_HONO_REDIRECT_SAFE.ts", "N2_HONO_REDIRECT_SAFE"],
  ["src/corpus/hono/N3_HONO_PATH_SAFE.ts", "N3_HONO_PATH_SAFE"],
  ["src/corpus/hono/N4_HONO_D1_SQL_SAFE.ts", "N4_HONO_D1_SQL_SAFE"],
  ["src/corpus/node/N5_NODE_XSS_SAFE.ts", "N5_NODE_XSS_SAFE"],
  ["src/corpus/node/N6_NODE_REDIRECT_SAFE.ts", "N6_NODE_REDIRECT_SAFE"],
  ["src/corpus/node/N7_NODE_PATH_SAFE.ts", "N7_NODE_PATH_SAFE"],
]);

export function normalizePath(path, projectKey = "") {
  let normalized = String(path ?? "").replaceAll("\\", "/");
  if (projectKey && normalized.startsWith(`${projectKey}:`)) {
    normalized = normalized.slice(projectKey.length + 1);
  }
  return normalized.replace(/^file:\/\//u, "").replace(/^\.\//u, "");
}

export function proofIdForPath(path) {
  const normalized = normalizePath(path);
  for (const [candidate, proofId] of proofByPath) {
    if (normalized === candidate || normalized.endsWith(`/${candidate}`))
      return proofId;
  }
  return null;
}
