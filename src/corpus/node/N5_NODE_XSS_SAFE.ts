import { createServer } from "node:http";

import { escapeHtml } from "../shared/escape-html.js";

export const proofId = "N5_NODE_XSS_SAFE" as const;

export const nodeXssSafe = createServer((request, response) => {
  const requestUrl = new URL(request.url ?? "/", "http://synthetic.invalid");
  const displayName = escapeHtml(
    requestUrl.searchParams.get("displayName") ?? "anonymous",
  );
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.end(`<main>Hello ${displayName}</main>`);
});
