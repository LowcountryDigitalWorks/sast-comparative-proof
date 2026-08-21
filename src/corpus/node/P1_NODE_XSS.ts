import { createServer } from "node:http";

export const proofId = "P1_NODE_XSS" as const;

export const nodeXssVulnerable = createServer((request, response) => {
  const requestUrl = new URL(request.url ?? "/", "http://synthetic.invalid");
  const displayName = requestUrl.searchParams.get("displayName") ?? "anonymous";
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.end(`<main>Hello ${displayName}</main>`);
});
