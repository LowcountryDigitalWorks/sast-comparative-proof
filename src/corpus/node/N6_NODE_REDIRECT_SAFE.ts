import { createServer } from "node:http";

export const proofId = "N6_NODE_REDIRECT_SAFE" as const;

const ALLOWED_DESTINATIONS = new Set(["/", "/help"]);

export const nodeRedirectSafe = createServer((request, response) => {
  const requestUrl = new URL(request.url ?? "/", "http://synthetic.invalid");
  const requested = requestUrl.searchParams.get("destination") ?? "";
  const destination = ALLOWED_DESTINATIONS.has(requested) ? requested : "/";
  response.statusCode = 302;
  response.setHeader("Location", destination);
  response.end();
});
