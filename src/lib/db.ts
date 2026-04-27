import postgres from "postgres";
import { requireEnv } from "@/lib/env";

declare global {
  var __friendGraphSql: ReturnType<typeof postgres> | undefined;
}

export function getDb() {
  if (!globalThis.__friendGraphSql) {
    globalThis.__friendGraphSql = postgres(requireEnv("DATABASE_URL"), {
      prepare: false,
      max: 1,
    });
  }

  return globalThis.__friendGraphSql;
}
