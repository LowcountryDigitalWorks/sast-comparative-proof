import { Hono } from "hono";

import type { D1Database } from "../d1-types.js";

export const proofId = "N4_HONO_D1_SQL_SAFE" as const;

const FIND_USER = "SELECT id, display_name FROM synthetic_users WHERE id = ?";

export function createHonoD1SqlSafe(database: D1Database): Hono {
  const app = new Hono();

  app.get("/proof/safe/user", async (context) => {
    const userId = context.req.query("id") ?? "0";
    const row = await database.prepare(FIND_USER).bind(userId).first();
    return context.json(row);
  });

  return app;
}
