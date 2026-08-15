
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

let client: postgres.Sql | undefined;

export function getSql() {
  if (!client) {
    const url = process.env.DATABASE_URL ?? process.env.CONTACT_INTEGRATION_DATABASE_URL;
    if (!url) throw new Error("CONTACT_DATABASE_UNAVAILABLE");
    client = postgres(url, {
      max: 3,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false, // PgBouncer/serverless pools cannot safely reuse prepared statements.
      ssl: process.env.NODE_ENV === "production" ? "require" : undefined,
    });
  }
  return client;
}

export function getDb() {
  return drizzle(getSql(), { schema });
}
