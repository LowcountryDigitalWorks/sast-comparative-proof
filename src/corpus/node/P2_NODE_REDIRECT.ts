import { createServer } from "node:http";

export const proofId = "P2_NODE_REDIRECT" as const;

export const nodeRedirectVulnerable = createServer((request, response) => {
  const requestUrl = new URL(request.url ?? "/", "http://synthetic.invalid");
  const destination = requestUrl.searchParams.get("destination") ?? "/";
  response.statusCode = 302;
  response.setHeader("Location", destination);
  response.end();
});
