import { Hono } from "hono";

import type { D1Database } from "../d1-types.js";

export const proofId = "V4_HONO_D1_SQL" as const;

export function createHonoD1SqlVulnerable(database: D1Database): Hono {
  const app = new Hono();

  app.get("/proof/user", async (context) => {
    const userId = context.req.query("id") ?? "0";
    const query = `SELECT id, display_name FROM synthetic_users WHERE id = '${userId}'`;
    const row = await database.prepare(query).first();
    return context.json(row);
  });

  return app;
}
