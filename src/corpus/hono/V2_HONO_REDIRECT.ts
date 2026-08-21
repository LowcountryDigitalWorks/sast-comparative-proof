import { Hono } from "hono";

export const proofId = "V2_HONO_REDIRECT" as const;

export const honoRedirectVulnerable = new Hono();

honoRedirectVulnerable.post("/proof/redirect", async (context) => {
  const form = await context.req.formData();
  const destination = form.get("destination");
  return context.redirect(typeof destination === "string" ? destination : "/");
});
