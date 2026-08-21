import { Hono } from "hono";

export const proofId = "V1_HONO_XSS" as const;

export const honoXssVulnerable = new Hono();

honoXssVulnerable.get("/proof/xss/:displayName", (context) => {
  const displayName = context.req.param("displayName");
  return context.html(`<main>Hello ${displayName}</main>`);
});
