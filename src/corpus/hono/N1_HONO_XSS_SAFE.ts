import { Hono } from "hono";

import { escapeHtml } from "../shared/escape-html.js";

export const proofId = "N1_HONO_XSS_SAFE" as const;

export const honoXssSafe = new Hono();

honoXssSafe.get("/proof/safe/xss/:displayName", (context) => {
  const displayName = escapeHtml(context.req.param("displayName"));
  return context.html(`<main>Hello ${displayName}</main>`);
});
