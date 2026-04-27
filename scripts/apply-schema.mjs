import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is required to apply the schema.");
  process.exit(1);
}

const schemaPath = resolve(process.cwd(), "supabase/schema.sql");
const schema = await readFile(schemaPath, "utf8");
const sql = postgres(databaseUrl, { prepare: false });

try {
  await sql.unsafe(schema);
  console.log("Schema applied successfully.");
} finally {
  await sql.end();
}
