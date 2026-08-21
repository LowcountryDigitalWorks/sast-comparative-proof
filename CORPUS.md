# Deterministic synthetic corpus

The corpus isolates realistic Hono/Cloudflare D1 canaries and pure-Node positive controls. A
scanner succeeds only when it reports the intended vulnerability and associates it with the
listed proof file (and, where exposed, the intended source-to-sink flow). Unrelated dependency,
secret, style, lint, and code-smell findings do not count.

| Proof ID                | Expected                    | Source                     | Sink/control                                                 | File                                       |
| ----------------------- | --------------------------- | -------------------------- | ------------------------------------------------------------ | ------------------------------------------ |
| `V1_HONO_XSS`           | Vulnerable                  | Hono path parameter        | Unescaped reflected `c.html()` response                      | `src/corpus/hono/V1_HONO_XSS.ts`           |
| `V2_HONO_REDIRECT`      | Vulnerable                  | Hono `FormData` field      | Request-derived `c.redirect()` destination                   | `src/corpus/hono/V2_HONO_REDIRECT.ts`      |
| `V3_HONO_PATH`          | Vulnerable                  | Hono query parameter       | Node `readFile()` path                                       | `src/corpus/hono/V3_HONO_PATH.ts`          |
| `V4_HONO_D1_SQL`        | Vulnerable                  | Hono query parameter       | Dynamically constructed SQL passed to D1 `prepare().first()` | `src/corpus/hono/V4_HONO_D1_SQL.ts`        |
| `P1_NODE_XSS`           | Vulnerable positive control | Node request URL parameter | Unescaped `ServerResponse.end()` HTML                        | `src/corpus/node/P1_NODE_XSS.ts`           |
| `P2_NODE_REDIRECT`      | Vulnerable positive control | Node request URL parameter | Request-derived `Location` response header                   | `src/corpus/node/P2_NODE_REDIRECT.ts`      |
| `P3_NODE_PATH`          | Vulnerable positive control | Node request URL parameter | Node `readFile()` path                                       | `src/corpus/node/P3_NODE_PATH.ts`          |
| `N1_HONO_XSS_SAFE`      | Safe                        | Hono path parameter        | HTML-encoded before `c.html()`                               | `src/corpus/hono/N1_HONO_XSS_SAFE.ts`      |
| `N2_HONO_REDIRECT_SAFE` | Safe                        | Hono form field            | Explicit local-path allowlist with fixed fallback            | `src/corpus/hono/N2_HONO_REDIRECT_SAFE.ts` |
| `N3_HONO_PATH_SAFE`     | Safe                        | Hono query parameter       | Filename allowlist mapped beneath a fixed directory          | `src/corpus/hono/N3_HONO_PATH_SAFE.ts`     |
| `N4_HONO_D1_SQL_SAFE`   | Safe                        | Hono query parameter       | Fixed SQL with D1 parameter binding                          | `src/corpus/hono/N4_HONO_D1_SQL_SAFE.ts`   |
| `N5_NODE_XSS_SAFE`      | Safe Node control           | Node request URL parameter | HTML-encoded before response                                 | `src/corpus/node/N5_NODE_XSS_SAFE.ts`      |
| `N6_NODE_REDIRECT_SAFE` | Safe Node control           | Node request URL parameter | Explicit local-path allowlist                                | `src/corpus/node/N6_NODE_REDIRECT_SAFE.ts` |
| `N7_NODE_PATH_SAFE`     | Safe Node control           | Node request URL parameter | Filename allowlist beneath a fixed directory                 | `src/corpus/node/N7_NODE_PATH_SAFE.ts`     |

No generic SQL positive control is included in Phase 1. Adding a database or framework solely
to create that control would change the authorized Hono/D1-focused shape; the D1 vulnerable and
parameter-bound pair directly measures the required boundary.

`corpus-manifest.json` contains SHA-256 values for every TypeScript corpus file. The top-level
`corpusSha256` is the SHA-256 of the sorted sequence `path`, a NUL byte, file hash, and newline.
Both scanner jobs recompute this value from the checked-out commit before scanning.
