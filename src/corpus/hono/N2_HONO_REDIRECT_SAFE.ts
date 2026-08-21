import { Hono } from "hono";

export const proofId = "N2_HONO_REDIRECT_SAFE" as const;

const ALLOWED_DESTINATIONS = new Set(["/", "/help"]);

export const honoRedirectSafe = new Hono();

honoRedirectSafe.post("/proof/safe/redirect", async (context) => {
  const form = await context.req.formData();
  const requested = form.get("destination");
  const destination =
    typeof requested === "string" && ALLOWED_DESTINATIONS.has(requested)
      ? requested
      : "/";
  return context.redirect(destination);
});
